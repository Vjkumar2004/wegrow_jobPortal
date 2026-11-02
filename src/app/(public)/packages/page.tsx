import { RecruitmentPackagesClient } from "@/components/packages/RecruitmentPackagesClient";

export const metadata = {
  title: "Recruitment Consultancy Packages | WeGrow Jobz",
  description: "Explore recruitment packages and candidate sourcing services.",
};

export default function PackagesPage() {
  return <RecruitmentPackagesClient isHRLayout={false} />;
}
