import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/layout/MenuBar";
import Dock from "@/components/layout/Dock";
import CustomCursor from "@/components/CustomCursor";
import DynamicBackground from "@/components/ui/DynamicBackground";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayoutWrapper>
          <NoiseOverlay />
          <DynamicBackground />
          <CustomCursor />
          <MenuBar />
          {children}
          <Dock />
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
