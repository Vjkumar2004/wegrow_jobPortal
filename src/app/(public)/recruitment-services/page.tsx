import type { Metadata } from "next";
import { RecruitmentPackagesClient } from "@/components/packages/RecruitmentPackagesClient";

export const metadata: Metadata = {
  title: "Recruitment Consultancy Services & Packages | WeGrow Jobz",
  description:
    "Choose the right recruitment solution for your hiring needs. From candidate sourcing to complete recruitment management, WeGrow Jobz supports your hiring journey.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/recruitment-services",
  },
  openGraph: {
    title: "Recruitment Consultancy Services | WeGrow Jobz",
    description:
      "Enterprise recruitment solutions: Standard (₹2,999), Professional (₹5,999), End-to-End (₹12,000), and Workforce Partner retainers. Pre-screened candidates and verified talent pipelines.",
    url: "https://www.wegrowjobz.com/recruitment-services",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeGrow Jobz Recruitment Consultancy Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recruitment Consultancy Services | WeGrow Jobz",
    description: "Enterprise candidate sourcing, screening, and end-to-end placement solutions.",
    images: ["/og-image.png"],
  },
};

export default function RecruitmentServicesPage() {
  return <RecruitmentPackagesClient isHRLayout={false} />;
}

