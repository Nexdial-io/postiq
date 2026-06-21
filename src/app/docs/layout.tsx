import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documentation & Scoring Methodology | PostIQ",
  description: "Complete platform guides, weighted scoring parameters, REST API integration snippets, and frequently asked questions for PostIQ.",
  alternates: {
    canonical: 'https://postiq.nexdial.io/docs',
  },
  openGraph: {
    title: "Documentation & Scoring Methodology | PostIQ",
    description: "Complete platform guides, weighted scoring parameters, REST API integration snippets, and frequently asked questions for PostIQ.",
    url: "https://postiq.nexdial.io/docs",
    siteName: "PostIQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PostIQ Documentation & Scoring Methodology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation & Scoring Methodology | PostIQ",
    description: "Complete platform guides, weighted scoring parameters, REST API integration snippets, and frequently asked questions for PostIQ.",
    images: ["/og-image.png"],
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

