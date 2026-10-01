import React from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { jobsService } from "@/services/jobs.service";
import { CompanyCard } from "@/components/jobs/CompanyCard";
import { Building2, Search } from "lucide-react";

export const metadata = {
  title: "Top Hiring Companies | WeGrow Skill Campus",
  description: "Browse verified enterprise partners, unicorns, and high-growth startups hiring college graduates.",
};

export default async function CompaniesPage() {
  const companies = await jobsService.getCompanies();

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" /> Verified Employers
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Top Hiring Companies
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore industry leaders actively partnering with WeGrow Skill Campus to recruit engineering, management, and design talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
