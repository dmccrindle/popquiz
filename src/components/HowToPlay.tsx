"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Player colors matching the design ─── */
const players = [
  { number: 1, color: "#ff7bfd" },  // pink
  { number: 2, color: "#00cfff" },  // cyan
  { number: 3, color: "#34d399" },  // green
  { number: 4, color: "#f59e0b" },  // orange/amber
];

const modes = [
  {
    label: "Artist",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    label: "Song",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    label: "Year",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

/* ─── Hook: trigger animations when section scrolls into view ─── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Step 1: Players pop in one at a time ─── */
function Step1({ animate }: { animate: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 h-20">
      {players.map((p, i) => (
        <div
          key={p.number}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "scale(1)" : "scale(0)",
            transitionDelay: animate ? `${i * 300 + 200}ms` : "0ms",
          }}
        >
          <div
            className="w-14 h-14 rounded-full border-[2.5px] flex items-center justify-center text-white font-bold text-lg"
            style={{ borderColor: p.color }}
          >
            {p.number}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Step 2: Mode cards pop in ─── */
function Step2({ animate }: { animate: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 h-20">
      {modes.map((m, i) => (
        <div
          key={m.label}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "scale(1) translateY(0)" : "scale(0.8) translateY(12px)",
            transitionDelay: animate ? `${1400 + i * 250}ms` : "0ms",
          }}
        >
          <div className="w-20 h-20 rounded-xl border-2 border-white/30 flex flex-col items-center justify-center gap-1 text-white">
            {m.icon}
            <span className="text-[10px] font-semibold tracking-wide">{m.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Step 3: Mic tap → slide left → listening animation ─── */
function Step3({ animate }: { animate: boolean }) {
  const [phase, setPhase] = useState<"idle" | "mic-in" | "tapped" | "slid" | "listening">("idle");

  useEffect(() => {
    if (!animate) return;
    const timers: NodeJS.Timeout[] = [];
    // Mic appears
    timers.push(setTimeout(() => setPhase("mic-in"), 2400));
    // Tap effect
    timers.push(setTimeout(() => setPhase("tapped"), 3200));
    // Slide left
    timers.push(setTimeout(() => setPhase("slid"), 3800));
    // Show listening
    timers.push(setTimeout(() => setPhase("listening"), 4400));

    return () => timers.forEach(clearTimeout);
  }, [animate]);

  return (
    <div className="flex items-center justify-center h-20 relative">
      {/* Mic button + listening — centered as a group */}
      <div
        className="transition-all duration-500 ease-out flex items-center gap-4"
        style={{
          opacity: phase === "idle" ? 0 : 1,
          transform:
            phase === "idle"
              ? "scale(0)"
              : phase === "tapped"
              ? "scale(0.9)"
              : "scale(1)",
        }}
      >
        <div
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-white transition-all duration-300 ${
            phase === "tapped" ? "border-accent-pink bg-accent-pink/20" : "border-white/30"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </div>

        {/* Audio wave + Listening text */}
        <div
          className="flex items-center gap-3 transition-all duration-500"
          style={{
            opacity: phase === "listening" ? 1 : 0,
            transform: phase === "listening" ? "translateX(0)" : "translateX(-10px)",
          }}
        >
          {/* Animated wave bars */}
          <div className="flex items-center gap-[3px] h-8">
            {[4, 7, 5, 8].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-accent-pink"
                style={{
                  animation: phase === "listening" ? `wave 0.45s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                  height: `${h * 3}px`,
                }}
              />
            ))}
          </div>
          <span className="text-white font-semibold text-sm w-[90px]">
            Listening<AnimatedDots active={phase === "listening"} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated "..." dots ─── */
function AnimatedDots({ active }: { active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCount((c) => (c + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;
  return <span>{".".repeat(count)}</span>;
}

/* ─── Main Component ─── */
export default function HowToPlay() {
  const { ref, inView } = useInView(0.3);

  const steps = [
    {
      number: "Step 1",
      title: "Choose your players",
      description:
        "Two players. One iPhone. Game on. Pop Quiz Music splits the screen and puts you face to face for head to head music trivia. A question hits and both players race to buzz in first.",
      visual: <Step1 animate={inView} />,
    },
    {
      number: "Step 2",
      title: "Select a Mode",
      description:
        "Pick how you want to be quizzed. Name the artist, guess the song, or nail the year. Each mode keeps you on your toes in a different way.",
      visual: <Step2 animate={inView} />,
    },
    {
      number: "Step 3",
      title: "Game On",
      description:
        "A song drops and you say your answer out loud. Pop Quiz listens, scores it, and keeps the game moving. No typing. Just you and your music knowledge.",
      visual: <Step3 animate={inView} />,
    },
  ];

  return (
    <section id="how-to-play" className="relative pt-12 sm:pt-16 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#1a0a3a] to-background" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-accent-pink font-semibold tracking-wide uppercase mb-3">
            Easy as 1-2-3
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            How to Play
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center gap-5 p-6 rounded-2xl bg-white/[0.03] border border-white/5"
            >
              <p className="text-xs text-accent-pink font-semibold uppercase tracking-wider">
                {step.number}
              </p>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <div className="h-[80px] flex items-center justify-center">{step.visual}</div>
              <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                <span className="font-bold text-white/80">
                  {step.description.split(".").slice(0, 2).join(".") + "."}
                </span>{" "}
                {step.description.split(".").slice(2).join(".")}
              </p>
            </div>
          ))}
        </div>

        {/* AirPlay tip */}
        <div className="flex items-center justify-center gap-3 mt-10 text-white font-bold text-2xl">
          <span>Best Played on</span>
          <svg width="28" height="28" viewBox="0 0 46 46" fill="currentColor">
            <path d="M22.24 28.66 8.63 44.35c-.56.65-.1 1.66.76 1.66h27.22c.86 0 1.32-1.01.76-1.66L23.76 28.66a.999.999 0 0 0-1.51 0Z"/>
            <path d="M15 23c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.64-1.29 4.97-3.26 6.43l1.64 1.89c2.5-1.92 4.12-4.93 4.12-8.33 0-5.8-4.7-10.5-10.5-10.5s-10.5 4.7-10.5 10.5c0 3.4 1.62 6.41 4.12 8.33l1.64-1.89C16.29 27.97 15 25.64 15 23Z"/>
            <path d="M9 23c0-7.72 6.28-14 14-14s14 6.28 14 14c0 4.44-2.09 8.4-5.33 10.97l1.65 1.9c3.77-3.02 6.18-7.66 6.18-12.86 0-9.11-7.39-16.5-16.5-16.5S6.5 13.89 6.5 23c0 5.21 2.42 9.84 6.18 12.86l1.65-1.9C11.09 31.39 9 27.44 9 22.99Z"/>
            <path d="M2.5 23C2.5 11.7 11.7 2.5 23 2.5S43.5 11.7 43.5 23c0 6.4-2.95 12.12-7.56 15.88l1.65 1.9C42.73 36.56 46 30.16 46 23 46 10.3 35.7 0 23 0S0 10.3 0 23c0 7.17 3.28 13.56 8.41 17.78l1.65-1.9C5.45 35.12 2.5 29.4 2.5 23Z"/>
          </svg>
          <span>AirPlay</span>
        </div>
      </div>

      {/* Keyframe for wave bars */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.4); }
        }
      `}</style>
    </section>
  );
}
