import { redirect } from "next/navigation";

export default function HRCompanyProfilePage() {
  // Redirect directly to the dashboard with the company profile sub-section tab active
  redirect("/hr/dashboard?tab=company");
}
