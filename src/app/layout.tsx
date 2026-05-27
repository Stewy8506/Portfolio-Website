import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/layout/MenuBar";
import Dock from "@/components/layout/Dock";
import CustomCursor from "@/components/CustomCursor";
import DynamicBackground from "@/components/ui/DynamicBackground";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ScrollToTop from "@/components/ui/ScrollToTop";
import HashCanonicalizer from "@/components/layout/HashCanonicalizer";
import PresenceCursors from "@/components/ui/PresenceCursors";
import TerminalWindow from "@/components/ui/TerminalWindow";
import ChatWindow from "@/components/ui/ChatWindow";
import KonamiCode from "@/components/ui/KonamiCode";
import OnboardingTour from "@/components/ui/OnboardingTour";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anuvab Das | Full Stack Developer",
  description: "Premium portfolio of a full stack developer specializing in React Native, Flutter, and Next.js",
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayoutWrapper>
          <HashCanonicalizer />
          <NoiseOverlay />
          <DynamicBackground />
          <CustomCursor />
          <PresenceCursors />
          <OnboardingTour />
          <TerminalWindow />
          <ChatWindow />
          <KonamiCode />
          <MenuBar />
          {children}
          <Dock />
          <ScrollToTop />
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
