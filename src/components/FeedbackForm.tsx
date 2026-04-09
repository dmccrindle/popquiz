"use client";

import { useState } from "react";

const FEEDBACK_TYPES = ["Bug Report", "Feature Request", "General Feedback", "Question"] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export default function FeedbackForm() {
  const [type, setType] = useState<FeedbackType | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, name: name.trim() || undefined, email: email.trim() || undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="text-4xl" aria-hidden="true">🎶</div>
        <p className="text-lg font-semibold text-white">Thanks for the feedback!</p>
        <p className="text-sm text-white/60">We read every message and appreciate you taking the time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type pills */}
      <fieldset>
        <legend className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Type <span className="text-accent-pink">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_TYPES.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
                required
              />
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  type === t
                    ? "bg-gradient-to-r from-accent-pink to-accent-purple border-transparent text-white"
                    : "bg-white/5 border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="feedback-message" className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Message <span className="text-accent-pink">*</span>
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind…"
          required
          minLength={5}
          maxLength={5000}
          rows={5}
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="feedback-name" className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Name <span className="text-white/30 font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="feedback-email" className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Email <span className="text-white/30 font-normal normal-case tracking-normal">(if you'd like a reply)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent transition-all"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Feedback"}
      </button>
    </form>
  );
}
