"use client";

import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("You're on the list! We'll be in touch.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-accent-pink">{message}</p>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <form
        className="flex flex-row gap-3 w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Interested or want to help test?"
          required
          className="flex-1 min-w-0 px-5 py-3 rounded-full bg-white border border-white/20 text-sm text-gray-900 placeholder:text-gray-700 outline-none focus:ring-[3px] focus:ring-accent-pink transition-all"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "Signing up…" : "Sign Up"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-400 pl-2">{message}</p>
      )}
    </div>
  );
}
