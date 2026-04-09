import Link from "next/link";
import type { Metadata } from "next";
import AnimatedRings from "@/components/AnimatedRings";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback — Pop Quiz",
  description: "Share a bug report, feature request, or general feedback about Pop Quiz Party.",
  alternates: { canonical: "https://popquizparty.com/feedback" },
};

export default function FeedbackPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Radial glow centered */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(170,68,255,0.12)_0%,_transparent_70%)]" />

      {/* Rings centered */}
      <AnimatedRings center />

      {/* Back link */}
      <div className="relative z-10 w-full max-w-lg px-6 pt-10">
        <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors inline-block">
          ← Back to Pop Quiz
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg px-6 py-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">Send Feedback</h1>
            <p className="text-sm text-white/50 mt-1">
              Found a bug? Have an idea? Just want to say hi? We&apos;re listening.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </div>

      {/* Bottom padding */}
      <div className="relative z-10 pb-10" />
    </div>
  );
}
