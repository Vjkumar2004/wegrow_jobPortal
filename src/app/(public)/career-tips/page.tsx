import React from "react";
import type { Metadata } from "next";
import CareerTipsClient from "./CareerTipsClient";

export const metadata: Metadata = {
  title: "Career Tips & Mentorship Guides",
  description:
    "Expert advice on resume tailoring, tech interview preparation, and salary negotiation for college graduates and freshers on WeGrow Jobz.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/career-tips",
  },
  openGraph: {
    title: "Career Tips & Mentorship Guides | WeGrow Jobz",
    description:
      "Expert advice on resume tailoring, tech interview preparation, and salary negotiation for college graduates and freshers on WeGrow Jobz.",
    url: "https://www.wegrowjobz.com/career-tips",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Tips on WeGrow Jobz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Tips & Mentorship Guides | WeGrow Jobz",
    description: "Expert advice on cracking campus placements and technical rounds.",
    images: ["/og-image.png"],
  },
};

export default function CareerTipsPage() {
  return <CareerTipsClient />;
}

