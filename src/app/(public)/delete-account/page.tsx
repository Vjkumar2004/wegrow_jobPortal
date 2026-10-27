import React from "react";
import type { Metadata } from "next";
import DeleteAccountClient from "./DeleteAccountClient";

export const metadata: Metadata = {
  title: "Account & Data Deletion Request",
  description:
    "Learn how to delete your WeGrow Jobz account and associated data. Request permanent removal of your candidate profile, resumes, and application records.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/delete-account",
  },
  openGraph: {
    title: "Account & Data Deletion Request | WeGrow Jobz",
    description:
      "Official instructions and submission form to request permanent deletion of your WeGrow Jobz account and recruitment data in accordance with Google Play Data Safety policies.",
    url: "https://www.wegrowjobz.com/delete-account",
    siteName: "WeGrow Jobz",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WeGrow Jobz Account Deletion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Account & Data Deletion Request | WeGrow Jobz",
    description: "Learn how to delete your WeGrow Jobz account, uploaded resumes, and personal records.",
    images: ["/og-image.png"],
  },
};

export default function DeleteAccountPage() {
  return <DeleteAccountClient />;
}
