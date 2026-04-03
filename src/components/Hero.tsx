"use client";

import Image from "next/image";
import AnimatedRings from "./AnimatedRings";
import SignupForm from "./SignupForm";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle radial gradient behind the rings — centered at 60% to match ring position */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,_rgba(170,68,255,0.15)_0%,_transparent_70%)]" />

      {/* Animated concentric rings */}
      <AnimatedRings />

      {/* Content — 50/50 grid */}
      <div className="relative z-10 w-full pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 items-center [transform:translateZ(0)] [-webkit-transform:translateZ(0)]">
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
            <strong>Music trivia. Voice powered. Totally personal.</strong><br />{" "}
            <span className="text-white/80">Pop Quiz</span> listens to your
            answer, scores it on the spot, and lets you play with up to four
            friends on a single device. Add it to the roster and give your game
            nights the hit they deserve.
          </p>

          {/* Email signup form */}
          <div className="mt-2 w-full max-w-lg">
            <SignupForm />
          </div>

          {/* App Store badge */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 leading-none">Coming soon to the</span>
                <span className="text-sm font-semibold text-white leading-tight">App Store</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: device mockups */}
        {/* Mobile: stacked vertically. Desktop: overlapping absolute */}
        <div className="relative flex flex-col items-center gap-6 px-6 py-8 lg:block lg:px-0 lg:py-0 lg:min-h-[600px]">
          {/* iPhone — hidden on mobile, shown on desktop behind iPad */}
          <Image
            src="/pop-quiz-iphone.png"
            alt="Pop Quiz running on iPhone"
            width={294}
            height={436}
            className="hidden lg:block lg:absolute lg:z-0 lg:top-[8%] lg:left-[18%] lg:w-[32%] h-auto drop-shadow-2xl animate-float-delay"
          />
          {/* iPad — shown on all screen sizes */}
          <Image
            src="/pop-quiz-ipad.png"
            alt="Pop Quiz running on iPad"
            width={1284}
            height={968}
            priority
            className="w-[90%] h-auto drop-shadow-2xl animate-float lg:absolute lg:z-10 lg:bottom-[3%] lg:right-[5%] lg:w-[80%]"
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08081a] to-transparent" />
    </section>
  );
}
