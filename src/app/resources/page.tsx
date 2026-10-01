import React from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { BookOpen, Code2, Video, FileText, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";

export const metadata = {
  title: "Career & Placement Resources | WeGrow Skill Campus",
  description: "Free technical cheat sheets, system design interview guides, aptitude question banks, and resume templates.",
};

export default function ResourcesPage() {
  const resources = [
    {
      title: "Data Structures & Algorithms Handbook",
      category: "Technical Prep",
      description: "Comprehensive 120-question curated sheet with solutions in Java, Python, and C++ covering LeetCode top interview questions.",
      type: "PDF Guide",
      downloads: "14,200+ Downloads",
      badge: "Most Popular",
    },
    {
      title: "System Design & Microservices Architecture",
      category: "Full Stack Prep",
      description: "Step-by-step breakdown of designing rate limiters, URL shorteners, distributed caching, and messaging queues.",
      type: "Interactive Notes",
      downloads: "8,900+ Downloads",
      badge: "Advanced",
    },
    {
      title: "ATS-Optimized Tech Resume Template",
      category: "Resume Kit",
      description: "Tested against standard enterprise ATS parsers with a 92% pass rate across Fortune 500 campus drives.",
      type: "DOCX & LaTeX",
      downloads: "28,500+ Downloads",
      badge: "Essential",
    },
    {
      title: "Top 50 Behavioral & HR Interview Questions",
      category: "HR Interview Prep",
      description: "Structured STAR method answers for standard situational questions asked in tier-1 tech firms.",
      type: "Cheatsheet",
      downloads: "11,400+ Downloads",
      badge: "High Impact",
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0756A8] bg-blue-100 px-3 py-1 rounded-full">
            Learning Vault
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Free Placement Resources
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Curated preparation materials, algorithmic cheat sheets, and templates crafted by industry mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-[#0756A8]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#0756A8] bg-blue-50 px-2.5 py-1 rounded-md">
                    {res.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {res.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{res.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{res.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{res.downloads}</span>
                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5 mr-1 text-[#0756A8]" /> Download {res.type}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
