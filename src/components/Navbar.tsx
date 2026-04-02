"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const navLinks = [
  { label: "What is it?", href: "#what-is-it", sectionId: "what-is-it" },
  { label: "How to Play", href: "#how-to-play", sectionId: "how-to-play" },
  { label: "Your Music", href: "#your-music", sectionId: "your-music" },
  { label: "Daily Trivia", href: "#daily-trivia", sectionId: "daily-trivia" },
];

// Section IDs that have light (white) backgrounds
const lightSections = ["what-is-it", "sabotage", "daily-trivia"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [isLight, setIsLight] = useState(false);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isScrolling = useRef(false);

  // Measure pill position for active link
  const updatePill = useCallback((index: number) => {
    const el = navRefs.current[index];
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    });
  }, []);

  // Track which section is in view + detect light/dark bg
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120; // offset for navbar height

      // Always detect if navbar overlaps a light section (even during smooth scroll)
      // Use getBoundingClientRect for precise viewport-relative detection
      let overLight = false;
      for (const id of lightSections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Section is "under" the navbar when its top is above 60px and bottom is below 0
          if (rect.top < 60 && rect.bottom > 0) {
            overLight = true;
            break;
          }
        }
      }
      setIsLight(overLight);

      // Skip active index updates during smooth scroll to prevent jitter
      if (isScrolling.current) return;

      // Check sections in reverse to find the bottommost visible one
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].sectionId);
        if (section && section.offsetTop <= scrollY) {
          setActiveIndex(i);
          updatePill(i);
          return;
        }
      }

      // No section reached yet (still in hero) — no active link
      setActiveIndex(-1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updatePill]);

  // Update pill on resize
  useEffect(() => {
    const handleResize = () => updatePill(activeIndex);
    window.addEventListener("resize", handleResize);
    // Initial measurement after mount
    requestAnimationFrame(() => updatePill(activeIndex));
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, updatePill]);

  // Smooth scroll to section on click
  const handleNavClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      const section = document.getElementById(navLinks[index].sectionId);
      if (!section) return;

      setActiveIndex(index);
      updatePill(index);

      // Temporarily disable scroll tracking during smooth scroll
      isScrolling.current = true;
      section.scrollIntoView({ behavior: "smooth" });

      // Re-enable scroll tracking after animation
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    },
    [updatePill]
  );

  // Dynamic colors based on background
  const textColor = isLight ? "text-gray-900" : "text-white";
  const textMuted = isLight ? "text-gray-500" : "text-white/50";
  const pillBg = isLight
    ? "bg-black/[0.06] border-black/10"
    : "bg-white/[0.07] border-white/10";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-1 font-extrabold text-xl tracking-tight"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className={`transition-colors duration-300 ${textColor}`}>POP</span>
          <span className="text-accent-pink">QUIZ</span>
        </a>

        {/* Desktop nav pill container */}
        <div
          className={`hidden md:flex items-center relative rounded-full backdrop-blur-md border p-1 transition-colors duration-300 ${pillBg}`}
        >
          {/* Animated highlight pill */}
          <div
            className={`absolute top-1 h-[calc(100%-8px)] rounded-full bg-gradient-to-r from-accent-pink to-accent-purple transition-all duration-300 ease-out ${
              activeIndex === -1 ? "opacity-0" : "opacity-100"
            }`}
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
            }}
          />

          {navLinks.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => {
                navRefs.current[i] = el;
              }}
              href={link.href}
              onClick={(e) => handleNavClick(e, i)}
              className={`relative z-10 px-4 py-1.5 text-sm font-bold rounded-full transition-colors duration-200 whitespace-nowrap ${
                activeIndex === i
                  ? "text-white"
                  : `${textColor} hover:opacity-80`
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: social + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Instagram */}
          <a
            href="#"
            className={`${textMuted} hover:opacity-80 transition-colors duration-300`}
            aria-label="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1.5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="#"
            className={`${textMuted} hover:opacity-80 transition-colors duration-300`}
            aria-label="TikTok"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.18 8.18 0 003.76.92V6.69z" />
            </svg>
          </a>

          {/* Sign Up CTA */}
          <a
            href="#signup"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("signup")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white hover:opacity-90 transition-opacity"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 transition-colors duration-300 ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`md:hidden mx-6 mb-4 px-4 pb-4 pt-2 flex flex-col gap-2 rounded-2xl backdrop-blur-md border transition-colors duration-300 ${pillBg}`}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                activeIndex === i
                  ? "text-white bg-gradient-to-r from-accent-pink to-accent-purple"
                  : `${textColor} hover:opacity-70`
              }`}
              onClick={(e) => {
                handleNavClick(e, i);
                setMobileOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#signup"
            className="mt-2 px-5 py-3 text-sm font-semibold rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-center hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              document
                .getElementById("signup")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
}
