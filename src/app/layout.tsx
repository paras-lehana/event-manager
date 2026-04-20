import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AmbientScene } from "@/components/ui/AmbientScene";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StadiumFlow — Smart Venue Experience",
  description:
    "Navigate, order, and coordinate in real-time at the world's largest sporting venues. Powered by Google AI.",
  keywords: ["stadium", "venue", "smart", "AI", "navigation", "queue", "concessions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <AmbientScene />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
