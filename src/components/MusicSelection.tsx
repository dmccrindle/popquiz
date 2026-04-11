"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const SPECIALTY_GENRES = [
  "Bedroom Pop", "Seattle Grunge", "Laurel Canyon", "Britpop", "Riot Grrrl",
  "Indie Sleaze", "Divas", "Goth", "Motown", "Ragtime", "Trip Hop", "Psych Rock",
  "Dancehall", "Reggaeton", "Industrial", "Madchester", "CBGB Punk", "Paisley Park",
  "Sunshine Pop", "Southern Rock", "Detroit Rock", "Power Ballads", "One-Hit Wonders",
  "Yacht Rock", "Boy Bands", "Girl Groups", "Summer Anthems",
];

const ITEM_PX = 88;

function GenreScrollMarquee() {
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const id = setInterval(() => setIndex((prev) => prev + 1), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (index === SPECIALTY_GENRES.length) {
      setWithTransition(false);
      setIndex(0);
    }
  }, [index]);

  useEffect(() => {
    if (!withTransition) {
      const t = setTimeout(() => setWithTransition(true), 50);
      return () => clearTimeout(t);
    }
  }, [withTransition]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        style={{
          transform: `translateY(-${index * ITEM_PX}px)`,
          transition: withTransition ? "transform 0.55s ease" : "none",
          willChange: "transform",
        }}
      >
        {[...SPECIALTY_GENRES, ...SPECIALTY_GENRES].map((name, i) => (
          <div
            key={i}
            className="flex items-center font-extrabold text-white opacity-[0.05] tracking-tight px-8"
            style={{ height: ITEM_PX, fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

const genres = [
  { label: "80s", color: "border-orange-400 text-orange-400" },
  { label: "Rock", color: "border-green-400 text-green-400" },
  { label: "90s", color: "border-pink-400 text-pink-400" },
  { label: "Pop\nPunk", color: "border-cyan-400 text-cyan-400" },
];

const artists = [
  { src: "/artist-1.svg" },
  { src: "/artist-2.svg" },
  { src: "/artist-3.svg" },
  { src: "/artist-4.svg" },
];

const rotatingWords = ["Funky", "Rock", "Pop", "Country", "Techno", "Indie", "New Wave"];
const INITIAL_DELAY = 1000;
const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const HOLD_DURATION = 2000;
const FIRST_HOLD = 1000;

function useRotatingWord() {
  const [display, setDisplay] = useState(rotatingWords[0]);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const indexRef = useRef(0);
  const startedRef = useRef(false);
  const isFirstRef = useRef(true);

  const animate = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const runCycle = () => {
      // Highlight current word — stays pink throughout
      setIsHighlighted(true);

      const holdTime = isFirstRef.current ? FIRST_HOLD : HOLD_DURATION;
      isFirstRef.current = false;

      setTimeout(() => {
        const currentWord = rotatingWords[indexRef.current];

        // Delete current word letter by letter
        let deletePos = currentWord.length;
        const deleteInterval = setInterval(() => {
          deletePos--;
          if (deletePos < 0) {
            clearInterval(deleteInterval);

            // Move to next word
            indexRef.current = (indexRef.current + 1) % rotatingWords.length;
            const nextWord = rotatingWords[indexRef.current];

            // Type new word letter by letter
            let typePos = 0;
            setDisplay("");
            const typeInterval = setInterval(() => {
              typePos++;
              setDisplay(nextWord.slice(0, typePos));
              if (typePos >= nextWord.length) {
                clearInterval(typeInterval);

                // Hold then continue — keep pink the whole time
                setTimeout(runCycle, HOLD_DURATION);
              }
            }, TYPE_SPEED);
          } else {
            setDisplay(currentWord.slice(0, deletePos));
          }
        }, DELETE_SPEED);
      }, holdTime);
    };

    // Initial delay before first animation
    setTimeout(runCycle, INITIAL_DELAY);
  }, []);

  return { display, isHighlighted, animate };
}

export default function MusicSelection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { display, isHighlighted, animate } = useRotatingWord();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          animate();
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered, animate]);

  return (
    <section
      id="your-music"
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-[#1a2744]"
    >
      <GenreScrollMarquee />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-white font-semibold tracking-wide mb-3">
            Whatever you want
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Play That{" "}
            <span
              className={`inline-block transition-colors duration-300 ${
                isHighlighted
                  ? "text-accent-pink"
                  : "text-white"
              }`}
            >
              {display}
              <span className="animate-blink ml-[1px] inline-block w-[3px] h-[0.85em] bg-accent-pink align-middle" />
            </span>{" "}
            Music
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you want to dive into a ready-made challenge or build your
            own, Pop Quiz gives you two ways to play.{" "}
            <span className="font-bold text-white/90">
              Pick from curated playlists or add the artists you love.
            </span>
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Curated Playlists */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-bold mb-6 text-white text-center">
              Curated Playlists
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {genres.map((genre) => (
                <div
                  key={genre.label}
                  className={`w-[96px] h-[96px] sm:w-[96px] sm:h-[96px] max-[480px]:w-[72px] max-[480px]:h-[72px] rounded-2xl border-2 ${genre.color} flex items-center justify-center font-bold text-lg max-[480px]:text-sm text-center leading-tight whitespace-pre-line`}
                >
                  {genre.label}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-white/80 leading-relaxed text-center max-w-md">
              Jump into curated playlists spanning genres, decades, and themes.
              Think you own the 90s? Prove it. Know every New Wave deep cut?
              There&apos;s a category for that. Pick a lane or mix it up and see
              how far your knowledge stretches.
            </p>
          </div>

          {/* The Artists You Love */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-bold mb-6 text-white text-center">
              The Artists You Love
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {artists.map((artist, i) => (
                <div
                  key={i}
                  className="w-[96px] h-[96px] sm:w-[96px] sm:h-[96px] max-[480px]:w-[72px] max-[480px]:h-[72px] rounded-2xl border-2 border-white overflow-hidden"
                >
                  <Image
                    src={artist.src}
                    alt={`Artist ${i + 1}`}
                    width={96}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-white/80 leading-relaxed text-center max-w-md">
              Add <span className="font-bold text-white/80">your</span> favorite
              artists and Pop Quiz builds trivia around the music you actually
              listen to. The more you add, the more unpredictable every round
              gets. Your taste. Your game. Every session feels like it was made
              just for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
