"use client";

import { useEffect, useRef, useState } from "react";

type Demo = {
  id: string;
  title: string;
  description: string;
  src: string;
  thumb: string;
};

const demos: Demo[] = [
  {
    id: "how-to-play",
    title: "How to play",
    description: "Pick a mode, choose your players, shout your answer.",
    src: "/howtoplay.mp4",
    thumb: "/howtoplay-thumb.jpg",
  },
  {
    id: "categories",
    title: "Pick a category",
    description: "Curated playlists from yacht rock to riot grrrl — find your zone.",
    src: "/categories.mp4",
    thumb: "/categories-thumb.jpg",
  },
  {
    id: "head2head",
    title: "Go head to head",
    description: "Two-player face-off. Fastest correct voice steals the round.",
    src: "/head2head.mp4",
    thumb: "/head2head-thumb.jpg",
  },
  {
    id: "4players",
    title: "Four player party mode",
    description: "Up to four people on one device. No extra hardware required.",
    src: "/4players.mp4",
    thumb: "/4players-thumb.jpg",
  },
  {
    id: "taunt",
    title: "Taunt your pals",
    description: "Call out a steal, rub in a comeback — quick reactions built in.",
    src: "/taunt.mp4",
    thumb: "/taunt-thumb.jpg",
  },
];

export default function AppDemos() {
  const [activeId, setActiveId] = useState<string>(demos[0].id);
  const [shouldPlay, setShouldPlay] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleSelect(id: string) {
    setActiveId(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      videoBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const active = demos.find((d) => d.id === activeId) ?? demos[0];

  return (
    <section
      ref={sectionRef}
      id="see-it-in-action"
      className="relative py-20 sm:py-24 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="sr-only">See the app in action</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Video player — second on mobile (after list), right column on desktop */}
          <div
            ref={videoBoxRef}
            className="order-1 lg:order-2 lg:sticky lg:top-24"
          >
            <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 mx-auto max-w-sm lg:max-w-md aspect-[3/4]">
              <video
                key={active.src}
                src={active.src}
                autoPlay={shouldPlay}
                muted
                loop
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label={`Demo video: ${active.title}. ${active.description}`}
              >
                <p className="text-white/60 p-4">
                  Your browser doesn&apos;t support video playback. {active.description}
                </p>
              </video>
            </div>
            <p className="text-center text-sm text-white/60 mt-4 lg:hidden">
              {active.title}
            </p>
          </div>

          {/* Demo list */}
          <ul className="order-2 lg:order-1 space-y-2" role="list">
            {demos.map((d) => {
              const isActive = d.id === activeId;
              return (
                <li key={d.id}>
                  <button
                    onClick={() => handleSelect(d.id)}
                    aria-pressed={isActive}
                    aria-label={`Play demo: ${d.title}`}
                    className={`w-full text-left flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      isActive
                        ? "border-accent-pink/60 bg-gradient-to-r from-accent-pink/10 to-accent-purple/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/30"
                    }`}
                  >
                    <div className="w-20 sm:w-24 aspect-[4/3] shrink-0 rounded-lg overflow-hidden bg-black border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.thumb}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-bold leading-tight ${
                          isActive ? "text-white" : "text-white/90"
                        }`}
                      >
                        {d.title}
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5 leading-snug line-clamp-2">
                        {d.description}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
