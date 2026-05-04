"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PressImage = {
  src: string;
  thumb?: string;
  alt: string;
  caption: string;
};

export default function PressGallery({ images }: { images: PressImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((i: number) => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    setOpenIndex(i);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    previouslyFocused.current?.focus();
  }, []);

  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-sm text-white/40">
          Images coming soon. For early access, email{" "}
          <a
            href="mailto:davidmccrindle@mac.com"
            className="text-accent-pink hover:underline"
          >
            davidmccrindle@mac.com
          </a>
          .
        </p>
      </div>
    );
  }

  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full aspect-square rounded-xl overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label={`Open image: ${img.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb ?? img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          </li>
        ))}
      </ul>

      {active && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="press-lightbox-caption"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={close}
        >
          <div
            className="relative max-w-5xl w-full max-h-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/50">
                {openIndex + 1} / {images.length}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close image"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.alt}
                className="max-w-full max-h-[70vh] object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M11 4L6 9l5 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 4l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <p
                id="press-lightbox-caption"
                className="text-sm text-white/75 leading-relaxed flex-1 min-w-0"
              >
                {active.caption}
              </p>
              <a
                href={active.src}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-black shrink-0"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1v9m0 0l-3-3m3 3l3-3M2 13h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
