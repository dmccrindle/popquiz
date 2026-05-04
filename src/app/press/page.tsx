import type { Metadata } from "next";
import PressNavbar from "@/components/PressNavbar";
import Footer from "@/components/Footer";
import PressGallery, { type PressImage } from "./PressGallery";
import PressVideo from "./PressVideo";

export const metadata: Metadata = {
  title: "Press Kit — Pop Quiz Music",
  description:
    "Press resources for Pop Quiz Music — a voice-powered music trivia game for iPhone, iPad, and Apple Watch. Press release, video, screenshots, and media contact.",
  alternates: { canonical: "https://popquizparty.com/press" },
  openGraph: {
    title: "Press Kit — Pop Quiz Music",
    description:
      "Voice-powered music trivia for iPhone, iPad, and Apple Watch. Press release, video, screenshots, and media contact.",
    url: "https://popquizparty.com/press",
    type: "article",
    images: [{ url: "/howtoplay-thumb.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Kit — Pop Quiz Music",
    description:
      "Voice-powered music trivia for iPhone, iPad, and Apple Watch. Press release, video, screenshots, and media contact.",
    images: ["/howtoplay-thumb.jpg"],
  },
};

const pressImages: PressImage[] = [
  {
    src: "/press/family.jpg",
    alt: "A family playing Pop Quiz Music together",
    caption:
      "Pop Quiz Music turns any gathering into a voice-powered trivia showdown — no extra hardware required.",
  },
  {
    src: "/press/iphone-home.jpg",
    alt: "Pop Quiz Music home screen on iPhone",
    caption:
      "The Pop Quiz Music home screen — daily trivia, head-to-head, and category playlists in one tap.",
  },
  {
    src: "/press/iphone-mic.jpg",
    alt: "Voice answer screen on iPhone",
    caption:
      "Voice-powered gameplay. Players hit the mic and shout the answer — no multiple choice.",
  },
  {
    src: "/press/iphone-categories.jpg",
    alt: "Curated genre playlists on iPhone",
    caption:
      "Curated playlists spanning Britpop, Classic Rock, ’90s Hip-Hop, K-Pop, Boy Bands, Legendary Divas, and more.",
  },
  {
    src: "/press/iphone-head-to-head.jpg",
    alt: "Head to Head two-player mode on iPhone",
    caption:
      "Head to Head — challenge a friend one-on-one from a single device. No second download needed.",
  },
  {
    src: "/press/iphone-taunts.jpg",
    alt: "Taunt animations on iPhone",
    caption:
      "Quick-tap taunts and reactions for stealing rounds and rubbing in comebacks.",
  },
  {
    src: "/press/ipad-party-mode.jpg",
    alt: "Four-player Party Mode on iPad",
    caption:
      "Party Mode on iPad — up to four players on a single device, with a podium screen for the winner.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline:
    "Pop Quiz Music Is a Voice-Powered Music Trivia Game That Turns Your Favorite Artists Into the Ultimate Party Challenge",
  description:
    "No multiple choice. Hit the mic and shout the answer. A new app lets you build a personalized music trivia game from over 100 million songs and play with friends from a single device.",
  author: { "@type": "Person", name: "David McCrindle" },
  publisher: { "@type": "Organization", name: "Pop Quiz Music" },
  inLanguage: "en-US",
  url: "https://popquizparty.com/press",
};

export default function PressPage() {
  return (
    <>
      <PressNavbar />
      <main id="main-content" className="bg-black text-white">
        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero video */}
        <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 bg-black">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent-pink">
                For Immediate Release
              </span>
              <span className="text-[11px] text-white/40">
                Minneapolis, MN
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Pop Quiz Music Is a Voice-Powered Music Trivia Game That Turns
              Your Favorite Artists Into the Ultimate Party Challenge
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 italic leading-relaxed max-w-3xl">
              No multiple choice. Hit the mic and shout the answer. A new app
              lets you build a personalized music trivia game from over 100
              million songs and play with friends from a single device.
            </p>

            <div className="mt-8 rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video">
              <PressVideo src="/popquizmusic.mp4" />
            </div>

          </div>
        </section>

        {/* Press release body */}
        <section className="py-12 sm:py-16 border-t border-white/5">
          <div className="mx-auto max-w-3xl px-6 prose-press">
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              <strong className="text-white">Minneapolis, MN</strong> // Pop
              Quiz Music, a new voice-powered music trivia game for iPhone,
              iPad, and Apple Watch, is now available on the App Store.
              Instead of picking from multiple choice answers, players hit the
              mic and speak their answers out loud. The app lets you add any
              artist you want, explore curated genre playlists, and play head
              to head or party mode from a single device with no extra
              downloads required.
            </p>
            <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed">
              The voice input changes the energy completely. It turns a quiz
              app into your own personal party game show. And because players
              can add any artist to their roster or dive into curated
              playlists covering Britpop, Classic Rock, &rsquo;90s Hip-Hop,
              One Hit Wonders, Boy Bands, Legendary Divas, and more, every
              session is different.
            </p>

            <h2 className="mt-12 text-xl sm:text-2xl font-extrabold tracking-tight">
              What Makes Pop Quiz Music Different
            </h2>
            <dl className="mt-6 space-y-5">
              {[
                {
                  term: "Voice-Powered Gameplay",
                  desc: "Hit the mic button and say your answer out loud. No multiple choice, no picking from a list. Pop Quiz Music uses on-device speech recognition to capture answers in real time, keeping the pace fast and the energy high.",
                },
                {
                  term: "Your Artists, Your Game",
                  desc: "Add any artist from a catalog of over 100 million songs. Build your own roster and get quizzed on the music you actually care about.",
                },
                {
                  term: "Curated Genre Playlists",
                  desc: "Not sure where to start? Jump into hand-picked playlists spanning Britpop, Classic Rock, ’90s Hip-Hop, Indie, Country, K-Pop, One Hit Wonders, Boy Bands, Legendary Divas, and more. New playlists added regularly.",
                },
                {
                  term: "Daily Trivia",
                  desc: "Three free questions every day. Build your streak, share your results with friends via a custom scorecard, and see how you stack up.",
                },
                {
                  term: "Head to Head (iPhone)",
                  desc: "Challenge a friend one-on-one from a single device. No second download needed.",
                },
                {
                  term: "Party Mode (iPad)",
                  desc: "Up to four players on iPad. Pick your genres, shout your answers, and crown a winner on the podium screen.",
                },
                {
                  term: "Apple Watch",
                  desc: "Quick voice-powered trivia rounds right from your wrist.",
                },
                {
                  term: "Crafted by a Music Fan",
                  desc: "Questions are written and curated by a real person, not generated by algorithm. Expect questions that are fun, surprising, and actually test what you know.",
                },
              ].map((f) => (
                <div key={f.term}>
                  <dt className="text-base font-bold text-white">{f.term}</dt>
                  <dd className="mt-1 text-base text-white/75 leading-relaxed">
                    {f.desc}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 text-xl sm:text-2xl font-extrabold tracking-tight">
              From the Creator
            </h2>
            <blockquote className="mt-5 border-l-2 border-accent-pink/60 pl-5 italic text-white/85 text-base sm:text-lg leading-relaxed">
              &ldquo;Every music trivia game I&rsquo;ve played is multiple
              choice. You&rsquo;re just tapping buttons. I wanted to build
              something where you shout the answer out loud. Where you curate
              the artists that are included. If you&rsquo;re obsessed with
              Radiohead or Dolly Parton or Bad Bunny, your game should reflect
              that. Voice input changes everything. It turns a quiz app into
              your own personal party game show.&rdquo;
              <footer className="not-italic mt-3 text-sm text-white/55">
                — David McCrindle, creator of Pop Quiz Music
              </footer>
            </blockquote>

            <h2 className="mt-12 text-xl sm:text-2xl font-extrabold tracking-tight">
              Availability and Pricing
            </h2>
            <p className="mt-5 text-base text-white/85 leading-relaxed">
              Pop Quiz Music is available now on the App Store for iPhone,
              iPad, and Apple Watch. Daily Trivia mode is completely free,
              with three new questions every day. A one-time purchase of $2.99
              unlocks Head to Head mode and Party Mode.
            </p>
            <ul className="mt-5 space-y-2 text-base text-white/85">
              <li>
                <span className="text-white/55">Website:</span>{" "}
                <a
                  href="https://popquizparty.com"
                  className="text-accent-pink hover:underline"
                >
                  popquizparty.com
                </a>
              </li>
              <li>
                <span className="text-white/55">App Store:</span>{" "}
                <a
                  href="https://apps.apple.com/us/app/pop-quiz-music/id6760779842"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-pink hover:underline"
                >
                  apps.apple.com/us/app/pop-quiz-music/id6760779842
                </a>
              </li>
            </ul>

            <h2 className="mt-12 text-xl sm:text-2xl font-extrabold tracking-tight">
              About Pop Quiz Music
            </h2>
            <p className="mt-5 text-base text-white/85 leading-relaxed">
              Pop Quiz Music is an independent, voice-powered music trivia
              game designed, built, and shipped by David McCrindle, a solo
              developer and design leader with over 20 years of experience in
              UX and product design. Based in Minneapolis, Minnesota, David
              built the app using SwiftUI and AI-assisted development tools,
              combining decades of product craft with a new approach to how
              software gets made. Pop Quiz Music is available on the App Store
              for iPhone, iPad, and Apple Watch.
            </p>

            <h2 className="mt-12 text-xl sm:text-2xl font-extrabold tracking-tight">
              Media Contact
            </h2>
            <address className="mt-5 not-italic text-base text-white/85 leading-relaxed">
              <strong className="text-white">David McCrindle</strong>
              <br />
              <span className="text-white/65">Creator, Pop Quiz Music</span>
              <br />
              <a
                href="mailto:davidmccrindle@mac.com"
                className="text-accent-pink hover:underline"
              >
                davidmccrindle@mac.com
              </a>
              <br />
              <a
                href="https://popquizparty.com"
                className="text-accent-pink hover:underline"
              >
                popquizparty.com
              </a>
            </address>

            <p className="mt-12 text-center text-sm text-white/30 tracking-widest">
              # # #
            </p>
          </div>
        </section>

        {/* Image gallery */}
        <section
          id="press-images"
          className="scroll-mt-24 py-12 sm:py-16 border-t border-white/5 bg-black"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider">
                  Press kit
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Screenshots & images
                </h2>
                <p className="mt-2 text-sm text-white/55 max-w-xl">
                  Click any image for a larger view, caption, and download.
                  All assets free to use for editorial coverage.
                </p>
              </div>
            </div>
            <PressGallery images={pressImages} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
