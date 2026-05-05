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
      "A ready-to-paste social post (Instagram/TikTok caption length, ~120-200 chars). MUST include the relevant artist or band name explicitly. Voice rules in the system prompt apply."
    ),
  hashtags: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "3-5 hashtags relevant to this specific moment. NO # prefix in the strings. Lowercase, no spaces. Mix specific (artist/album) and broader (genre/era). Avoid generic spam tags like #music."
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

const BRIEF_TZ = "America/Chicago";

function dateKeyInTz(d: Date, tz = BRIEF_TZ): string {
  // en-CA gives YYYY-MM-DD output reliably with Intl
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function todayKey(): string {
  return dateKeyInTz(new Date());
}

export function tomorrowKey(): string {
  return dateKeyInTz(new Date(Date.now() + 24 * 60 * 60 * 1000));
}

function prettyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  // noon UTC keeps the printed weekday consistent regardless of timezone
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateBrief(targetDateKey?: string): Promise<Brief> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured.");
  }

  const dateKey = targetDateKey ?? todayKey();
  const dateStr = prettyDate(dateKey);

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
      "  (2) `releases`: 3-10 notable single/album/EP releases — this week and the next ~3 weeks. Use only releases you are confident about from your training data; lean toward big-name artists, confirmed announcements, and well-publicized release calendars. Include only dates on or after the target date.",
      "VOICE: knowledgeable friend who loves music. Drop a fact and a feeling. Assume the reader already cares — no need to convince them.",
      "DO write: specific concrete details (album titles, dates, session anecdotes, chart positions, lyric callouts that aren't dunks). Treat readers as peers.",
      "DO NOT write: engagement bait ('we'll wait', 'name one'), 'fans are FREAKING OUT', 'the internet can't handle', performative challenges, 'iconic', 'queen/king behavior', exclamation points, marketing-deck phrases like 'cultural moment'.",
      "Every suggested_post MUST mention the relevant artist/band name by name (e.g. 'Black Crowes', 'Springsteen'). Don't bury who it's about.",
      "Hashtags belong only in the `hashtags` array, never inline in suggested_post.",
      "Skip generic celebrity gossip. Skip anything that wouldn't land with a music-savvy audience.",
      "Each suggested_post is 1-2 sentences. Read like something a knowledgeable friend would text you, not something a brand would post. No setup-punchline structure.",
      "Each release angle is one sharp sentence on why fans should care — same voice rules.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: `Target date is ${dateStr} (${dateKey}). Anchor anniversaries and news moments to that exact date. Give me both sections: (a) 5 anniversaries/news moments for that day, and (b) 3-10 notable releases between that date and ~3 weeks out. Make every item specific — concrete artist names, titles, dates.`,
      },
    ],
  });

  return {
    dateKey,
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
