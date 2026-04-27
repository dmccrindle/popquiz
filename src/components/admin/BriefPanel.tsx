"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "./AdminAuthGate";
import { useToast } from "./Toast";

type BriefItem = {
  headline: string;
  angle: string;
  suggested_post: string;
};

type Brief = {
  dateKey: string;
  generatedAt: string;
  items: BriefItem[];
};

export default function BriefPanel() {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/brief", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `${res.status}`);
      }
      const data = (await res.json()) as { brief: Brief | null };
      setBrief(data.brief);
    } catch (e) {
      toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const generate = useCallback(async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/brief", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `${res.status}`);
      }
      const data = (await res.json()) as { brief: Brief };
      setBrief(data.brief);
      toast("Brief generated");
    } catch (e) {
      toast(`Failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setGenerating(false);
    }
  }, [user, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch {
      toast("Copy failed", true);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-4xl space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          {brief ? (
            <p className="text-sm text-white/50">
              Generated{" "}
              <span className="text-white/80">
                {new Date(brief.generatedAt).toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="text-sm text-white/50">
              {loading ? "Loading…" : "No brief for today yet."}
            </p>
          )}
        </div>
        <button
          onClick={generate}
          disabled={generating || loading}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? "Generating…" : brief ? "Regenerate" : "Generate brief"}
        </button>
      </div>

      {!brief && !loading && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-sm text-white/40">
            5 music moments — anniversaries, releases, news cycle — with ready-to-paste
            social posts. Cron generates one each morning at 7am ET, or generate manually here.
          </p>
        </div>
      )}

      {brief && (
        <div className="space-y-4">
          {brief.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {item.angle}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-accent-pink uppercase tracking-wider px-2 py-1 bg-accent-pink/10 rounded-full">
                  #{i + 1}
                </span>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                <p className="text-sm text-white/85 leading-relaxed flex-1">
                  &ldquo;{item.suggested_post}&rdquo;
                </p>
                <button
                  onClick={() => copy(item.suggested_post)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors"
                  aria-label="Copy post to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
