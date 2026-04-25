import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://popquizparty.com"),
  title: "Pop Quiz — Music Trivia Party Game",
  description:
    "100 million songs. Fastest voice wins. Pop Quiz listens to your answer, scores it on the spot, and lets you play with up to four friends on any device.",
  alternates: {
    canonical: "https://popquizparty.com",
  },
  openGraph: {
    title: "Pop Quiz — Music Trivia Party Game",
    description:
      "100 million songs. Fastest voice wins. Pop Quiz listens to your answer, scores it on the spot, and lets you play with up to four friends on any device.",
    url: "https://popquizparty.com",
    siteName: "Pop Quiz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pop Quiz — Music Trivia Party Game",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pop Quiz — Music Trivia Party Game",
    description:
      "100 million songs. Fastest voice wins. Pop Quiz listens to your answer, scores it on the spot, and lets you play with up to four friends on any device.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/mic.svg",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pop Quiz",
  description:
    "Voice-powered music trivia party game. 100 million songs. Fastest voice wins.",
  applicationCategory: "GameApplication",
  operatingSystem: "iOS",
  url: "https://popquizparty.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-pink focus:text-white focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
