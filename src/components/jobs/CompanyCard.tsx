import React from "react";
import Link from "next/link";
import { Company } from "@/types";
import { Building2, MapPin, Globe, Users } from "lucide-react";
import { Button } from "../common/Button";

export const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  return (
    <div className="bg-white border border-slate-200/90 hover:border-[#0756A8]/40 rounded-xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{company.name}</h4>
            <p className="text-xs text-[#0756A8] font-medium">{company.industry}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mt-3">{company.description}</p>

        <div className="space-y-1.5 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.size}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline text-[#0756A8] truncate">
                {company.website.replace("https://", "")}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {company.activeJobsCount} Active Jobs
        </span>
        <Link href={`/jobs?company=${encodeURIComponent(company.name)}`}>
          <Button variant="outline" size="sm">
            View Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
};
