import type { Metadata } from "next";
import { Fredoka, Gochi_Hand } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const gochi = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-gochi" });

export const metadata: Metadata = {
  title: "PulseBox: Anonymous Event Feedback",
  description: "Share your vibe. Speak your mind. Stay anonymous.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${gochi.variable}`}>
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id="warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="11" />
            <feDisplacementMap in="SourceGraphic" scale="110" />
          </filter>
        </svg>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}