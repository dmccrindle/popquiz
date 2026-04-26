"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchTrivia,
  fetchStats,
  formatDateKey,
  dateFromKey,
  TriviaQuestion,
  TriviaStatsDoc,
} from "@/lib/trivia";
import { useToast } from "./Toast";

type LoadedState = {
  questions: TriviaQuestion[];
  stats: TriviaStatsDoc | null;
};

export default function StatsPanel() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LoadedState | null>(null);

  const load = useCallback(
    async (d: Date) => {
      setLoading(true);
      try {
        const dateKey = formatDateKey(d);
        const [trivia, stats] = await Promise.all([fetchTrivia(dateKey), fetchStats(dateKey)]);
        setData({ questions: trivia?.questions || [], stats });
      } catch (e) {
        toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    load(date);
  }, [date, load]);

  function shiftDate(delta: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  }

  return (
    <div className="px-8 py-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => shiftDate(-1)} className="nav-btn" aria-label="Previous">←</button>
        <input
          type="date"
          value={formatDateKey(date)}
          onChange={(e) => setDate(dateFromKey(e.target.value))}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-accent-pink/50 [color-scheme:dark]"
        />
        <button onClick={() => shiftDate(1)} className="nav-btn" aria-label="Next">→</button>
        <button onClick={() => setDate(new Date())} className="nav-btn" title="Today">★</button>
      </div>

      {loading && <p className="text-sm text-white/40">Loading…</p>}

      {!loading && data && !data.stats && (
        <p className="text-sm text-white/40 text-center py-12">
          {data.questions.length > 0
            ? "No answers recorded yet for this day."
            : "No trivia scheduled for this day."}
        </p>
      )}

      {!loading && data && data.stats && (
        <StatsContent questions={data.questions} stats={data.stats} />
      )}
    </div>
  );
}

function StatsContent({
  questions,
  stats,
}: {
  questions: TriviaQuestion[];
  stats: TriviaStatsDoc;
}) {
  let totalCorrect = 0,
    totalWrong = 0,
    totalSkipped = 0;
  for (let i = 0; i < 3; i++) {
    totalCorrect += (stats[`q${i}_correct`] as number | undefined) || 0;
    totalWrong += (stats[`q${i}_wrong`] as number | undefined) || 0;
    totalSkipped += (stats[`q${i}_skipped`] as number | undefined) || 0;
  }
  const totalAnswers = totalCorrect + totalWrong + totalSkipped;
  const uniquePlayers =
    Math.round((stats.total_attempts || 0) / 3) || Math.ceil(totalAnswers / 3);
  const overallPct = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <SummaryItem num={uniquePlayers} label="Players (est.)" />
        <SummaryItem num={totalAnswers} label="Total Answers" />
        <SummaryItem num={`${overallPct}%`} label="Correct Rate" highlight />
      </div>

      {[0, 1, 2].map((i) => {
        const correct = (stats[`q${i}_correct`] as number | undefined) || 0;
        const wrong = (stats[`q${i}_wrong`] as number | undefined) || 0;
        const skipped = (stats[`q${i}_skipped`] as number | undefined) || 0;
        const total = correct + wrong + skipped;
        const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
        const q = questions[i];

        return (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
          >
            <h3 className="text-xs font-bold text-accent-pink uppercase tracking-wider">
              Question {i + 1}
              {q?.answer && <span className="text-white/60 normal-case font-medium ml-2">— Answer: {q.answer}</span>}
            </h3>
            {q?.question && <p className="text-xs text-white/50 leading-relaxed">{q.question}</p>}
            <div className="space-y-2">
              <Bar label="Correct" pct={pct(correct)} count={correct} color="bg-emerald-500" labelColor="text-emerald-400" />
              <Bar label="Wrong" pct={pct(wrong)} count={wrong} color="bg-red-500" labelColor="text-red-400" />
              <Bar label="Skipped" pct={pct(skipped)} count={skipped} color="bg-white/40" labelColor="text-white/50" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SummaryItem({ num, label, highlight }: { num: string | number; label: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-extrabold ${highlight ? "text-accent-pink" : "text-white"}`}>
        {num}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function Bar({
  label,
  pct,
  count,
  color,
  labelColor,
}: {
  label: string;
  pct: number;
  count: number;
  color: string;
  labelColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-bold w-16 text-right ${labelColor}`}>{label}</span>
      <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden">
        <div
          className={`h-full ${color} flex items-center px-2 text-[10px] font-bold text-white transition-all duration-500`}
          style={{ width: `${Math.max(pct, 0)}%` }}
        >
          {pct > 8 ? `${pct}%` : ""}
        </div>
      </div>
      <span className="text-xs text-white/50 w-8 text-left">{count}</span>
    </div>
  );
}
