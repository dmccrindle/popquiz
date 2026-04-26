"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { fetchAllTriviaKeys, formatDateKey } from "@/lib/trivia";
import { useToast } from "./Toast";

export default function CalendarPanel() {
  const { toast } = useToast();
  const [calMonth, setCalMonth] = useState<Date>(new Date());
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const k = await fetchAllTriviaKeys();
      setKeys(k);
    } catch (e) {
      toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = formatDateKey(new Date());

  function shiftMonth(delta: number) {
    setCalMonth((curr) => {
      const d = new Date(curr);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  }

  return (
    <div className="px-8 py-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => shiftMonth(-1)} className="nav-btn" aria-label="Previous month">
          ←
        </button>
        <span className="text-base font-bold text-white min-w-[180px] text-center">
          {calMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button onClick={() => shiftMonth(1)} className="nav-btn" aria-label="Next month">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-white/40 py-2 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const date = new Date(year, month, d);
          const key = formatDateKey(date);
          const hasData = keys.has(key);
          const isToday = key === todayKey;

          const baseClasses =
            "aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-colors border";
          const stateClasses = hasData
            ? "bg-gradient-to-br from-accent-pink/30 to-accent-purple/30 border-accent-pink/40 text-white"
            : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20";
          const todayRing = isToday ? " ring-2 ring-amber-400" : "";

          return (
            <Link
              key={key}
              href={`/admin/editor?date=${key}`}
              className={`${baseClasses} ${stateClasses}${todayRing}`}
            >
              {d}
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-white/40 text-center pt-2">
        <span className="inline-block w-3 h-3 rounded bg-gradient-to-br from-accent-pink/60 to-accent-purple/60 align-middle mr-1.5" />
        Has questions
        <span className="mx-3">|</span>
        <span className="inline-block w-3 h-3 rounded ring-2 ring-amber-400 align-middle mr-1.5" />
        Today
        {loading && <span className="ml-3">Loading…</span>}
      </p>
    </div>
  );
}
