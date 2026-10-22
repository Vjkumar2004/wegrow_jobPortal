import React from "react";
import type { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";

export const metadata: Metadata = {
  title: "Career & Placement Resources",
  description:
    "Free technical cheat sheets, system design interview guides, aptitude question banks, and ATS resume templates on WeGrow Jobz.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/resources",
  },
  openGraph: {
    title: "Career & Placement Resources | WeGrow Jobz",
    description:
      "Free technical cheat sheets, system design interview guides, aptitude question banks, and ATS resume templates on WeGrow Jobz.",
    url: "https://www.wegrowjobz.com/resources",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Placement Resources on WeGrow Jobz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career & Placement Resources | WeGrow Jobz",
    description: "Free coding question banks, ATS resume kits, and interview prep guides.",
    images: ["/og-image.png"],
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}

