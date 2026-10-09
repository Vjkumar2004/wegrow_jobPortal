"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  List,
  X,
  Building2,
  Check,
  ArrowRight,
  Filter,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { StudentBrowseJobsPageData, StudentBrowseJobItem } from "@/types";
import { jobsService } from "@/services/jobs.service";
import { studentService } from "@/services/student.service";
import { getCompanyLogoUrl, getCompanyLogoProxyUrl } from "@/lib/utils";

interface StudentBrowseJobsClientProps {
  initialData: StudentBrowseJobsPageData;
}

export default function StudentBrowseJobsClient({ initialData }: StudentBrowseJobsClientProps) {
  const mergeAppliedFromStorage = (list: StudentBrowseJobItem[]) => {
    try {
      return list.map((j) => ({
        ...j,
        hasApplied: j.hasApplied || localStorage.getItem(`applied_job_${j.id}`) === "true",
      }));
    } catch {
      return list;
    }
  };

  const [jobs, setJobs] = useState<StudentBrowseJobItem[]>(initialData.jobs);

  // Apply localStorage applied-state after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setJobs((prev) => mergeAppliedFromStorage(prev));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [totalCount, setTotalCount] = useState(initialData.totalJobsCount);
  const [profileCompletion, setProfileCompletion] = useState(initialData.profileCompletion);
  const [isSearching, setIsSearching] = useState(false);

  const { data: freshJobsData } = useQuery({
    queryKey: ["browse-jobs"],
    queryFn: () => jobsService.getBrowseJobsPageData({ limit: 50 }),
    staleTime: 60_000,
  });

  const { data: freshProfile } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => studentService.getProfile(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (freshJobsData?.jobs && freshJobsData.jobs.length > 0) {
      setJobs(mergeAppliedFromStorage(freshJobsData.jobs));
      setTotalCount(freshJobsData.totalJobsCount || freshJobsData.jobs.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshJobsData]);

  useEffect(() => {
    if (freshProfile) {
      setProfileCompletion({
        percentage: freshProfile.completionPercentage || 0,
        checklist: freshProfile.checklist || [],
      });
    }
  }, [freshProfile]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [bookmarks, setBookmarks] = useState<{ [id: string]: boolean }>(() => {
    const map: { [id: string]: boolean } = {};
    initialData.jobs.forEach((j) => { map[j.id] = !!j.isBookmarked; });
    return map;
  });

  const toggleBookmark = (id: string) => setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));

  const getSalaryLPA = (text?: string): number => {
    if (!text) return 0;
    const match = text.match(/(\d+(\.\d+)?)/g);
    if (!match || match.length === 0) return 0;
    return Math.max(...match.map(Number));
  };

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await jobsService.getBrowseJobsPageData({ search: searchTerm.trim(), limit: 50 });
        if (res?.jobs && res.jobs.length > 0) {
          setJobs((prev) => {
            const merged = mergeAppliedFromStorage(res.jobs);
            const map = new Map(prev.map((j) => [j.id, j]));
            merged.forEach((j) => map.set(j.id, j));
            return Array.from(map.values());
          });
        }
      } catch { /* client-side filter still works */ } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleImmediateSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setIsSearching(true);
      const res = await jobsService.getBrowseJobsPageData({ search: searchTerm.trim(), limit: 50 });
      if (res?.jobs && res.jobs.length > 0) {
        setJobs((prev) => {
          const merged = mergeAppliedFromStorage(res.jobs);
          const map = new Map(prev.map((j) => [j.id, j]));
          merged.forEach((j) => map.set(j.id, j));
          return Array.from(map.values());
        });
      }
    } catch { /* noop */ } finally { setIsSearching(false); }
  };

  const quickFilters = ["Fresher", "Internship", "Full Time", "Remote", "Chennai", "Bangalore", "IT", "Marketing", "Design", "Data Analyst"];

  const filteredJobs = jobs.filter((job) => {
    if (searchTerm.trim()) {
      const tokens = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const haystack = [job.title, job.company?.name, job.location, job.jobType, job.workMode, job.experience, job.salaryText, ...(job.skills ?? [])].map((s) => (s || "").toLowerCase());
      if (!tokens.every((t) => haystack.some((h) => h.includes(t)))) return false;
    }
    if (selectedLocation !== "All" && !(job.location || "").toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedJobType !== "All" && (job.jobType || "").toLowerCase() !== selectedJobType.toLowerCase()) return false;
    if (selectedWorkMode !== "All" && (job.workMode || "").toLowerCase() !== selectedWorkMode.toLowerCase()) return false;
    if (selectedExperience !== "All") {
      const exp = (job.experience || "").toLowerCase();
      if (selectedExperience === "0-1 Years" && !exp.match(/0-?1|0-?|fresher|entry/)) return false;
      if (selectedExperience === "0-2 Years" && !exp.match(/0-?[12]|fresher/)) return false;
      if (selectedExperience === "1-3 Years" && !exp.match(/1-?[23]|2\+/)) return false;
      if (selectedExperience === "3+ Years" && !exp.match(/3\+|[345]-|[456789]\+|senior/)) return false;
    }
    if (selectedSalary !== "All") {
      const lpa = getSalaryLPA(job.salaryText);
      if (selectedSalary === "3-6" && (lpa < 3 || lpa > 6)) return false;
      if (selectedSalary === "6-10" && (lpa < 6 || lpa > 10)) return false;
      if (selectedSalary === "10+" && lpa < 10) return false;
    }
    if (activeQuickFilter) {
      const qf = activeQuickFilter.toLowerCase();
      const combined = `${job.title} ${(job.skills || []).join(" ")} ${job.location} ${job.jobType} ${job.workMode} ${job.experience}`.toLowerCase();
      if (qf === "fresher" && !combined.match(/0-?|fresher|entry/)) return false;
      if (qf === "internship" && (job.jobType || "").toLowerCase() !== "internship") return false;
      if (qf === "full time" && (job.jobType || "").toLowerCase() !== "full time") return false;
      if (qf === "remote" && !combined.includes("remote")) return false;
      if (qf === "chennai" && !(job.location || "").toLowerCase().includes("chennai")) return false;
      if (qf === "bangalore" && !(job.location || "").toLowerCase().match(/bangalore|bengaluru/)) return false;
      if (qf === "it" && !combined.match(/it|software|developer|engineer|tech/)) return false;
      if (qf === "marketing" && !combined.match(/marketing|sales|growth|seo/)) return false;
      if (qf === "design" && !combined.match(/design|ui|ux/)) return false;
      if (qf === "data analyst" && !combined.match(/data|analyst|analytics/)) return false;
    }
    return true;
  });

  const sortedFilteredJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "Salary High to Low") return getSalaryLPA(b.salaryText) - getSalaryLPA(a.salaryText);
    if (sortBy === "Relevance" && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      return ((b.title.toLowerCase().includes(q) ? 2 : 0) + (b.company.name.toLowerCase().includes(q) ? 1 : 0))
           - ((a.title.toLowerCase().includes(q) ? 2 : 0) + (a.company.name.toLowerCase().includes(q) ? 1 : 0));
    }
    return 0;
  });

  const activeFilterChips = [
    searchTerm.trim() && { key: "search", label: `"${searchTerm}"`, onRemove: () => setSearchTerm("") },
    selectedLocation !== "All" && { key: "loc", label: selectedLocation, onRemove: () => setSelectedLocation("All") },
    selectedJobType !== "All" && { key: "jt", label: selectedJobType, onRemove: () => setSelectedJobType("All") },
    selectedWorkMode !== "All" && { key: "wm", label: selectedWorkMode, onRemove: () => setSelectedWorkMode("All") },
    selectedExperience !== "All" && { key: "exp", label: selectedExperience, onRemove: () => setSelectedExperience("All") },
    selectedSalary !== "All" && { key: "sal", label: `${selectedSalary} LPA`, onRemove: () => setSelectedSalary("All") },
    activeQuickFilter && { key: "qf", label: activeQuickFilter, onRemove: () => setActiveQuickFilter("") },
  ].filter(Boolean) as Array<{ key: string; label: string; onRemove: () => void }>;

  const resetAllFilters = () => {
    setSearchTerm(""); setSelectedLocation("All"); setSelectedJobType("All");
    setSelectedExperience("All"); setSelectedWorkMode("All"); setSelectedSalary("All"); setActiveQuickFilter("");
  };

  const topCompanies = (freshJobsData?.topCompanies?.length ? freshJobsData.topCompanies : initialData.topCompanies) ?? [];
  const latestJobs   = (freshJobsData?.latestJobs?.length   ? freshJobsData.latestJobs   : initialData.latestJobs)   ?? [];

  // ─── Helpers for logo rendering ───────────────────────────────────────────
  const CompanyLogo = ({ id, name, logo, size = 44 }: { id?: string; name: string; logo?: string; size?: number }) => {
    const initials = name.slice(0, 2).toUpperCase();
    return (
      <div
        className="rounded-xl bg-[#F4F6FA] border border-[#EEF1F7] flex items-center justify-center font-bold text-[#1E5BE0] shrink-0 overflow-hidden"
        style={{ width: size, height: size, fontSize: size < 40 ? 10 : 12 }}
      >
        {logo || id ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getCompanyLogoUrl({ logo, id } as any, id || "")}
            alt={name}
            className="w-full h-full object-contain p-0.5"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              const proxy = id ? getCompanyLogoProxyUrl(id) : "";
              if (proxy && !img.dataset.fallbackTried) {
                img.dataset.fallbackTried = "true";
                img.src = proxy;
                return;
              }
              img.style.display = "none";
              if (img.parentElement && !img.parentElement.querySelector(".logo-fb")) {
                const fb = document.createElement("span");
                fb.textContent = initials;
                fb.className = "logo-fb font-bold text-[#1E5BE0]";
                fb.style.fontSize = size < 40 ? "10px" : "12px";
                img.parentElement.appendChild(fb);
              }
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-6 font-['Poppins',sans-serif] text-[#0B1F4B]">

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <main className="flex-1 min-w-0 space-y-5">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-[800] text-[#0B1F4B] tracking-tight">Browse Jobs</h1>
            <p className="text-[14px] text-[#6B7694] mt-0.5">Find the right opportunity and start your career journey.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:block text-[13px] font-semibold text-[#6B7694] bg-white border border-[#E3E8F0] rounded-xl px-3 py-1.5">
              <span className="text-[#1E5BE0]">{sortedFilteredJobs.length}</span>
              {jobs.length > 0 && sortedFilteredJobs.length !== jobs.length ? ` / ${jobs.length}` : ""}{" "}
              {sortedFilteredJobs.length === 1 ? "Job" : "Jobs"}
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E3E8F0] text-[13px] font-medium text-[#0B1F4B] rounded-xl pl-3 pr-7 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1E5BE0] cursor-pointer shadow-xs"
              >
                <option value="Newest First">Newest First</option>
                <option value="Salary High to Low">Salary: High to Low</option>
                <option value="Relevance">Relevance</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7694] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex bg-white border border-[#E3E8F0] rounded-xl p-0.5 shadow-xs">
              {(["grid", "list"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setViewMode(m)}
                  className={`p-2 rounded-[9px] transition-colors cursor-pointer ${viewMode === m ? "bg-[#1E5BE0] text-white" : "text-[#9BA5BB] hover:text-[#0B1F4B]"}`}
                  aria-label={`${m} view`}
                >
                  {m === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter card */}
        <div className="bg-white rounded-2xl border border-[#EEF1F7] shadow-sm p-4 sm:p-5 space-y-3.5">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9BA5BB] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleImmediateSearch(); }}
                placeholder="Job title, skills, company or location..."
                className="w-full h-11 bg-[#F7F9FD] text-[14px] text-[#0B1F4B] placeholder-[#9BA5BB] pl-10 pr-9 rounded-xl border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 focus:border-[#1E5BE0] transition-all"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA5BB] hover:text-[#0B1F4B] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleImmediateSearch}
              disabled={isSearching}
              className="h-11 px-5 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-60"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { icon: <MapPin className="w-3.5 h-3.5" />, val: selectedLocation, set: setSelectedLocation, opts: [["All","All Locations"],["Chennai","Chennai"],["Bangalore","Bangalore"],["Hyderabad","Hyderabad"],["Pune","Pune"],["Remote","Remote"]] },
              { icon: <Briefcase className="w-3.5 h-3.5" />, val: selectedJobType, set: setSelectedJobType, opts: [["All","Job Type"],["Full Time","Full Time"],["Internship","Internship"],["Part Time","Part Time"]] },
              { icon: <Clock className="w-3.5 h-3.5" />, val: selectedExperience, set: setSelectedExperience, opts: [["All","Experience"],["0-1 Years","0–1 Years"],["0-2 Years","0–2 Years"],["1-3 Years","1–3 Years"],["3+ Years","3+ Years"]] },
              { icon: <Building2 className="w-3.5 h-3.5" />, val: selectedWorkMode, set: setSelectedWorkMode, opts: [["All","Work Mode"],["On-site","On-site"],["Remote","Remote"],["Hybrid","Hybrid"]] },
              { icon: <IndianRupee className="w-3.5 h-3.5" />, val: selectedSalary, set: setSelectedSalary, opts: [["All","Salary"],["3-6","3–6 LPA"],["6-10","6–10 LPA"],["10+","10+ LPA"]], span: true },
            ].map(({ icon, val, set, opts, span }, i) => (
              <div key={i} className={`relative ${span ? "col-span-2 sm:col-span-1" : ""}`}>
                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${val !== "All" ? "text-[#1E5BE0]" : "text-[#9BA5BB]"}`}>{icon}</span>
                <select
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className={`w-full h-10 text-[12px] font-medium pl-8 pr-5 rounded-xl border appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer transition-colors ${val !== "All" ? "bg-[#EEF4FF] border-[#1E5BE0] text-[#1E5BE0]" : "bg-[#F7F9FD] border-[#E3E8F0] text-[#0B1F4B]"}`}
                >
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-[#9BA5BB] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <Filter className="w-3.5 h-3.5 text-[#9BA5BB] shrink-0" />
            {quickFilters.map((qf) => (
              <button
                key={qf}
                type="button"
                onClick={() => setActiveQuickFilter(activeQuickFilter === qf ? "" : qf)}
                className={`text-[12px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeQuickFilter === qf ? "bg-[#1E5BE0] text-white shadow-sm" : "bg-[#F4F6FA] text-[#6B7694] hover:bg-[#EEF4FF] hover:text-[#1E5BE0]"
                }`}
              >
                {qf}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-[#9BA5BB] font-medium">Filters:</span>
            {activeFilterChips.map((chip) => (
              <span key={chip.key} className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#1E5BE0] text-[12px] font-semibold px-2.5 py-1 rounded-full border border-[#C7D8FF]">
                {chip.label}
                <button type="button" onClick={chip.onRemove} className="ml-0.5 hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            ))}
            <button type="button" onClick={resetAllFilters} className="text-[12px] text-red-500 font-semibold hover:underline cursor-pointer">Clear all</button>
          </div>
        )}

        {/* ─── Job cards ───────────────────────────────────────── */}
        {sortedFilteredJobs.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-[#EEF1F7] p-14 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#EEF4FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-[17px] font-bold text-[#0B1F4B]">
              {jobs.length === 0 ? "Loading opportunities…" : searchTerm.trim() ? `No results for "${searchTerm}"` : "No jobs match your filters"}
            </h3>
            <p className="text-[13px] text-[#6B7694] mt-1 max-w-xs mx-auto">
              {jobs.length === 0 ? "Fresh listings are being fetched for you." : "Try adjusting filters or clearing the search to see more."}
            </p>
            {activeFilterChips.length > 0 && (
              <button type="button" onClick={resetAllFilters} className="mt-4 px-5 py-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold rounded-xl transition shadow-sm cursor-pointer">
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4" : "space-y-3"}>
            {sortedFilteredJobs.map((job) => {
              const visibleSkills = (job.skills ?? []).slice(0, 3);
              const extraSkills = Math.max(0, (job.skills ?? []).length - 3);

              return (
                <div
                  key={job.id}
                  className={`group bg-white border border-[#EEF1F7] rounded-2xl shadow-sm hover:shadow-md hover:border-[#1E5BE0]/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col ${
                    viewMode === "list" ? "sm:flex-row sm:items-center p-4 sm:gap-5" : "p-5"
                  }`}
                >
                  {/* Card body */}
                  <div className={`flex flex-col gap-3 ${viewMode === "list" ? "flex-1 min-w-0" : ""}`}>

                    {/* Top: logo + company + title + bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <CompanyLogo
                          id={job.company.id}
                          name={job.company.name}
                          logo={job.company.logo}
                          size={44}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] font-semibold text-[#6B7694] truncate">{job.company.name}</span>
                            {job.verified && (
                              <span className="inline-flex items-center gap-0.5 bg-[#E5F8EE] text-[#1E9E63] text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                            {job.hasApplied && (
                              <span className="inline-flex items-center gap-0.5 bg-[#EEF4FF] text-[#1E5BE0] text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                <Check className="w-2.5 h-2.5" /> Applied
                              </span>
                            )}
                          </div>
                          <h3 className="font-[700] text-[15px] text-[#0B1F4B] leading-snug mt-0.5 line-clamp-2 group-hover:text-[#1E5BE0] transition-colors">
                            <Link href={`/student/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(job.id)}
                        className="p-1.5 text-[#9BA5BB] hover:text-[#1E5BE0] transition cursor-pointer shrink-0 mt-0.5"
                        aria-label="Bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarks[job.id] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""}`} />
                      </button>
                    </div>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { icon: <MapPin className="w-3 h-3" />, label: job.location },
                        { icon: <Briefcase className="w-3 h-3" />, label: job.jobType },
                        { icon: <Building2 className="w-3 h-3" />, label: job.workMode },
                        { icon: <Clock className="w-3 h-3" />, label: job.experience },
                      ].filter(m => m.label).map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-[#F4F6FA] text-[#6B7694] text-[11px] font-medium px-2 py-1 rounded-full">
                          {m.icon}{m.label}
                        </span>
                      ))}
                    </div>

                    {/* Salary */}
                    {job.salaryText && (
                      <div className="flex items-center gap-1 text-[13px] font-bold text-[#0B1F4B]">
                        <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" />
                        <span>{job.salaryText}</span>
                      </div>
                    )}

                    {/* Skill chips (max 3) */}
                    {visibleSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {visibleSkills.map((skill) => (
                          <span key={skill} className="bg-[#EEF4FF] text-[#1E5BE0] text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {extraSkills > 0 && (
                          <span className="bg-[#F4F6FA] text-[#6B7694] text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                            +{extraSkills}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`flex items-center justify-between gap-3 ${viewMode === "list" ? "sm:flex-col sm:items-end sm:justify-center shrink-0 mt-3 sm:mt-0" : "mt-4 pt-3.5 border-t border-[#F0F2F8]"}`}>
                    <span className="text-[12px] text-[#9BA5BB] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.postedAgo}
                    </span>
                    {job.hasApplied ? (
                      <span className="inline-flex items-center gap-1 bg-[#E5F8EE] text-[#1E9E63] text-[12px] font-bold px-3 py-1.5 rounded-xl border border-[#22B573]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <Link
                        href={`/student/jobs/${job.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e06000] text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-[0_4px_12px_rgba(255,107,0,0.35)] cursor-pointer"
                      >
                        Apply Now <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        <div className="pt-4 pb-2 text-center">
          <button
            type="button"
            className="border border-[#E3E8F0] text-[#6B7694] hover:border-[#1E5BE0] hover:text-[#1E5BE0] transition-all text-[13px] font-semibold px-8 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            Load More Opportunities <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* ═══════════════════ RIGHT SIDEBAR ═══════════════════ */}
      <aside className="w-full xl:w-[280px] shrink-0 space-y-4">

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl border border-[#EEF1F7] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold text-[#0B1F4B]">Profile Completion</h3>
            <span className="text-[16px] font-bold text-[#1E5BE0]">{profileCompletion.percentage}%</span>
          </div>
          <p className="text-[12px] text-[#9BA5BB] mb-3">Higher score increases shortlist chances by 3.4×</p>
          <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#1E5BE0] rounded-full transition-all duration-700" style={{ width: `${profileCompletion.percentage}%` }} />
          </div>
          <div className="space-y-2.5 mb-5">
            {profileCompletion.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[13px]">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-[#22B573] text-white" : "border-2 border-[#E3E8F0]"}`}>
                  {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`font-medium ${item.done ? "text-[#0B1F4B]" : "text-[#9BA5BB]"}`}>{item.label}</span>
              </div>
            ))}
          </div>
          <Link
            href="/student/profile"
            className="w-full h-11 bg-[#FF6B00] hover:bg-[#e06000] text-white text-[13px] font-bold rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-[0_4px_12px_rgba(255,107,0,0.3)]"
          >
            Complete Your Profile →
          </Link>
        </div>

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#EEF1F7] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#0B1F4B]">Top Companies Hiring</h3>
              <Link href="/companies" className="text-[12px] font-semibold text-[#1E5BE0] hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {topCompanies.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F7F9FD] rounded-xl px-2 py-1.5 -mx-2 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <CompanyLogo id={comp.id} name={comp.name} logo={comp.logo} size={36} />
                    <div>
                      <p className="text-[13px] font-bold text-[#0B1F4B] group-hover:text-[#1E5BE0] transition-colors">{comp.name}</p>
                      <p className="text-[11px] text-[#9BA5BB]">{comp.openings}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#FF6B00] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Jobs */}
        {latestJobs.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#EEF1F7] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#0B1F4B]">Latest Jobs</h3>
              <Link href="/student/jobs" className="text-[12px] font-semibold text-[#1E5BE0] hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {latestJobs.map((lj) => (
                <div key={lj.id} className="flex items-center gap-2.5">
                  <CompanyLogo id={lj.id} name={lj.title} logo={lj.logo} size={32} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/student/jobs/${lj.id}`}>
                      <p className="text-[13px] font-bold text-[#0B1F4B] hover:text-[#1E5BE0] truncate transition-colors">{lj.title}</p>
                    </Link>
                    <p className="text-[11px] text-[#9BA5BB] truncate">{lj.companyCity}</p>
                  </div>
                  <span className="text-[11px] text-[#9BA5BB] shrink-0">{lj.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
