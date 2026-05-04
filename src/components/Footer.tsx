import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-8 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/50">
          © 2026{" "}
          <a
            href="https://davidmccrindle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
          >
            David McCrindle
          </a>
        </p>
        <div className="flex items-center gap-4">
          <Link href="/press" className="text-xs text-white/50 hover:text-white/80 transition-colors">
            Press
          </Link>
          <Link href="/feedback" className="text-xs text-white/50 hover:text-white/80 transition-colors">
            Feedback
          </Link>
          <Link href="/privacy" className="text-xs text-white/50 hover:text-white/80 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-white/50 hover:text-white/80 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
