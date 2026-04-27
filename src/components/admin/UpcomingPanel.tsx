"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllTriviaKeys, formatDateKey } from "@/lib/trivia";
import { useToast } from "./Toast";

export default function UpcomingPanel() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const k = await fetchAllTriviaKeys();
        setKeys(k);
      } catch (e) {
        toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const key = formatDateKey(d);
    return {
      key,
      date: d,
      hasData: keys.has(key),
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-2 max-w-3xl">
      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : (
        days.map((d) => (
          <Link
            key={d.key}
            href={`/admin/editor?date=${d.key}`}
            className="grid grid-cols-[100px_1fr_auto] sm:grid-cols-[120px_1fr_auto] items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent-pink/40 transition-colors"
          >
            <span className="font-bold text-sm text-white">{d.label}</span>
            <span className="text-sm text-white/50 truncate">
              {d.hasData ? "Questions scheduled" : "No questions yet"}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                d.hasData
                  ? "bg-emerald-500/90 text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {d.hasData ? "Ready" : "Empty"}
            </span>
          </Link>
        ))
      )}
    </div>
  );
}
