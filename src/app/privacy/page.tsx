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
        <p className="text-sm text-white/40 mb-10">Last updated: April 2, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you sign up for early access, we collect your email address. We do not collect
              any other personal information through this website.
            </p>
            <p className="mt-3">
              When you use the Pop Quiz app, we may collect information necessary to operate the
              service, including device identifiers, usage data, and voice input processed solely
              to score your trivia answers. Voice data is not stored or used for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your email address to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Send you updates about Pop Quiz and its launch</li>
              <li>Invite you to participate in beta testing</li>
              <li>Communicate product news and announcements</li>
            </ul>
            <p className="mt-3">We will never sell or rent your email address to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Services</h2>
            <p>
              We use <strong className="text-white">Resend</strong> to manage our email list and
              send communications. Your email address is stored on Resend&apos;s servers in
              accordance with their{" "}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:opacity-80">
                privacy policy
              </a>.
            </p>
            <p className="mt-3">
              This website is hosted on <strong className="text-white">Vercel</strong>. Vercel may
              collect standard server logs (IP addresses, request metadata) as part of normal
              hosting operations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Your Rights</h2>
            <p>
              You may unsubscribe from our email list at any time by clicking the unsubscribe link
              in any email we send. You may also request that we delete your data by contacting us
              at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Children&apos;s Privacy</h2>
            <p>
              Pop Quiz is not directed at children under the age of 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify registered users of any
              material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
            <p>
              Questions about this policy? Reach us at{" "}
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
