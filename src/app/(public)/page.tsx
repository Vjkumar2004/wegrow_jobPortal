import type { Metadata } from "next";
import HeroPage from "@/components/home/HeroPage";

export const metadata: Metadata = {
  title: "WeGrow Jobz | Placement & Career Opportunities Portal",
  description:
    "Find high-growth tech, engineering, and corporate jobs, campus placements, and internships from verified companies across India on WeGrow Jobz.",
  alternates: {
    canonical: "https://www.wegrowjobz.com",
  },
  openGraph: {
    title: "WeGrow Jobz | Placement & Career Opportunities Portal",
    description:
      "Find high-growth tech, engineering, and corporate jobs, campus placements, and internships from verified companies across India on WeGrow Jobz.",
    url: "https://www.wegrowjobz.com",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeGrow Jobz - Placement & Career Portal",
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeGrow Jobz | Placement & Career Opportunities Portal",
    description: "Explore verified jobs, freshers campus placements, corporate recruitment drives, and internships across top companies in India.",
    images: ["/og-image.png"],
    creator: "@wegrowjobz",
  },
};

export default function HomePage() {
  return <HeroPage />;
}
