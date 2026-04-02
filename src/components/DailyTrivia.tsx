"use client";

import { useEffect, useRef, useState } from "react";

const cards = [
  { src: "/trivia-card-1.svg", alt: "Trivia Card 1" },
  { src: "/trivia-card-2.svg", alt: "Trivia Card 2" },
  { src: "/trivia-card-3.svg", alt: "Trivia Card 3" },
];

// Fanned-out positions for the 3 cards
const fanPositions = [
  { x: -160, y: 10, rotate: 6.4 },
  { x: 40, y: -45, rotate: 2.9 },
  { x: -80, y: 55, rotate: -7.3 },
];

const DROP_TIMES = [400, 0, 800];
const landPositions = [
  { x: -30, y: 15, rotate: -3 },
  { x: 0, y: 0, rotate: 1 },
  { x: 25, y: -10, rotate: 4 },
];
const DROP_DURATION = 500;
const FAN_START = 1600;
const FAN_DURATION = 600;
const FLOAT_START = 2400;
const EXIT_TIMES = [6200, 6500, 5900];
const EXIT_DURATION = 700;
const CYCLE_DURATION = 8000;
const FIRST_EXIT = Math.min(...EXIT_TIMES);

// Record appears as cards start leaving
const RECORD_REVEAL_START = FIRST_EXIT;
const RECORD_REVEAL_DURATION = 800;

function VinylRecord() {
  // Generate groove rings with deterministic values (avoids hydration mismatch)
  const grooveRadii = [85, 82.8, 80.6, 78.4, 76.2, 74, 71.8, 69.6, 67.4, 65.2, 63];
  const grooveWidths = [0.7, 0.9, 0.65, 0.85, 0.75, 0.95, 0.7, 0.8, 0.9, 0.65, 0.8];
  const grooveOpacities = [0.10, 0.13, 0.09, 0.14, 0.11, 0.08, 0.12, 0.10, 0.13, 0.09, 0.11];
  const grooves = grooveRadii.map((r, i) => (
    <circle
      key={`groove-${i}`}
      cx="200"
      cy="200"
      r={r}
      fill="none"
      stroke="rgba(0,0,0,0.15)"
      strokeWidth={grooveWidths[i]}
      opacity={grooveOpacities[i]}
    />
  ));

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main record gradient — silver/platinum */}
        <radialGradient id="recordGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="30%" stopColor="#c8c8c8" />
          <stop offset="60%" stopColor="#a8a8a8" />
          <stop offset="85%" stopColor="#909090" />
          <stop offset="100%" stopColor="#787878" />
        </radialGradient>

        {/* Label gradient */}
        <radialGradient id="labelGrad" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </radialGradient>

        {/* Sheen — a sweeping highlight */}
        <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="65%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Subtle edge shadow */}
        <filter id="recordShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Outer disc */}
      <circle
        cx="200"
        cy="200"
        r="190"
        fill="url(#recordGrad)"
        filter="url(#recordShadow)"
      />

      {/* Outer rim */}
      <circle
        cx="200"
        cy="200"
        r="190"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />

      {/* Groove area — subtle concentric rings */}
      {grooves}

      {/* Sheen overlay */}
      <circle cx="200" cy="200" r="188" fill="url(#sheen)" />

      {/* Second sheen pass — perpendicular highlight */}
      <ellipse
        cx="160"
        cy="160"
        rx="100"
        ry="80"
        fill="rgba(255,255,255,0.06)"
        transform="rotate(-30, 160, 160)"
      />

      {/* Label area */}
      <circle cx="200" cy="200" r="58" fill="url(#labelGrad)" />
      <circle
        cx="200"
        cy="200"
        r="58"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.5"
      />

      {/* Center spindle hole */}
      <circle cx="200" cy="200" r="4" fill="#1a1a1a" />
      <circle
        cx="200"
        cy="200"
        r="5"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />

      {/* Label text */}
      <text
        x="200"
        y="192"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="SF Pro Rounded, sans-serif"
        opacity="0.8"
      >
        POP QUIZ
      </text>
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontFamily="SF Pro Rounded, sans-serif"
        opacity="0.5"
      >
        DAILY TRIVIA
      </text>
    </svg>
  );
}

export default function DailyTrivia() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(-1);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [focusedCard, setFocusedCard] = useState<number | null>(null);
  const isHovering = useRef(false);

  // Main animation loop
  useEffect(() => {
    if (elapsed === -1) return;

    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      let t = now - startTimeRef.current;

      // If hovering during float/exit phase, freeze time at just before first exit
      if (isHovering.current && t >= FIRST_EXIT) {
        t = FIRST_EXIT - 1;
        startTimeRef.current = now - t;
      }

      // Loop the animation
      if (t >= CYCLE_DURATION) {
        startTimeRef.current = now;
        t = 0;
        setFocusedCard(null);
      }

      setElapsed(t);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [elapsed === -1]);

  // Trigger on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && elapsed === -1) {
          setElapsed(0);
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [elapsed]);

  const handleMouseEnter = () => {
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    setFocusedCard(null);
  };

  const handleCardClick = (index: number) => {
    setFocusedCard((prev) => (prev === index ? null : index));
  };

  const isCardVisible = (index: number) => {
    if (elapsed === -1) return false;
    const dropTime = DROP_TIMES[index];
    const exitTime = EXIT_TIMES[index];
    return elapsed >= dropTime && elapsed < exitTime + EXIT_DURATION;
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    if (elapsed === -1) {
      return {
        transform: "translateY(-700px) rotate(-5deg) scale(0.85)",
        opacity: 0,
      };
    }

    const dropTime = DROP_TIMES[index];
    const exitTime = EXIT_TIMES[index];
    const fan = fanPositions[index];
    const land = landPositions[index];

    if (elapsed < dropTime) {
      return {
        transform: "translateY(-700px) rotate(-5deg) scale(0.85)",
        opacity: 0,
      };
    }

    if (elapsed < dropTime + DROP_DURATION) {
      return {
        transform: `translate(${land.x}px, ${land.y}px) rotate(${land.rotate}deg) scale(1)`,
        opacity: 1,
        transition: `transform ${DROP_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 300ms ease-out`,
      };
    }

    if (elapsed < FAN_START) {
      return {
        transform: `translate(${land.x}px, ${land.y}px) rotate(${land.rotate}deg) scale(1)`,
        opacity: 1,
      };
    }

    if (elapsed < FLOAT_START) {
      return {
        transform: `translate(${fan.x}px, ${fan.y}px) rotate(${fan.rotate}deg) scale(1)`,
        opacity: 1,
        transition: `transform ${FAN_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      };
    }

    if (elapsed < exitTime) {
      const floatElapsed = elapsed - FLOAT_START;
      const floatY = Math.sin((floatElapsed / 3000) * Math.PI) * 8;
      return {
        transform: `translate(${fan.x}px, ${fan.y + floatY}px) rotate(${fan.rotate}deg) scale(1)`,
        opacity: 1,
      };
    }

    if (elapsed < exitTime + EXIT_DURATION) {
      return {
        transform: `translate(${fan.x}px, 700px) rotate(${fan.rotate + 8}deg) scale(0.95)`,
        opacity: 1,
        transition: `transform ${EXIT_DURATION}ms cubic-bezier(0.55, 0, 1, 0.45)`,
      };
    }

    return {
      transform: `translate(${fan.x}px, 700px) rotate(${fan.rotate + 8}deg) scale(0.95)`,
      opacity: 1,
    };
  };

  // Record: once fully revealed, stays visible permanently
  const recordRevealed = useRef(false);
  const recordFullyRevealed = useRef(false);

  if (elapsed >= RECORD_REVEAL_START) {
    recordRevealed.current = true;
  }
  if (elapsed >= RECORD_REVEAL_START + RECORD_REVEAL_DURATION) {
    recordFullyRevealed.current = true;
  }

  const getRecordStyle = (): React.CSSProperties => {
    // Already done animating — stay full size forever
    if (recordFullyRevealed.current) {
      return {
        transform: "scale(1)",
        opacity: 1,
      };
    }

    // Not yet revealed
    if (!recordRevealed.current) {
      return {
        transform: "scale(0)",
        opacity: 0,
      };
    }

    // First reveal animation in progress
    const progress = Math.min(1, (elapsed - RECORD_REVEAL_START) / RECORD_REVEAL_DURATION);
    const eased = 1 - Math.pow(1 - progress, 3);
    return {
      transform: `scale(${eased})`,
      opacity: eased,
    };
  };

  const getZIndex = (index: number) => {
    if (focusedCard === index) return 10;
    return index + 1;
  };

  return (
    <section
      id="daily-trivia"
      ref={sectionRef}
      className="relative py-6 sm:py-8 bg-white text-gray-900 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Animated cards + record */}
          <div
            className="relative h-[340px] sm:h-[380px] lg:h-[420px] flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Spinning vinyl record — behind cards */}
            <div
              className="absolute w-[240px] sm:w-[280px] lg:w-[320px] aspect-square spin-record"
              style={{
                ...getRecordStyle(),
                zIndex: 0,
                willChange: "transform",
              }}
            >
              <VinylRecord />
            </div>

            {/* Cards */}
            {cards.map((card, i) => (
              <div
                key={i}
                className="absolute w-[280px] sm:w-[340px] lg:w-[400px]"
                style={{
                  ...getCardStyle(i),
                  zIndex: getZIndex(i),
                  filter:
                    "drop-shadow(0 12px 30px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06))",
                  willChange: "transform, opacity",
                  cursor: isCardVisible(i) ? "pointer" : "default",
                }}
                onClick={() => isCardVisible(i) && handleCardClick(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-auto rounded-2xl select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Right: Text content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="text-sm font-semibold text-gray-500 tracking-wide mb-2">
              ON THIS DAY
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-2">
              Daily Trivia
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
              The Winner Takes It All
            </p>
            <p className="text-base text-gray-600 leading-relaxed max-w-lg">
              <span className="font-bold text-gray-900">
                While your opponent is on the clock, tap the screen to flood
                their side with emojis
              </span>{" "}
              designed to throw them off. Fireballs, skulls, laughing tears,
              whatever chaos you want. It&apos;s friendly sabotage that turns
              every question into a pressure cooker. Some people crack. Some
              people thrive. Either way, everyone&apos;s laughing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
