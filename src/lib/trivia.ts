import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const QUESTION_TYPES = [
  "On This Day",
  "General Knowledge",
  "Name the Artist",
  "Name the Song",
  "Finish the Lyric",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type TriviaQuestion = {
  questionType: QuestionType | string;
  artist: string;
  question: string;
  answer: string;
  funFact: string;
};

export type TriviaDoc = {
  date: string;
  dateKey: string;
  questions: TriviaQuestion[];
  updatedAt: string;
};

export type TriviaStatsDoc = {
  total_attempts?: number;
  [key: `q${number}_correct`]: number | undefined;
  [key: `q${number}_wrong`]: number | undefined;
  [key: `q${number}_skipped`]: number | undefined;
};

export function emptyQuestion(): TriviaQuestion {
  return { questionType: "On This Day", artist: "", question: "", answer: "", funFact: "" };
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplay(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAppDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function dateFromKey(key: string): Date {
  return new Date(key + "T12:00:00");
}

export async function fetchTrivia(dateKey: string): Promise<TriviaDoc | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "dailyTrivia", dateKey));
  return snap.exists() ? (snap.data() as TriviaDoc) : null;
}

export async function saveTrivia(date: Date, questions: TriviaQuestion[]): Promise<void> {
  const db = getFirebaseDb();
  const dateKey = formatDateKey(date);
  await setDoc(doc(db, "dailyTrivia", dateKey), {
    date: formatAppDate(date),
    dateKey,
    questions,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTrivia(dateKey: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "dailyTrivia", dateKey));
}

export async function fetchAllTriviaKeys(): Promise<Set<string>> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "dailyTrivia"));
  const keys = new Set<string>();
  snap.forEach((d) => keys.add(d.id));
  return keys;
}

export async function fetchStats(dateKey: string): Promise<TriviaStatsDoc | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "triviaStats", dateKey));
  return snap.exists() ? (snap.data() as TriviaStatsDoc) : null;
}

export function parseSwiftQuestions(text: string): (TriviaQuestion & { date?: string })[] {
  const results: (TriviaQuestion & { date?: string })[] = [];
  const marker = "TriviaQuestion(";
  let pos = 0;

  while (true) {
    const start = text.indexOf(marker, pos);
    if (start === -1) break;

    let depth = 0;
    let i = start + marker.length - 1;
    let inString = false;
    let escaped = false;
    for (; i < text.length; i++) {
      const ch = text[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "(") depth++;
      if (ch === ")") {
        depth--;
        if (depth === 0) break;
      }
    }

    const inner = text.substring(start + marker.length, i);
    pos = i + 1;

    const get = (key: string): string => {
      const idx = inner.indexOf(key + ":");
      if (idx === -1) return "";
      const q1 = inner.indexOf('"', idx + key.length + 1);
      if (q1 === -1) return "";
      let q2 = q1 + 1;
      while (q2 < inner.length) {
        if (inner[q2] === "\\") {
          q2 += 2;
          continue;
        }
        if (inner[q2] === '"') break;
        q2++;
      }
      return inner
        .substring(q1 + 1, q2)
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n/g, "\n");
    };

    const q = get("question");
    const a = get("answer");
    if (q || a) {
      results.push({
        date: get("date"),
        questionType: get("questionType") || "General Knowledge",
        artist: get("artist") || "N/A",
        question: q,
        answer: a,
        funFact: get("funFact"),
      });
    }
  }

  return results;
}
