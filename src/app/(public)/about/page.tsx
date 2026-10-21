import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "WeGrow Jobz bridges the gap between students, colleges, and industry leaders. Learn about our mission, hiring partners, and placement impact across India.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/about",
  },
  openGraph: {
    title: "About Us | WeGrow Jobz",
    description:
      "WeGrow Jobz bridges the gap between students, colleges, and industry leaders. Learn about our mission, hiring partners, and placement impact across India.",
    url: "https://www.wegrowjobz.com/about",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About WeGrow Jobz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | WeGrow Jobz",
    description: "Learn about our mission, verified employers, and placement opportunities.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
