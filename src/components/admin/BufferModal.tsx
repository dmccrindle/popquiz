"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAdminAuth } from "./AdminAuthGate";
import { useToast } from "./Toast";

export type BufferProfile = { service: string; id: string; username?: string };

const SERVICE_LIMITS: Record<string, number> = {
  twitter: 280,
  bluesky: 300,
  threads: 500,
};

const SERVICE_LABELS: Record<string, string> = {
  twitter: "X",
  bluesky: "Bluesky",
  threads: "Threads",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  mastodon: "Mastodon",
  pinterest: "Pinterest",
};

function defaultScheduledAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BufferModal({
  open,
  initialText,
  initialHashtags = [],
  initialVideoUrl = "",
  initialTopic = "",
  initialFollowUp = "",
  onClose,
  profiles,
  configured,
  error,
}: {
  open: boolean;
  initialText: string;
  initialHashtags?: string[];
  initialVideoUrl?: string;
  initialTopic?: string;
  initialFollowUp?: string;
  onClose: () => void;
  profiles: BufferProfile[];
  configured: boolean;
  error?: string | null;
}) {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [text, setText] = useState(initialText);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(profiles.map((p) => p.id))
  );
  const [whenLocal, setWhenLocal] = useState(defaultScheduledAt());
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [topic, setTopic] = useState(initialTopic);
  const [followUp, setFollowUp] = useState(initialFollowUp);
  const [submitting, setSubmitting] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setText(initialText);
      setSelectedIds(new Set(profiles.map((p) => p.id)));
      setWhenLocal(defaultScheduledAt());
      setVideoUrl(initialVideoUrl);
      setTopic(initialTopic);
      setFollowUp(initialFollowUp);
    }
  }, [open, initialText, initialVideoUrl, initialTopic, initialFollowUp, profiles]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function toggleProfile(id: string) {
    setSelectedIds((curr) => {
      const next = new Set(curr);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Preview the per-channel composed text so the user can sanity-check char counts.
  const selectedProfiles = useMemo(
    () => profiles.filter((p) => selectedIds.has(p.id)),
    [profiles, selectedIds]
  );

  const hashtagsLine =
    initialHashtags.length > 0
      ? initialHashtags.map((t) => `#${t}`).join(" ")
      : "";

  function composeForService(service: string): string {
    let body = text;
    if (videoUrl.trim()) body = `${body}\n\n${videoUrl.trim()}`;
    if (hashtagsLine && (service === "twitter" || service === "bluesky")) {
      body = `${body}\n\n${hashtagsLine}`;
    }
    return body;
  }

  const hasThreads = selectedProfiles.some((p) => p.service === "threads");

  async function submit() {
    if (!user) return;
    if (selectedIds.size === 0) {
      toast("Pick at least one channel", true);
      return;
    }
    const scheduled = new Date(whenLocal);
    if (Number.isNaN(scheduled.getTime())) {
      toast("Invalid date/time", true);
      return;
    }
    if (scheduled.getTime() <= Date.now()) {
      toast("Pick a future date/time", true);
      return;
    }

    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/buffer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          videoUrl: videoUrl.trim() || undefined,
          hashtags: initialHashtags.length > 0 ? initialHashtags : undefined,
          threadsTopic: topic.trim() || undefined,
          followUp: followUp.trim() || undefined,
          channels: selectedProfiles.map((p) => ({
            id: p.id,
            service: p.service,
          })),
          scheduledAt: Math.floor(scheduled.getTime() / 1000),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `${res.status}`);
      }
      toast("Scheduled to Buffer");
      onClose();
    } catch (e) {
      toast(`Buffer failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="buffer-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="buffer-modal-title" className="text-lg font-bold text-white">
            Schedule to Buffer
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {!configured && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-200">
            Buffer isn&apos;t configured. Set <code>BUFFER_ACCESS_TOKEN</code>{" "}
            in Vercel env vars and your connected channels will appear here.
          </div>
        )}

        {configured && error && (
          <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-200 break-words">
            <strong>Buffer API error:</strong> {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 leading-relaxed resize-y focus:outline-none focus:border-accent-pink/50"
          />
          <div className="text-[10px] text-white/40 flex items-center gap-3 flex-wrap">
            <span>{text.length} chars</span>
            {selectedProfiles.map((p) => {
              const limit = SERVICE_LIMITS[p.service];
              if (!limit) return null;
              const composed = composeForService(p.service);
              const over = composed.length > limit;
              return (
                <span
                  key={p.id}
                  className={over ? "text-red-400" : "text-white/40"}
                >
                  {SERVICE_LABELS[p.service] ?? p.service}: {composed.length}/{limit}
                  {over ? " over" : ""}
                </span>
              );
            })}
          </div>
          {(videoUrl.trim() || hashtagsLine) && (
            <p className="text-[10px] text-white/30 italic">
              {videoUrl.trim() && "Video URL appended to all channels. "}
              {hashtagsLine &&
                "Hashtags auto-appended on X / Bluesky (Threads uses Topic instead)."}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Channels
          </label>
          {profiles.length === 0 ? (
            <p className="text-xs text-white/40">
              No channels connected to Buffer yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => {
                const isOn = selectedIds.has(p.id);
                const label = SERVICE_LABELS[p.service] ?? p.service;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProfile(p.id)}
                    aria-pressed={isOn}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isOn
                        ? "border-accent-pink/60 bg-gradient-to-r from-accent-pink/15 to-accent-purple/15 text-white"
                        : "border-white/10 text-white/60 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {label}
                    {p.username && (
                      <span
                        className={`ml-1.5 text-[10px] ${
                          isOn ? "text-white/70" : "text-white/40"
                        }`}
                      >
                        {p.username}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="buffer-video"
            className="text-xs font-bold text-white/60 uppercase tracking-wider"
          >
            Video URL <span className="text-white/30 font-normal normal-case">(optional)</span>
          </label>
          <input
            id="buffer-video"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 focus:outline-none focus:border-accent-pink/50 placeholder:text-white/25"
          />
        </div>

        {hasThreads && (
          <div className="space-y-2">
            <label
              htmlFor="buffer-topic"
              className="text-xs font-bold text-white/60 uppercase tracking-wider"
            >
              Threads topic <span className="text-white/30 font-normal normal-case">(optional)</span>
            </label>
            <input
              id="buffer-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. music, throwback, ’80s"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 focus:outline-none focus:border-accent-pink/50 placeholder:text-white/25"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="buffer-followup"
            className="text-xs font-bold text-white/60 uppercase tracking-wider"
          >
            Follow-up reply <span className="text-white/30 font-normal normal-case">(optional, sent as a thread)</span>
          </label>
          <textarea
            id="buffer-followup"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            rows={2}
            placeholder="e.g. Play Bob Seger trivia at https://apps.apple.com/us/app/pop-quiz-music/id6760779842"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 leading-relaxed resize-y focus:outline-none focus:border-accent-pink/50 placeholder:text-white/25"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="buffer-when"
            className="text-xs font-bold text-white/60 uppercase tracking-wider"
          >
            Send at
          </label>
          <input
            id="buffer-when"
            type="datetime-local"
            value={whenLocal}
            onChange={(e) => setWhenLocal(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 focus:outline-none focus:border-accent-pink/50"
          />
          <p className="text-[10px] text-white/40">
            Local time. Buffer will post on schedule across selected channels.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !configured || selectedIds.size === 0}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? "Scheduling…" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
