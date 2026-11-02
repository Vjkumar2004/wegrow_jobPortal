import React from "react";
import { RecruitmentPackagesClient } from "@/components/packages/RecruitmentPackagesClient";

export const metadata = {
  title: "Recruitment Consultancy Packages | WeGrow Recruiter",
  description: "Select professional recruitment packages for candidate sourcing, screening, and end-to-end hiring management.",
};

export default function HRPackagesPage() {
  return <RecruitmentPackagesClient isHRLayout={true} />;
}

