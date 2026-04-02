import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Pop Quiz",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-10 inline-block">
          ← Back to Pop Quiz
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms of Use</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: April 2, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing this website or using the Pop Quiz app, you agree to be bound by these
              Terms of Use. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Use of the Service</h2>
            <p>Pop Quiz is a music trivia game intended for personal, non-commercial entertainment. You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to reverse-engineer, copy, or redistribute the app or its content</li>
              <li>Use automated tools to access or scrape the service</li>
              <li>Interfere with or disrupt the integrity of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Intellectual Property</h2>
            <p>
              Pop Quiz and all associated content, branding, and software are owned by David McCrindle.
              All rights reserved. Music metadata and song information is sourced through licensed
              third-party providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Disclaimer of Warranties</h2>
            <p>
              Pop Quiz is provided &ldquo;as is&rdquo; without warranty of any kind. We make no guarantees
              regarding uptime, accuracy of trivia content, or fitness for a particular purpose.
              Use of the service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, David McCrindle shall not be liable for any
              indirect, incidental, or consequential damages arising out of your use of or inability
              to use Pop Quiz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service
              after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which David McCrindle
              is based, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <a href="mailto:legal@popquizparty.com" className="text-accent-pink hover:opacity-80">
                legal@popquizparty.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
