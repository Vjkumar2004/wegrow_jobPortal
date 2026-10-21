import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with WeGrow Jobz. Connect with our campus placement counselors, recruiter relationship managers, and student support desk.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/contact",
  },
  openGraph: {
    title: "Contact Us | WeGrow Jobz",
    description:
      "Get in touch with WeGrow Jobz. Connect with our campus placement counselors, recruiter relationship managers, and student support desk.",
    url: "https://www.wegrowjobz.com/contact",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact WeGrow Jobz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | WeGrow Jobz",
    description: "Get in touch with our campus placement counselors and recruiter support desk.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
