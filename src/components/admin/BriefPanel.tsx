"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "./AdminAuthGate";
import { useToast } from "./Toast";
import BufferModal, { type BufferProfile } from "./BufferModal";

type BriefItem = {
  headline: string;
  artist?: string;
  angle: string;
  suggested_post: string;
  hashtags?: string[];
  video_search?: string; // suggested YouTube search (from LLM)
  video_url?: string; // user-pasted YouTube URL (client-only edit)
};


type ReleaseItem = {
  date: string;
  artist: string;
  title: string;
  type: "single" | "album" | "EP";
  angle: string;
};

type Brief = {
  dateKey: string;
  generatedAt: string;
  items: BriefItem[];
  releases?: ReleaseItem[];
};

type PromoSet = {
  generatedAt: string;
  items: BriefItem[];
};

const PROMOS_KEY = "promos";

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shortDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BriefPanel() {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [todayKey, setTodayKey] = useState("");
  const [tomorrowKey, setTomorrowKey] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const [promos, setPromos] = useState<PromoSet | null>(null);

  const [editedItems, setEditedItems] = useState<BriefItem[]>([]);
  const [editedReleases, setEditedReleases] = useState<ReleaseItem[]>([]);

  const isPromos = selectedKey === PROMOS_KEY;

  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [bufferConfigured, setBufferConfigured] = useState(false);
  const [bufferError, setBufferError] = useState<string | null>(null);
  const [bufferOpen, setBufferOpen] = useState(false);
  const [bufferText, setBufferText] = useState("");
  const [bufferHashtags, setBufferHashtags] = useState<string[]>([]);
  const [bufferVideoUrl, setBufferVideoUrl] = useState("");
  const [bufferTopic, setBufferTopic] = useState("");

  // Compute date keys client-side in the user's local timezone
  useEffect(() => {
    const t = localDateKey(new Date());
    const tm = localDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000));
    setTodayKey(t);
    setTomorrowKey(tm);
    setSelectedKey(t);
  }, []);

  useEffect(() => {
    if (isPromos) {
      setEditedItems(promos?.items ?? []);
      setEditedReleases([]);
    } else {
      setEditedItems(brief?.items ?? []);
      setEditedReleases(brief?.releases ?? []);
    }
  }, [brief, promos, isPromos]);

  const load = useCallback(
    async (key: string) => {
      if (!user || !key) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        if (key === PROMOS_KEY) {
          const res = await fetch("/api/admin/promos", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || `${res.status}`);
          }
          const data = (await res.json()) as { promos: PromoSet | null };
          setPromos(data.promos);
        } else {
          const res = await fetch(
            `/api/admin/brief?date=${encodeURIComponent(key)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || `${res.status}`);
          }
          const data = (await res.json()) as { brief: Brief | null };
          setBrief(data.brief);
        }
      } catch (e) {
        toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
      } finally {
        setLoading(false);
      }
    },
    [user, toast]
  );

  const generate = useCallback(async () => {
    if (!user || !selectedKey) return;
    setGenerating(true);
    try {
      const token = await user.getIdToken();
      if (selectedKey === PROMOS_KEY) {
        const res = await fetch("/api/admin/promos", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `${res.status}`);
        }
        const data = (await res.json()) as { promos: PromoSet };
        setPromos(data.promos);
        toast("Promos generated");
      } else {
        const res = await fetch("/api/admin/brief", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedKey }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `${res.status}`);
        }
        const data = (await res.json()) as { brief: Brief };
        setBrief(data.brief);
        toast("Brief generated");
      }
    } catch (e) {
      toast(`Failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setGenerating(false);
    }
  }, [user, toast, selectedKey]);

  useEffect(() => {
    if (selectedKey) load(selectedKey);
  }, [load, selectedKey]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/buffer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          configured: boolean;
          profiles: BufferProfile[];
          error?: string;
        };
        setBufferConfigured(data.configured);
        setBufferProfiles(data.profiles);
        setBufferError(data.error ?? null);
      } catch {
        // ignore — Buffer is optional
      }
    })();
  }, [user]);

  function openBuffer(
    text: string,
    opts?: {
      hashtags?: string[];
      videoUrl?: string;
      artist?: string;
    }
  ) {
    setBufferText(text);
    setBufferHashtags(opts?.hashtags ?? []);
    setBufferVideoUrl(opts?.videoUrl ?? "");
    setBufferTopic(opts?.artist ?? "");
    setBufferOpen(true);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch {
      toast("Copy failed", true);
    }
  }

  function updateItemPost(i: number, value: string) {
    setEditedItems((curr) =>
      curr.map((it, idx) => (idx === i ? { ...it, suggested_post: value } : it))
    );
  }

  function updateItemVideoUrl(i: number, value: string) {
    setEditedItems((curr) =>
      curr.map((it, idx) => (idx === i ? { ...it, video_url: value } : it))
    );
  }

  function updateReleaseAngle(i: number, value: string) {
    setEditedReleases((curr) =>
      curr.map((r, idx) => (idx === i ? { ...r, angle: value } : r))
    );
  }

  const tabs = [
    { key: todayKey, label: "Today", date: todayKey ? shortDate(todayKey) : "" },
    {
      key: tomorrowKey,
      label: "Tomorrow",
      date: tomorrowKey ? shortDate(tomorrowKey) : "",
    },
    { key: PROMOS_KEY, label: "Promos", date: "" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-6xl space-y-5 sm:space-y-6">
      {/* Today / Tomorrow tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => {
          const isActive = t.key === selectedKey;
          return (
            <button
              key={t.label}
              onClick={() => setSelectedKey(t.key)}
              disabled={!t.key}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                isActive
                  ? "border-accent-pink/60 bg-gradient-to-r from-accent-pink/15 to-accent-purple/15 text-white"
                  : "border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              {t.label}
              <span
                className={`ml-2 text-xs ${
                  isActive ? "text-white/70" : "text-white/40"
                }`}
              >
                {t.date}
              </span>
            </button>
          );
        })}
      </div>

      {(() => {
        const current = isPromos ? promos : brief;
        const hasContent = !!current;
        return (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              {current ? (
                <p className="text-sm text-white/50">
                  Generated{" "}
                  <span className="text-white/80">
                    {new Date(current.generatedAt).toLocaleString()}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-white/50">
                  {loading
                    ? "Loading…"
                    : isPromos
                    ? "No evergreen promos yet."
                    : "No brief for this day yet."}
                </p>
              )}
            </div>
            <button
              onClick={generate}
              disabled={generating || loading}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {generating
                ? "Generating…"
                : hasContent
                ? "Regenerate"
                : isPromos
                ? "Generate promos"
                : "Generate brief"}
            </button>
          </div>
        );
      })()}

      {!brief && !loading && !isPromos && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-sm text-white/40">
            5 music moments — anniversaries, releases, news cycle — with ready-to-paste
            social posts. Cron generates one each morning at 7am ET, or generate manually here.
          </p>
        </div>
      )}

      {!promos && !loading && isPromos && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-sm text-white/40">
            10 evergreen promo posts that mention Pop Quiz Music and link to the App
            Store — schedule them anytime. Generate once and reuse.
          </p>
        </div>
      )}

      <BufferModal
        open={bufferOpen}
        onClose={() => setBufferOpen(false)}
        initialText={bufferText}
        initialHashtags={bufferHashtags}
        initialVideoUrl={bufferVideoUrl}
        initialTopic={bufferTopic}
        profiles={bufferProfiles}
        configured={bufferConfigured}
        error={bufferError}
      />

      {brief && !isPromos && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Moments for {shortDate(brief.dateKey)}
            </h2>
            <div className="space-y-4">
              {editedItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white leading-tight">
                        {item.headline}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 leading-relaxed">
                        {item.angle}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-accent-pink uppercase tracking-wider px-2 py-1 bg-accent-pink/10 rounded-full shrink-0">
                      #{i + 1}
                    </span>
                  </div>
                  <textarea
                    value={item.suggested_post}
                    onChange={(e) => updateItemPost(i, e.target.value)}
                    rows={4}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white/85 leading-relaxed resize-y focus:outline-none focus:border-accent-pink/50"
                  />
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[10px] text-white/30">
                      {item.suggested_post.length} chars
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copy(item.suggested_post)}
                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() =>
                          openBuffer(item.suggested_post, {
                            hashtags: item.hashtags,
                            videoUrl: item.video_url,
                            artist: item.artist,
                          })
                        }
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                  {item.video_search && (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                          Video
                        </span>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.video_search)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-white/60 hover:text-white truncate max-w-full underline decoration-white/20 hover:decoration-white/60"
                          title={item.video_search}
                        >
                          {item.video_search}
                        </a>
                      </div>
                      <input
                        type="url"
                        value={item.video_url ?? ""}
                        onChange={(e) => updateItemVideoUrl(i, e.target.value)}
                        placeholder="Paste YouTube URL here"
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/85 focus:outline-none focus:border-accent-pink/50 placeholder:text-white/25"
                      />
                    </div>
                  )}
                  {item.hashtags && item.hashtags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                        Tags
                      </span>
                      {item.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      <button
                        onClick={() =>
                          copy((item.hashtags ?? []).map((t) => `#${t}`).join(" "))
                        }
                        className="ml-auto text-[10px] font-semibold text-white/50 hover:text-white transition-colors"
                      >
                        Copy tags
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {editedReleases.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Release watch
              </h2>
              <div className="space-y-4">
                {[...editedReleases]
                  .map((r, originalIdx) => ({ r, originalIdx }))
                  .sort((a, b) => a.r.date.localeCompare(b.r.date))
                  .map(({ r, originalIdx }) => {
                    const { label, isThisWeek, isPast } = formatReleaseDate(r.date);
                    return (
                      <div
                        key={`${r.date}-${r.artist}-${originalIdx}`}
                        className={`rounded-2xl border bg-white/[0.03] p-4 sm:p-5 space-y-3 flex flex-col ${
                          isPast ? "border-white/5 opacity-60" : "border-white/10"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                              {r.type}
                            </span>
                            {isThisWeek && !isPast && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink">
                                This week
                              </span>
                            )}
                            <span className="text-xs text-white/40">{label}</span>
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {r.artist} —{" "}
                            <span className="text-white/85">{r.title}</span>
                          </h3>
                        </div>
                        <textarea
                          value={r.angle}
                          onChange={(e) => updateReleaseAngle(originalIdx, e.target.value)}
                          rows={3}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white/85 leading-relaxed resize-y focus:outline-none focus:border-accent-pink/50"
                        />
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <span className="text-[10px] text-white/30">
                            {r.angle.length} chars
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                copy(`${r.artist} — ${r.title} (${label}). ${r.angle}`)
                              }
                              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() =>
                                openBuffer(
                                  `${r.artist} — ${r.title} (${label}). ${r.angle}`,
                                  { artist: r.artist }
                                )
                              }
                              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}
        </div>
      )}

      {promos && isPromos && (
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Evergreen promos · {editedItems.length} posts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {editedItems.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {item.headline}
                    </h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      {item.angle}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-accent-pink uppercase tracking-wider px-2 py-1 bg-accent-pink/10 rounded-full shrink-0">
                    #{i + 1}
                  </span>
                </div>
                <textarea
                  value={item.suggested_post}
                  onChange={(e) => updateItemPost(i, e.target.value)}
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white/85 leading-relaxed resize-y focus:outline-none focus:border-accent-pink/50"
                />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[10px] text-white/30">
                    {item.suggested_post.length} chars
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copy(item.suggested_post)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => openBuffer(item.suggested_post)}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Tags
                    </span>
                    {item.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    <button
                      onClick={() =>
                        copy((item.hashtags ?? []).map((t) => `#${t}`).join(" "))
                      }
                      className="ml-auto text-[10px] font-semibold text-white/50 hover:text-white transition-colors"
                    >
                      Copy tags
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatReleaseDate(iso: string): {
  label: string;
  isThisWeek: boolean;
  isPast: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(iso + "T12:00:00");
  if (Number.isNaN(release.getTime())) {
    return { label: iso, isThisWeek: false, isPast: false };
  }
  const diffDays = Math.round((release.getTime() - today.getTime()) / 86_400_000);
  const label = release.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return { label, isThisWeek: diffDays >= 0 && diffDays <= 6, isPast: diffDays < 0 };
}
