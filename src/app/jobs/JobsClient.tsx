"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@/types";
import { Button } from "@/components/common/Button";
import { formatSalary, formatDate } from "@/lib/utils";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Share2,
} from "lucide-react";

import { authService } from "@/services/auth.service";

interface FilterParams {
  search?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  workMode?: string;
  company?: string;
  sortBy?: "newest" | "salaryHigh" | "salaryLow";
}

export default function JobsClient({
  initialJobs,
  initialParams,
  basePath = "/jobs",
}: {
  initialJobs: Job[];
  initialParams: FilterParams;
  basePath?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialParams.search || "");
  const [location, setLocation] = useState(initialParams.location || "All");
  const [jobType, setJobType] = useState(initialParams.jobType || "All");
  const [workMode, setWorkMode] = useState(initialParams.workMode || "All");
  const [sortBy, setSortBy] = useState<"newest" | "salaryHigh" | "salaryLow">(
    initialParams.sortBy || "newest"
  );
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location && location !== "All") params.set("location", location);
      if (jobType && jobType !== "All") params.set("jobType", jobType);
      if (workMode && workMode !== "All") params.set("workMode", workMode);
      if (sortBy) params.set("sortBy", sortBy);

      router.push(`/jobs?${params.toString()}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("All");
    setJobType("All");
    setWorkMode("All");
    setSortBy("newest");
    startTransition(() => {
      router.push("/jobs");
    });
  };

  const popularTags = ["Software Engineer", "Full Stack", "Data Analyst", "React", "Python", "Fresher 2025"];

  return (
    <div
      className="min-h-screen text-slate-800"
      style={{
        background: "linear-gradient(180deg, #F8FAFD 0%, #FAF8F5 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          PAGE HERO BANNER
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16 shadow-[0_4px_24px_rgba(1,78,156,0.04)]">
        {/* Ambient background glows */}
        <div
          className="absolute -top-24 right-0 w-96 h-96 rounded-full pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(1, 78, 156, 0.15) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-72 h-72 rounded-full pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(247, 148, 0, 0.15) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(50px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEBDD] text-[#F79400] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F79400]/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Verified Opportunities</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
              style={{ color: "#0B1F4B" }}
            >
              Find Your <span style={{ color: "#F79400" }}>Dream Career</span> Today
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-8">
              Explore 500+ verified corporate job openings and internships tailored for college students, freshers, and skilled graduates across India.
            </p>

            {/* Quick Stats Strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-600 pt-2 border-t border-slate-100 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#014E9C]" />
                <span>Fresher Friendly Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F79400]" />
                <span>Fast-track Interviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SEARCH & FILTER COMMAND BAR
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(11,31,75,0.08)] border border-slate-200/90">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input (5 Cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Job title, keyword, or tech stack (e.g. React, Java)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/15 outline-none transition-all"
              />
            </div>

            {/* Location Select (2 Cols) */}
            <div className="md:col-span-2">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/15 outline-none transition-all cursor-pointer"
              >
                <option value="All">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Job Type Select (2 Cols) */}
            <div className="md:col-span-2">
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/15 outline-none transition-all cursor-pointer"
              >
                <option value="All">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>

            {/* Work Mode Select (1.5 Cols) */}
            <div className="md:col-span-1.5">
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/15 outline-none transition-all cursor-pointer"
              >
                <option value="All">Work Mode</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Action Buttons (1.5 Cols) */}
            <div className="md:col-span-1.5 flex items-center gap-2">
              <button
                onClick={applyFilters}
                disabled={isPending}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: "#014E9C",
                  boxShadow: "0 6px 18px rgba(1, 78, 156, 0.25)",
                }}
              >
                <span>{isPending ? "Searching..." : "Search"}</span>
              </button>
            </div>

          </div>

          {/* Quick Tag Pills */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Trending keywords:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearch(tag);
                    startTransition(() => {
                      router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#FFEBDD] hover:text-[#F79400] text-slate-600 font-medium transition-colors cursor-pointer border border-transparent hover:border-[#F79400]/30"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newSort = e.target.value as "newest" | "salaryHigh" | "salaryLow";
                    setSortBy(newSort);
                    startTransition(() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set("sortBy", newSort);
                      router.push(`/jobs?${params.toString()}`);
                    });
                  }}
                  className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer hover:text-[#014E9C]"
                >
                  <option value="newest">Newest First</option>
                  <option value="salaryHigh">Salary: High to Low</option>
                  <option value="salaryLow">Salary: Low to High</option>
                </select>
              </div>

              {(search || location !== "All" || jobType !== "All" || workMode !== "All" || sortBy !== "newest") && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          JOB LISTINGS CONTENT
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Results Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Verified Openings</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2FC] text-[#014E9C]">
                {initialJobs.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct employer applications with guaranteed interview feedback
            </p>
          </div>
        </div>

        {/* Jobs Grid */}
        {initialJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialJobs.map((job) => {
              const isSaved = !!savedJobs[job.id];
              return (
                <div
                  key={job.id}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-[#014E9C]/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(11,31,75,0.09)] hover:-translate-y-1 flex flex-col justify-between"
                >
                  {/* Top: Company Logo + Title + Bookmark */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                          {job.company.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={job.company.logo}
                              alt={job.company.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px]">
                              {job.company.name}
                            </span>
                            <span title="Verified Employer" className="inline-flex">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#014E9C] transition-colors text-base line-clamp-1 mt-0.5">
                            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(job.id)}
                        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSaved
                            ? "bg-amber-50 text-[#F79400] border-[#F79400]/40"
                            : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }`}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.jobType}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#014E9C] font-semibold border border-blue-100">
                        <span>{job.workMode}</span>
                      </span>
                    </div>

                    {/* Salary Highlight Pill */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/50 border border-amber-200/60 flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                        <IndianRupee className="w-4 h-4 text-[#F79400]" />
                        <span>Salary Package:</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[11px] text-slate-400 self-center font-medium">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </span>

                    <Link
                      href={`${basePath === "/student/jobs" ? "/student/jobs" : "/jobs"}/${job.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#014E9C] bg-[#EAF2FC] hover:bg-[#014E9C] hover:text-white transition-all duration-200 group-hover:translate-x-0.5 shadow-sm"
                    >
                      <span>{basePath === "/student/jobs" ? "Apply in Portal" : "View & Apply"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F79400] flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No matching vacancies found
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We couldn’t find any openings matching your exact filters. Try searching with different keywords or reset your filters.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#014E9C] hover:bg-[#013C78] transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
