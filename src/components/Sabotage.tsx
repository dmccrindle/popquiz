"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const emojis = ["😡", "💀", "🤡", "🍆", "🔥", "👻"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

let particleId = 0;

export default function Sabotage() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const spawnParticles = useCallback((emoji: string, originX: number, originY: number) => {
    const newParticles: Particle[] = Array.from({ length: 18 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      return {
        id: particleId++,
        emoji,
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.8,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Animate particles
    let frame = 0;
    const maxFrames = 60;

    const animate = () => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // gravity
            rotation: p.rotation + p.vx * 2,
            scale: p.scale * (1 - frame / maxFrames * 0.5),
          }))
          .filter((p) => frame < maxFrames)
      );

      if (frame < maxFrames) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleEmojiClick = useCallback(
    (emoji: string, e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(emoji, x, y);
    },
    [spawnParticles]
  );

  // Auto-trigger a random emoji burst when section scrolls into view
  const hasFiredRef = useRef(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFiredRef.current) {
          hasFiredRef.current = true;
          obs.disconnect();
          const rect = el.getBoundingClientRect();
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          const x = rect.width * 0.18;
          const y = rect.height * 0.65;
          spawnParticles(randomEmoji, x, y);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [spawnParticles]);

  return (
    <section id="sabotage" className="relative pt-12 sm:pt-16 pb-0 bg-white text-gray-900 overflow-hidden">
      <div
        ref={containerRef}
        className="relative z-10 mx-auto max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-stretch"
      >
        {/* Left column: text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pb-12 sm:pb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wide mb-2">
            Listen all y&apos;all
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
            It&apos;s a Sabotage
          </h2>

          <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg">
            <span className="font-bold text-gray-900">
              While your opponent is on the clock, tap the screen to flood their
              side with emojis designed to throw them off.
            </span>{" "}
            Fireworks, skulls, laughing tears, whatever chaos you want.
            It&apos;s friendly sabotage that turns every question into a
            pressure cooker. Some people crack. Some people thrive. Either way,
            everyone&apos;s laughing.
          </p>

          {/* Emoji buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => handleEmojiClick(emoji, e)}
                className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-90 cursor-pointer select-none"
              >
                {emoji}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Go ahead, click one.
          </p>
        </div>

        {/* Right column: image */}
        <div className="flex items-stretch justify-center lg:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/taunted-love.jpg"
            alt="Sabotage feature"
            className="w-full max-w-[400px] object-cover rounded-t-[2.5rem] -mt-12 sm:-mt-16"
          />
        </div>

        {/* Particle layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute text-2xl select-none"
              style={{
                left: p.x,
                top: p.y,
                transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
                opacity: Math.max(0, p.scale / 1.4),
                willChange: "transform, opacity",
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
