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
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>(
      "a, button, [tabindex]:not([tabindex=\"-1\"])"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

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
  const textMuted = isLight ? "text-gray-500" : "text-white/60";
  const pillBg = isLight
    ? "bg-black/[0.06] border-black/10"
    : "bg-white/[0.07] border-white/10";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          aria-label="Pop Quiz — scroll to top"
          className="flex items-center"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <svg
            width="168"
            height="40"
            viewBox="0 0 610 145"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="transition-colors duration-300 mt-1"
          >
            <path
              d="M255.116 0C264.641 3.79454e-05 272.693 1.65223 279.27 4.95703C285.846 8.26186 290.779 12.8209 294.067 18.6328C296.986 23.7917 298.609 29.6241 298.937 36.1299C308.165 14.8698 329.346 0 354 0C387.137 0 414 26.8629 414 60C414 92.8031 387.676 119.456 355 119.99V145H352V119.966C319.789 118.911 294 92.4678 294 60C294 59.3783 294.011 58.7588 294.029 58.1416C290.851 63.6721 286.045 68.167 279.609 71.624C273.033 75.1567 264.868 76.9228 255.116 76.9229H237.086V120H208V0H255.116ZM47.1162 0C56.6413 3.79454e-05 64.6927 1.65223 71.2695 4.95703C77.8464 8.26186 82.7789 12.8209 86.0674 18.6328C89.3557 24.4447 91 31.1116 91 38.6328C91 39.5993 90.9676 40.5546 90.9062 41.499C98.7048 17.4154 121.319 0 148 0C181.137 0 208 26.8629 208 60C208 93.1371 181.137 120 148 120C114.863 120 88 93.1371 88 60C88 57.6781 88.132 55.387 88.3887 53.1338C87.7783 54.72 87.0618 56.268 86.2373 57.7773C83.0622 63.4753 78.1863 68.0913 71.6094 71.624C65.0325 75.1567 56.8681 76.9228 47.1162 76.9229H29.0859V120H0V0H47.1162ZM426.369 73.7549C426.369 88.8322 429.626 99.8034 436.139 106.667C442.764 113.53 451.692 116.962 462.921 116.962C473.926 116.962 482.629 113.531 489.03 106.667C495.431 99.8034 498.631 88.8322 498.631 73.7549V0H502V73.7549C502 89.5073 498.519 101.154 491.557 108.692C484.707 116.231 475.161 120 462.921 120C450.681 120 440.967 116.231 433.78 108.692C426.593 101.041 423 89.3948 423 73.7549V0H426.369V73.7549ZM520.711 120H517.711V0H520.711V120ZM608.212 3.40918L542.66 116.762H609.914V120H538.914V116.762L604.636 3.40918H541.128V0H608.212V3.40918ZM354 3C322.52 3 297 28.5198 297 60C297 90.8108 321.446 115.91 352 116.964V95H355V116.989C386.019 116.456 411 91.1462 411 60C411 28.5198 385.48 3 354 3ZM171.255 62.6748C169.615 62.6749 168.285 64.0044 168.285 65.6445C168.285 65.7032 168.288 65.7615 168.291 65.8193H168.284C168.253 77.2094 159.01 86.4333 147.612 86.4336C136.215 86.4336 126.972 77.2096 126.94 65.8193H126.934C126.937 65.7617 126.939 65.703 126.939 65.6445C126.939 64.0045 125.61 62.6748 123.97 62.6748C122.33 62.6749 121 64.0045 121 65.6445C121 65.703 121.003 65.7617 121.006 65.8193H121.001C121.03 79.4583 131.319 90.6854 144.561 92.1973C144.537 92.3494 144.526 92.5055 144.526 92.6641V102.913C144.526 104.618 145.908 106 147.612 106C149.317 106 150.699 104.618 150.699 102.913V92.6641C150.699 92.5054 150.686 92.3495 150.663 92.1973C163.905 90.6857 174.194 79.4586 174.224 65.8193H174.219C174.222 65.7615 174.225 65.7032 174.225 65.6445C174.225 64.0043 172.895 62.6748 171.255 62.6748ZM147.671 19C138.023 19 130.201 26.8215 130.201 36.4697V47.418H146.564C147.947 47.4185 149.068 48.5393 149.068 49.9219C149.068 51.3043 147.947 52.4253 146.564 52.4258H130.201V54.6387H153.669C155.051 54.6391 156.173 55.76 156.173 57.1426C156.173 58.5252 155.051 59.6461 153.669 59.6465H130.201V61.627H146.564C147.947 61.6274 149.068 62.7483 149.068 64.1309C149.068 65.5132 147.947 66.6343 146.564 66.6348H130.233C130.776 75.7947 138.375 83.0566 147.671 83.0566C157.319 83.056 165.141 75.2338 165.141 65.5859V36.4697C165.14 26.8219 157.319 19.0006 147.671 19ZM29.0859 53.6748H44.9043C50.4607 53.6748 54.5998 52.3642 57.3213 49.7432C60.0426 47.1221 61.4033 43.4189 61.4033 38.6328C61.4033 33.8465 60.0428 30.1426 57.3213 27.5215C54.5998 24.9004 50.4607 23.5898 44.9043 23.5898H29.0859V53.6748ZM237.086 53.6748H252.904C258.461 53.6748 262.6 52.3642 265.321 49.7432C268.043 47.1221 269.403 43.4189 269.403 38.6328C269.403 33.8465 268.043 30.1426 265.321 27.5215C262.6 24.9004 258.461 23.5898 252.904 23.5898H237.086V53.6748Z"
              fill={isLight ? "black" : "white"}
            />
          </svg>
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
              aria-current={activeIndex === i ? "true" : undefined}
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
          {/* Instagram — uncomment and add href when ready
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
          */}

          {/* TikTok — uncomment and add href when ready
          <a
            href="#"
            className={`${textMuted} hover:opacity-80 transition-colors duration-300`}
            aria-label="TikTok"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.18 8.18 0 003.76.92V6.69z" />
            </svg>
          </a>
          */}

          {/* Play Now CTA */}
          <a
            href="https://apps.apple.com/us/app/pop-quiz-music/id6760779842"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Pop Quiz Party on the App Store"
            className={`px-5 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-300 ${
              isLight
                ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                : "border-white text-white hover:bg-white hover:text-gray-900"
            }`}
          >
            Play Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 transition-colors duration-300 ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
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
          id="mobile-menu"
          ref={menuRef}
          className={`md:hidden mx-6 mb-4 px-4 pb-4 pt-2 flex flex-col gap-2 rounded-2xl backdrop-blur-md border transition-colors duration-300 ${pillBg}`}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeIndex === i ? "true" : undefined}
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
            href="https://apps.apple.com/us/app/pop-quiz-music/id6760779842"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Pop Quiz Party on the App Store"
            className={`mt-2 px-5 py-3 text-sm font-semibold rounded-full border-2 text-center transition-colors duration-300 ${
              isLight
                ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                : "border-white text-white hover:bg-white hover:text-gray-900"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Play Now
          </a>
        </div>
      )}
    </nav>
  );
}
