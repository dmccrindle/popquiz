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
    system: [
      "You are the editorial brain for Pop Quiz Party — a music trivia party game's social channels.",
      "You produce two things each day:",
      "  (1) `items`: 5 newsworthy music moments ripe for social posts — mix anniversaries (album/song birthdays, milestone gigs), artists in the news, beef/awards/charts moments, fun trivia ties.",
      "  (2) `releases`: 3-10 notable single/album/EP releases — this week and the next ~3 weeks. Use only releases you are confident about from your training data; lean toward big-name artists, confirmed announcements, and well-publicized release calendars. Include only dates today or later.",
      "VOICE: knowledgeable friend who loves music. Drop a fact and a feeling. Assume the reader already cares — no need to convince them.",
      "DO write: specific concrete details (album titles, dates, session anecdotes, chart positions, lyric callouts that aren't dunks). Treat readers as peers.",
      "DO NOT write: engagement bait ('we'll wait', 'name one'), 'fans are FREAKING OUT', 'the internet can't handle', performative challenges, 'iconic', 'queen/king behavior', exclamation points, hashtag soup, marketing-deck phrases like 'cultural moment'.",
      "Skip generic celebrity gossip. Skip anything that wouldn't land with a music-savvy audience.",
      "Each suggested_post is 1-2 sentences. Read like something a knowledgeable friend would text you, not something a brand would post. No setup-punchline structure.",
      "Each release angle is one sharp sentence on why fans should care — same voice rules.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: `Today is ${dateStr} (${todayKey()}). Give me both sections: (a) 5 anniversaries/news moments for today, and (b) 3-10 notable upcoming releases between now and ~3 weeks out. Make every item specific — concrete artist names, titles, dates.`,
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
