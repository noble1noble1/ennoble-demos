import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropVision — AI Property Investment Command Center",
  description:
    "Real-time property intelligence powered by AI. Analyze any US property with market trends, rent estimates, comparable sales, and AI-generated investment briefs.",
  keywords: [
    "property investment",
    "real estate analysis",
    "AI property valuation",
    "rent estimate",
    "comparable sales",
    "market trends",
    "investment brief",
    "cap rate calculator",
    "cash flow analysis",
  ],
  authors: [{ name: "PropVision AI" }],
  openGraph: {
    title: "PropVision — AI Property Investment Command Center",
    description:
      "Analyze any US property with AI-powered market intelligence from 14+ data sources.",
    type: "website",
    siteName: "PropVision",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropVision — AI Property Investment Command Center",
    description:
      "Real-time property intelligence powered by AI. 14+ data sources, instant analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  );
}
