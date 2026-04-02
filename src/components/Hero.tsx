"use client";

import AnimatedRings from "./AnimatedRings";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle radial gradient behind the rings — centered at 60% to match ring position */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,_rgba(170,68,255,0.15)_0%,_transparent_70%)]" />

      {/* Animated concentric rings */}
      <AnimatedRings />

      {/* Content — 50/50 grid */}
      <div className="relative z-10 w-full pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left column: copy */}
        <div className="px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-12 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          <p className="text-sm text-accent-pink font-semibold tracking-wide uppercase">
            Shout, shout, let it all out.
          </p>

          <h1 className="text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight">
            11 million songs.
            <br />
            Fastest voice wins.
          </h1>

          <p className="max-w-lg text-base sm:text-lg text-white/80 leading-relaxed">
            Music trivia. Voice powered. Totally personal.{" "}
            <span className="text-white/80">Pop Quiz</span> listens to your
            answer, scores it on the spot, and lets you play with up to four
            friends on any device. Add it to the roster and give your game
            nights the hit they deserve.
          </p>

          {/* Email signup form */}
          <form
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Interested or want to help test?"
              className="flex-1 px-5 py-3 rounded-full bg-white border border-white/20 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-accent-pink/50 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>

          {/* App Store badge */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 leading-none">Coming soon to the</span>
                <span className="text-sm font-semibold text-white leading-tight">App Store</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: device mockup — 50% width, image bleeds off right edge */}
        <div className="flex items-center justify-center lg:justify-start overflow-visible px-6 lg:px-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pop-quiz-ipad-iphone.png"
            alt="Pop Quiz running on iPad and iPhone"
            className="w-[90%] max-w-none lg:w-[130%] h-auto drop-shadow-2xl animate-float"
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08081a] to-transparent" />
    </section>
  );
}
