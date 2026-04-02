export default function Footer() {
  return (
    <footer className="relative py-8 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/30">
          Copyright Smart Fella Inc 2025
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
