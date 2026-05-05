import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAdminDb } from "./firebase-admin";

const APP_STORE_URL = "https://apps.apple.com/us/app/pop-quiz-music/id6760779842";

const PromoItemSchema = z.object({
  headline: z
    .string()
    .describe(
      "Internal label so the human can scan the card — 2-5 words. e.g. 'Stevie Nicks deep cut', 'Yacht rock challenge'"
    ),
  angle: z
    .string()
    .describe("One sentence on why this post lands and who it targets."),
  suggested_post: z
    .string()
    .describe(
      `Ready-to-post social copy, 1-2 sentences. MUST mention 'Pop Quiz Music' by name and include the App Store URL ${APP_STORE_URL}. ~150-220 chars before URL. Voice rules in system prompt apply.`
    ),
  hashtags: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("2-5 hashtags. NO # prefix. Lowercase, no spaces."),
});

const PromoSetSchema = z.object({
  items: z.array(PromoItemSchema).length(10),
});

export type PromoItem = z.infer<typeof PromoItemSchema>;
export type PromoSet = {
  generatedAt: string;
  items: PromoItem[];
};

const PROMOS_DOC = "evergreen";

export async function generatePromos(): Promise<PromoSet> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured.");
  }

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: "claude-opus-4-7",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { format: zodOutputFormat(PromoSetSchema) },
    system: [
      "You are writing 10 evergreen promotional social posts for Pop Quiz Music — a voice-powered music trivia game on iPhone, iPad, and Apple Watch.",
      "Goal: make a music-savvy person curious enough to download the app.",
      "VOICE: knowledgeable friend who loves music. Drop a specific fact or feeling. Treat readers as peers — don't oversell.",
      `EVERY post MUST: (a) mention 'Pop Quiz Music' by name, (b) include this App Store URL exactly: ${APP_STORE_URL}, (c) be 1-2 sentences ~150-220 chars before the URL.`,
      "MIX angles across the 10. Examples: 'How well do you actually know [artist]?', 'Voice trivia, no multiple choice — built for [audience]', 'If you can name 3 [genre] one-hit wonders, you'd dominate', 'Best music trivia I've tried for actually beating my friends', specific genre/era hooks (Britpop, '90s hip-hop, yacht rock, riot grrrl, Boy Bands, Legendary Divas).",
      "DO NOT write: engagement bait ('tag a friend who would lose'), 'iconic', 'queen behavior', 'fans are FREAKING', exclamation points stacked, marketing-deck phrases. No #ad energy.",
      "Hashtags belong only in the hashtags array — never inline in the post.",
      "Headline is an internal label the admin uses to scan the card. Angle explains why the post lands. suggested_post is the actual ready-to-paste copy.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content:
          "Give me 10 evergreen promo posts, each with a different angle. Vary tone (curious / playful / dry / boasting). Mix specific artists, eras, and genres. Each post is ready to paste — don't put 'optionally' clauses in.",
      },
    ],
  });

  return {
    generatedAt: new Date().toISOString(),
    items: response.parsed_output?.items ?? [],
  };
}

export async function savePromos(promos: PromoSet): Promise<void> {
  const db = getAdminDb();
  await db.collection("promos").doc(PROMOS_DOC).set(promos);
}

export async function fetchPromos(): Promise<PromoSet | null> {
  const db = getAdminDb();
  const snap = await db.collection("promos").doc(PROMOS_DOC).get();
  return snap.exists ? (snap.data() as PromoSet) : null;
}
