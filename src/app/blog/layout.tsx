import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How to Improve LinkedIn Reach in 2026 | PostIQ",
  description: "Learn proven LinkedIn growth strategies, content frameworks, and profile optimization techniques.",
  alternates: {
    canonical: 'https://postiq.nexdial.io/blog',
  },
  openGraph: {
    title: "How to Improve LinkedIn Reach in 2026 | PostIQ",
    description: "Learn proven LinkedIn growth strategies, content frameworks, and profile optimization techniques.",
    url: "https://postiq.nexdial.io/blog",
    siteName: "PostIQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "How to Improve LinkedIn Reach in 2026 | PostIQ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Improve LinkedIn Reach in 2026 | PostIQ",
    description: "Learn proven LinkedIn growth strategies, content frameworks, and profile optimization techniques.",
    images: ["/og-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

