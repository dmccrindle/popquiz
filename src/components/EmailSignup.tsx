"use client";

import SignupForm from "./SignupForm";

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
          Pop Quiz Party is live on the App Store. Drop your email to stay in
          the loop on new categories, features, and updates —{" "}
          <span className="text-white/80 font-medium">
            and be first to know what&apos;s dropping next
          </span>
          .
        </p>

        <div className="flex justify-center">
          <SignupForm />
        </div>

        <p className="mt-6 text-xs text-white/30">
          No spam. Just buzz. And the good kind.
        </p>
      </div>
    </section>
  );
}
