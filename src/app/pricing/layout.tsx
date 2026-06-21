import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing Plans | PostIQ - LinkedIn Growth Platform",
  description: "Choose the perfect plan to accelerate your LinkedIn growth. Start with our free basic tier or upgrade to Pro for unlimited content intelligence reports.",
  alternates: {
    canonical: 'https://postiq.nexdial.io/pricing',
  },
  openGraph: {
    title: "Pricing Plans | PostIQ - LinkedIn Growth Platform",
    description: "Choose the perfect plan to accelerate your LinkedIn growth. Start with our free basic tier or upgrade to Pro for unlimited content intelligence reports.",
    url: "https://postiq.nexdial.io/pricing",
    siteName: "PostIQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PostIQ Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | PostIQ - LinkedIn Growth Platform",
    description: "Choose the perfect plan to accelerate your LinkedIn growth. Start with our free basic tier or upgrade to Pro for unlimited content intelligence reports.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

