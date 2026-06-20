import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full scroll-smooth preload" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('liq_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var darkActive = savedTheme ? savedTheme === 'dark' : prefersDark;
                  if (darkActive) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
