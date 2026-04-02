"use client";

export default function EmailSignup() {
  return (
    <section id="signup" className="relative py-24 overflow-hidden bg-black">
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm text-accent-pink font-semibold tracking-wide uppercase mb-3">
          Shout, shout, let it all out.
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-white">
          Don&apos;t You Forget About Me
        </h2>

        <p className="text-base text-white/80 leading-relaxed mb-8 max-w-xl mx-auto">
          Pop Quiz is almost ready to take the stage. Sign up to be first in
          line when it launches, get early updates, and{" "}
          <span className="text-white/80 font-medium">
            grab a spot as a beta tester
          </span>
          . Drop your email and we&apos;ll keep you in the loop.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Interested or want to help test?"
            className="flex-1 px-5 py-3 rounded-full bg-white border border-white/20 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-accent-pink/50 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-xs text-white/30">
          No spam. Just buzz. And the good kind.
        </p>
      </div>
    </section>
  );
}
