import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pop Quiz — Music Trivia Party Game",
  description:
    "11 million songs. Fastest voice wins. Pop Quiz listens to your answer, scores it on the spot, and lets you play with up to four friends on any device.",
  icons: {
    icon: "/mic.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
