import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import ThemeScript from "@/components/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostIQ – AI-Powered Creator Intelligence for LinkedIn",
  description: "PostIQ helps LinkedIn creators grow faster with AI post scoring, profile intelligence, hook generators, hashtag analytics, content calendar & competitor insights. Powered by AI at postiq.nexdial.io.",
  icons: {
    icon: "/postiq-icon.png",
    shortcut: "/postiq-icon.png",
    apple: "/postiq-icon.png",
  },
  openGraph: {
    title: "PostIQ – AI-Powered Creator Intelligence for LinkedIn",
    description: "PostIQ helps LinkedIn creators grow faster with AI post scoring, profile intelligence, hook generators, hashtag analytics, content calendar & competitor insights.",
    url: "https://postiq.nexdial.io",
    siteName: "PostIQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PostIQ – AI-Powered Creator Intelligence for LinkedIn",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostIQ – AI-Powered Creator Intelligence for LinkedIn",
    description: "PostIQ helps LinkedIn creators grow faster with AI post scoring, profile intelligence, hook generators, hashtag analytics, content calendar & competitor insights.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full scroll-smooth preload" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
