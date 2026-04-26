import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAdminDb } from "./firebase-admin";

const BriefItemSchema = z.object({
  headline: z.string().describe("Short, punchy headline for the moment"),
  angle: z
    .string()
    .describe("Why this matters today — anniversary, release, news cycle, etc."),
  suggested_post: z
    .string()
    .describe(
      "A ready-to-paste social post (Instagram/TikTok caption length, ~120-200 chars). Voice: playful, music-fan energy, no hashtag soup."
    ),
});

const BriefSchema = z.object({
  items: z.array(BriefItemSchema).length(5),
});

export type BriefItem = z.infer<typeof BriefItemSchema>;
export type Brief = {
  dateKey: string;
  generatedAt: string;
  items: BriefItem[];
};

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function generateBrief(): Promise<Brief> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured.");
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: "claude-opus-4-7",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { format: zodOutputFormat(BriefSchema) },
    system: [
      "You are the editorial brain for Pop Quiz Party — a music trivia party game's social channels.",
      "Generate 5 newsworthy music moments for today that are ripe for social posts.",
      "Mix the formats: notable anniversaries (album/song birthdays, milestone gigs), upcoming/this-week releases, artists in the news cycle, beef/awards/charts moments, fun trivia ties.",
      "Skip generic celebrity gossip. Skip anything that wouldn't land with a music-savvy audience.",
      "Each suggested_post should sound like it was written by a music fan, not a marketer. Keep them short and shareable.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: `Today is ${dateStr}. Give me 5 music moments worth posting about today. Mix anniversaries, new releases, and current news. Make them specific and punchy — concrete artist names, album titles, dates, or stat references.`,
      },
    ],
  });

  return {
    dateKey: todayKey(),
    generatedAt: new Date().toISOString(),
    items: response.parsed_output?.items ?? [],
  };
}

export async function saveBrief(brief: Brief): Promise<void> {
  const db = getAdminDb();
  await db.collection("brief").doc(brief.dateKey).set(brief);
}

export async function fetchBrief(dateKey: string): Promise<Brief | null> {
  const db = getAdminDb();
  const snap = await db.collection("brief").doc(dateKey).get();
  return snap.exists ? (snap.data() as Brief) : null;
}
