import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pop Quiz",
  description:
    "Pop Quiz privacy policy: what we collect, how we use it, and your rights. We collect only your email address and will never sell it.",
  alternates: { canonical: "https://popquizparty.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-10 inline-block">
          ← Back to Pop Quiz
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: April 9, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="font-medium text-white/90">Website</p>
            <p className="mt-1">
              When signing up for early access, we collect your email address only.
            </p>
            <p className="font-medium text-white/90 mt-4">App</p>
            <p className="mt-1">Pop Quiz Party collects the following information when you use the app:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong className="text-white">Device information:</strong> A one-way hashed device identifier
                (used as an anonymous user ID), device model, and operating system version. We do not collect
                your name, email, or Apple ID through the app.
              </li>
              <li>
                <strong className="text-white">Gameplay data:</strong> Game scores, rounds played, game mode
                and category selections, level progression, XP earned, and games completed. This helps us
                understand how the game is played and improve the experience.
              </li>
              <li>
                <strong className="text-white">Feature usage:</strong> Screen views, categories and artists
                selected, songs favorited, input method used (voice or keyboard), and share actions.
              </li>
              <li>
                <strong className="text-white">Voice input:</strong> Processed on-device using Apple&apos;s
                Speech Recognition framework solely to score your trivia answers. Voice audio is not stored,
                transmitted to our servers, or used for any other purpose.
              </li>
              <li>
                <strong className="text-white">In-app purchases:</strong> Purchase events (product type and
                coin count) are recorded for analytics. All payment processing is handled by Apple through
                StoreKit — we never see or store your payment information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your email address to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Send updates about Pop Quiz Party and its launch</li>
              <li>Invite you to participate in beta testing</li>
              <li>Communicate product news and announcements</li>
            </ul>
            <p className="mt-3">We use anonymous app analytics to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Understand which game modes, categories, and features are most popular</li>
              <li>Monitor score distributions and level progression to balance gameplay</li>
              <li>Identify and fix bugs and performance issues</li>
              <li>Improve the overall player experience</li>
            </ul>
            <p className="mt-3">We will never sell or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Services</h2>
            <p>Pop Quiz Party uses the following third-party services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong className="text-white">TelemetryDeck</strong> — Privacy-focused analytics. Receives
                anonymous, hashed usage data (no personal identifiers, no cross-app tracking). See{" "}
                <a href="https://telemetrydeck.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:opacity-80">
                  TelemetryDeck&apos;s privacy policy
                </a>.
              </li>
              <li>
                <strong className="text-white">Apple Music (MusicKit)</strong> — Used to play song previews
                during gameplay. We access the Apple Music catalog but do not store or transmit your personal
                music library data.
              </li>
              <li>
                <strong className="text-white">Apple Game Center</strong> — Leaderboard scores and achievements
                are submitted to Game Center. This data is managed by Apple under their privacy policy.
              </li>
              <li>
                <strong className="text-white">Apple iCloud</strong> — Your game progress (XP, level, and game
                stats) is synced across your devices using iCloud key-value storage. This data is managed by Apple.
              </li>
              <li>
                <strong className="text-white">Apple Speech Recognition</strong> — Voice input is processed
                on-device to match your spoken answers. Audio is not sent to our servers.
              </li>
              <li>
                <strong className="text-white">Apple StoreKit</strong> — In-app purchases are processed
                entirely by Apple. We do not collect or store payment details.
              </li>
              <li>
                <strong className="text-white">Resend</strong> — Manages email communications. Your email
                address is stored according to{" "}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:opacity-80">
                  Resend&apos;s privacy policy
                </a>.
              </li>
              <li>
                <strong className="text-white">Vercel</strong> — Hosts our website. May collect standard
                server logs (IP addresses, request metadata) as part of normal hosting operations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Storage and Security</h2>
            <p>
              Gameplay analytics are sent to TelemetryDeck and are not linked to your identity. Game progress
              is stored locally on your device and optionally synced via iCloud. We do not maintain user
              accounts or databases containing personal information from the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Your Rights</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Unsubscribe from emails at any time using the link in any email</li>
              <li>Request deletion of your email data by contacting us</li>
              <li>Reset your in-app game progress through the app&apos;s settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Children&apos;s Privacy</h2>
            <p>
              Pop Quiz Party is not directed at children under the age of 13. We do not knowingly collect
              personal information from children under 13. If you believe a child under 13 has provided us
              with personal information, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Changes to This Policy</h2>
            <p>
              If we make material changes to this policy, we will notify registered users via email and
              update the &quot;Last Updated&quot; date above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
            <p>
              Questions about this privacy policy can be directed to{" "}
              <a href="mailto:privacy@popquizparty.com" className="text-accent-pink hover:opacity-80">
                privacy@popquizparty.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
