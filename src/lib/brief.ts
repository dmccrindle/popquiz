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

const ReleaseItemSchema = z.object({
  date: z
    .string()
    .describe("Release date in YYYY-MM-DD format. Must be today or in the future."),
  artist: z.string(),
  title: z.string().describe("Single, EP, or album title"),
  type: z.enum(["single", "album", "EP"]),
  angle: z
    .string()
    .describe(
      "One-sentence social angle: why fans should care, anticipated reaction, lineage, etc."
    ),
});

const BriefSchema = z.object({
  items: z.array(BriefItemSchema).length(5),
  releases: z.array(ReleaseItemSchema).min(3).max(10),
});

export type BriefItem = z.infer<typeof BriefItemSchema>;
export type ReleaseItem = z.infer<typeof ReleaseItemSchema>;
export type Brief = {
  dateKey: string;
  generatedAt: string;
  items: BriefItem[];
  releases: ReleaseItem[];
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
    tools: [{ type: "web_search_20260209", name: "web_search" }],
    system: [
      "You are the editorial brain for Pop Quiz Party — a music trivia party game's social channels.",
      "You produce two things each day:",
      "  (1) `items`: 5 newsworthy music moments ripe for social posts — mix anniversaries (album/song birthdays, milestone gigs), artists in the news, beef/awards/charts moments, fun trivia ties.",
      "  (2) `releases`: 3-10 notable upcoming single/album/EP releases — this week and the next ~3 weeks. Use web_search to verify release dates from credible sources (Pitchfork, Stereogum, Consequence, NME, Billboard, artist-official announcements). Include only dates today or later.",
      "Skip generic celebrity gossip. Skip anything that wouldn't land with a music-savvy audience.",
      "Each suggested_post should sound like it was written by a music fan, not a marketer. Keep them short and shareable.",
      "Each release angle is one sharp sentence on why fans should care.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: `Today is ${dateStr} (${todayKey()}). Use web_search to find: (a) anniversaries/news for today, and (b) confirmed upcoming music releases between now and ~3 weeks out. Return both sections in the schema. Make every item specific — concrete artist names, titles, dates.`,
      },
    ],
  });

  return {
    dateKey: todayKey(),
    generatedAt: new Date().toISOString(),
    items: response.parsed_output?.items ?? [],
    releases: response.parsed_output?.releases ?? [],
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
