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
          <a
            href="https://apps.apple.com/us/app/pop-quiz-music/id6760779842"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Pop Quiz Party on the App Store"
            className="mt-2 inline-block hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-lg"
          >
            <Image
              src="/download-on-the-app-store.svg"
              alt="Download on the App Store"
              width={156}
              height={52}
              priority
            />
          </a>
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
          {/* Apple Watch — hidden on mobile */}
          <Image
            src="/pop-quiz-watch.png"
            alt="Pop Quiz running on Apple Watch"
            width={400}
            height={476}
            className="hidden lg:block lg:absolute lg:z-20 lg:bottom-[12%] lg:left-[11%] lg:w-[19%] h-auto drop-shadow-2xl animate-float-delay"
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08081a] to-transparent" />
    </section>
  );
}
