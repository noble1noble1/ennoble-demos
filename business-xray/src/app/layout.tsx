import type { Metadata, Viewport } from "next";
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
  title: "BusinessXRay — AI Business Intelligence Scanner",
  description:
    "Scan any business website to reveal tech stack, SEO health, performance metrics, social presence, and AI readiness. Powered by AI.",
  keywords: [
    "business intelligence",
    "website scanner",
    "SEO audit",
    "tech stack detection",
    "AI readiness",
    "performance metrics",
    "competitor analysis",
  ],
  authors: [{ name: "BusinessXRay" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "BusinessXRay — AI Business Intelligence Scanner",
    description:
      "Instant AI-powered business intelligence from any URL. Scan tech stack, SEO, performance, and AI readiness in seconds.",
    type: "website",
    siteName: "BusinessXRay",
  },
  twitter: {
    card: "summary_large_image",
    title: "BusinessXRay — AI Business Intelligence Scanner",
    description:
      "Scan any business website in seconds. AI-powered tech stack detection, SEO audit, and performance analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
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
