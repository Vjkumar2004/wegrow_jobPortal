"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Building2,
  Check,
  ArrowRight,
  Filter,
  Loader2,
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

  const [jobs, setJobs] = useState<StudentBrowseJobItem[]>(() => {
    if (typeof window !== "undefined") return mergeAppliedFromStorage(initialData.jobs);
    return initialData.jobs;
  });
  const [totalCount, setTotalCount] = useState(initialData.totalJobsCount);
  const [profileCompletion, setProfileCompletion] = useState(initialData.profileCompletion);

  const [isSearching, setIsSearching] = useState(false);

  // Fetch fresh jobs and student profile in parallel, with caching
  const { data: freshJobsData } = useQuery({
    queryKey: ["browse-jobs"],
    queryFn: () => jobsService.getBrowseJobsPageData({ limit: 100 }),
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
  }, [freshJobsData]);

  useEffect(() => {
    if (freshProfile) {
      setProfileCompletion({
        percentage: freshProfile.completionPercentage || 0,
        checklist: freshProfile.checklist || [],
      });
    }
  }, [freshProfile]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Bookmarking state
  const [bookmarks, setBookmarks] = useState<{ [id: string]: boolean }>(() => {
    const map: { [id: string]: boolean } = {};
    initialData.jobs.forEach((j) => {
      map[j.id] = !!j.isBookmarked;
    });
    return map;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to parse numerical LPA from salary string
  const getSalaryLPA = (text?: string): number => {
    if (!text) return 0;
    const match = text.match(/(\d+(\.\d+)?)/g);
    if (!match || match.length === 0) return 0;
    return Math.max(...match.map(Number));
  };

  // Debounced search with live backend sync
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await jobsService.getBrowseJobsPageData({
          search: searchTerm.trim(),
          limit: 100,
        });
        if (res?.jobs && res.jobs.length > 0) {
          setJobs((prev) => {
            const merged = mergeAppliedFromStorage(res.jobs);
            const existingMap = new Map(prev.map((j) => [j.id, j]));
            merged.forEach((j) => existingMap.set(j.id, j));
            return Array.from(existingMap.values());
          });
        }
      } catch (err) {
        console.warn("Backend search fallback to client data", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleImmediateSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setIsSearching(true);
      const res = await jobsService.getBrowseJobsPageData({
        search: searchTerm.trim(),
        limit: 100,
      });
      if (res?.jobs && res.jobs.length > 0) {
        setJobs((prev) => {
          const merged = mergeAppliedFromStorage(res.jobs);
          const existingMap = new Map(prev.map((j) => [j.id, j]));
          merged.forEach((j) => existingMap.set(j.id, j));
          return Array.from(existingMap.values());
        });
      }
    } catch {
      // client-side filtering already handles it
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Filter options
  const quickFilters = [
    "Fresher",
    "Internship",
    "Full Time",
    "Remote",
    "Chennai",
    "Bangalore",
    "IT",
    "Marketing",
    "Design",
    "Data Analyst",
  ];

  // Dynamic live client filtering over jobs list with smart multi-token search
  const filteredJobs = jobs.filter((job) => {
    // 1. Search query multi-field token matching
    if (searchTerm.trim()) {
      const tokens = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const title = (job.title || "").toLowerCase();
      const compName = (job.company?.name || "").toLowerCase();
      const loc = (job.location || "").toLowerCase();
      const jt = (job.jobType || "").toLowerCase();
      const wm = (job.workMode || "").toLowerCase();
      const exp = (job.experience || "").toLowerCase();
      const sal = (job.salaryText || "").toLowerCase();
      const skills = Array.isArray(job.skills) ? job.skills.map((s) => (s || "").toLowerCase()) : [];

      const matchesAllTokens = tokens.every((token) => {
        return (
          title.includes(token) ||
          compName.includes(token) ||
          loc.includes(token) ||
          jt.includes(token) ||
          wm.includes(token) ||
          exp.includes(token) ||
          sal.includes(token) ||
          skills.some((s) => s.includes(token))
        );
      });

      if (!matchesAllTokens) return false;
    }

    // 2. Location filter
    if (selectedLocation !== "All") {
      const jobLoc = (job.location || "").toLowerCase();
      const selLoc = selectedLocation.toLowerCase();
      if (!jobLoc.includes(selLoc)) return false;
    }

    // 3. Job Type filter
    if (selectedJobType !== "All") {
      if ((job.jobType || "").toLowerCase() !== selectedJobType.toLowerCase()) {
        return false;
      }
    }

    // 4. Work Mode filter
    if (selectedWorkMode !== "All") {
      if ((job.workMode || "").toLowerCase() !== selectedWorkMode.toLowerCase()) {
        return false;
      }
    }

    // 5. Experience filter
    if (selectedExperience !== "All") {
      const expStr = (job.experience || "").toLowerCase();
      if (selectedExperience === "0-1 Years" && !expStr.includes("0-1") && !expStr.includes("0-") && !expStr.includes("fresher") && !expStr.includes("entry")) {
        return false;
      }
      if (selectedExperience === "0-2 Years" && !expStr.includes("0-1") && !expStr.includes("0-2") && !expStr.includes("0-") && !expStr.includes("1-2") && !expStr.includes("fresher")) {
        return false;
      }
      if (selectedExperience === "1-3 Years" && !expStr.includes("1-3") && !expStr.includes("1-2") && !expStr.includes("2-3") && !expStr.includes("2+")) {
        return false;
      }
      if (selectedExperience === "3+ Years" && !expStr.includes("3+") && !expStr.includes("3-5") && !expStr.includes("4+") && !expStr.includes("5+") && !expStr.includes("senior")) {
        return false;
      }
    }

    // 6. Salary filter
    if (selectedSalary !== "All") {
      const lpa = getSalaryLPA(job.salaryText);
      if (selectedSalary === "3-6" && (lpa < 3 || lpa > 6)) return false;
      if (selectedSalary === "6-10" && (lpa < 6 || lpa > 10)) return false;
      if (selectedSalary === "10+" && lpa < 10) return false;
    }

    // 7. Quick filter check
    if (activeQuickFilter) {
      const qf = activeQuickFilter.toLowerCase();
      if (qf === "fresher") {
        const exp = (job.experience || "").toLowerCase();
        if (!exp.includes("0-") && !exp.includes("fresher") && !exp.includes("entry") && !exp.includes("0 year")) return false;
      } else if (qf === "internship") {
        if ((job.jobType || "").toLowerCase() !== "internship") return false;
      } else if (qf === "full time") {
        if ((job.jobType || "").toLowerCase() !== "full time") return false;
      } else if (qf === "remote") {
        if ((job.workMode || "").toLowerCase() !== "remote" && !(job.location || "").toLowerCase().includes("remote")) return false;
      } else if (qf === "chennai") {
        if (!(job.location || "").toLowerCase().includes("chennai")) return false;
      } else if (qf === "bangalore") {
        const loc = (job.location || "").toLowerCase();
        if (!loc.includes("bangalore") && !loc.includes("bengaluru")) return false;
      } else if (qf === "it") {
        const combined = `${job.title} ${(job.skills || []).join(" ")}`.toLowerCase();
        if (!combined.includes("it") && !combined.includes("software") && !combined.includes("developer") && !combined.includes("engineer") && !combined.includes("tech")) return false;
      } else if (qf === "marketing") {
        const combined = `${job.title} ${(job.skills || []).join(" ")}`.toLowerCase();
        if (!combined.includes("marketing") && !combined.includes("sales") && !combined.includes("growth") && !combined.includes("seo")) return false;
      } else if (qf === "design") {
        const combined = `${job.title} ${(job.skills || []).join(" ")}`.toLowerCase();
        if (!combined.includes("design") && !combined.includes("ui") && !combined.includes("ux")) return false;
      } else if (qf === "data analyst") {
        const combined = `${job.title} ${(job.skills || []).join(" ")}`.toLowerCase();
        if (!combined.includes("data") && !combined.includes("analyst") && !combined.includes("analytics")) return false;
      }
    }

    return true;
  });

  // Sort filtered jobs
  const sortedFilteredJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "Salary High to Low") {
      return getSalaryLPA(b.salaryText) - getSalaryLPA(a.salaryText);
    }
    if (sortBy === "Relevance" && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const aTitleScore = a.title.toLowerCase().includes(q) ? 2 : 0;
      const bTitleScore = b.title.toLowerCase().includes(q) ? 2 : 0;
      const aCompScore = a.company.name.toLowerCase().includes(q) ? 1 : 0;
      const bCompScore = b.company.name.toLowerCase().includes(q) ? 1 : 0;
      return (bTitleScore + bCompScore) - (aTitleScore + aCompScore);
    }
    return 0;
  });

  // Active filters list for removable chips
  const activeFilterChips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (searchTerm.trim()) {
    activeFilterChips.push({
      key: "search",
      label: `Keyword: "${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (selectedLocation !== "All") {
    activeFilterChips.push({
      key: "loc",
      label: `Location: ${selectedLocation}`,
      onRemove: () => setSelectedLocation("All"),
    });
  }
  if (selectedJobType !== "All") {
    activeFilterChips.push({
      key: "jt",
      label: `Type: ${selectedJobType}`,
      onRemove: () => setSelectedJobType("All"),
    });
  }
  if (selectedWorkMode !== "All") {
    activeFilterChips.push({
      key: "wm",
      label: `Mode: ${selectedWorkMode}`,
      onRemove: () => setSelectedWorkMode("All"),
    });
  }
  if (selectedExperience !== "All") {
    activeFilterChips.push({
      key: "exp",
      label: `Exp: ${selectedExperience}`,
      onRemove: () => setSelectedExperience("All"),
    });
  }
  if (selectedSalary !== "All") {
    activeFilterChips.push({
      key: "sal",
      label: `Salary: ${selectedSalary}`,
      onRemove: () => setSelectedSalary("All"),
    });
  }
  if (activeQuickFilter) {
    activeFilterChips.push({
      key: "qf",
      label: `Quick: ${activeQuickFilter}`,
      onRemove: () => setActiveQuickFilter(""),
    });
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-5 overflow-hidden font-['Poppins',sans-serif] text-[#0B1F4B]">
      {/* ================= ZONE 2: CENTER CONTENT (flexible) ================= */}
      <main className="flex-1 min-w-0 space-y-5">
        {/* 1. Page Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-[800] text-[#0B1F4B] tracking-tight leading-tight">
              Browse Jobs
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#6B7694] mt-1">
              Find the right opportunities from top companies and start your career journey.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <span className="text-[14px] font-[500] text-[#0B1F4B]">
              <strong className="font-bold text-[#1E5BE0]">{sortedFilteredJobs.length}</strong> {sortedFilteredJobs.length === 1 ? "Job" : "Jobs"} Found
              {(searchTerm.trim() || selectedLocation !== "All" || selectedJobType !== "All" || selectedWorkMode !== "All" || selectedExperience !== "All" || selectedSalary !== "All" || activeQuickFilter) ? (
                <span className="text-xs text-[#6B7694] ml-1.5 font-normal">(Filtered from {jobs.length})</span>
              ) : null}
            </span>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E3E8F0] text-[13px] font-medium text-[#0B1F4B] rounded-[10px] pl-3 pr-8 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1E5BE0] cursor-pointer shadow-xs"
              >
                <option value="Newest First">Sort by: Newest First</option>
                <option value="Salary High to Low">Salary: High to Low</option>
                <option value="Relevance">Relevance</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-white border border-[#E3E8F0] rounded-[10px] p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-[7px] transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#1E5BE0] text-white shadow-xs"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-[7px] transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#1E5BE0] text-white shadow-xs"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Filter Card (white, 14px radius, padding 16px) */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-3.5">
          {/* Full-width Search Input with interactive clear and search action */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#6B7694] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleImmediateSearch();
              }}
              placeholder="Job title, company, skills, or location (e.g. React, Zoho, Chennai, Remote...)"
              className="w-full h-[50px] bg-[#F4F6FA] text-sm text-[#0B1F4B] placeholder-[#6B7694] pl-12 pr-28 rounded-[12px] border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 focus:border-[#1E5BE0] transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 rounded-full text-[#6B7694] hover:text-[#0B1F4B] hover:bg-[#E3E8F0] transition cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching ? (
                <div className="px-3 py-1.5 bg-[#1E5BE0]/10 rounded-[8px] flex items-center gap-1 text-[12px] font-medium text-[#1E5BE0]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Searching</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImmediateSearch}
                  className="px-3.5 py-1.5 bg-[#1E5BE0] hover:bg-[#1848B5] text-white text-[12px] font-semibold rounded-[8px] transition cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              )}
            </div>
          </div>

          {/* Row of 5 Dropdowns (equal width, 48px height) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Location */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-[48px] bg-[#F4F6FA] text-[13px] text-[#0B1F4B] pl-9 pr-7 rounded-[10px] border border-[#E3E8F0] appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="All">All Locations</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Job Type */}
            <div className="relative">
              <Briefcase className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full h-[48px] bg-[#F4F6FA] text-[13px] text-[#0B1F4B] pl-9 pr-7 rounded-[10px] border border-[#E3E8F0] appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="All">Job Type: All</option>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Experience */}
            <div className="relative">
              <Clock className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full h-[48px] bg-[#F4F6FA] text-[13px] text-[#0B1F4B] pl-9 pr-7 rounded-[10px] border border-[#E3E8F0] appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="All">Experience: All</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="0-2 Years">0-2 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Work Mode */}
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full h-[48px] bg-[#F4F6FA] text-[13px] text-[#0B1F4B] pl-9 pr-7 rounded-[10px] border border-[#E3E8F0] appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="All">Work Mode: All</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Salary Range */}
            <div className="relative col-span-2 sm:col-span-1">
              <IndianRupee className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full h-[48px] bg-[#F4F6FA] text-[13px] text-[#0B1F4B] pl-9 pr-7 rounded-[10px] border border-[#E3E8F0] appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="All">Salary Range</option>
                <option value="3-6">Rs 3 - 6 LPA</option>
                <option value="6-10">Rs 6 - 10 LPA</option>
                <option value="10+">Rs 10+ LPA</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Quick Filters Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[13px] font-bold text-[#0B1F4B] shrink-0">Quick Filters:</span>
          <div className="flex items-center gap-2">
            {quickFilters.map((qf) => {
              const isActive = activeQuickFilter === qf;
              return (
                <button
                  key={qf}
                  type="button"
                  onClick={() => setActiveQuickFilter(isActive ? "" : qf)}
                  className={`h-[36px] px-4 rounded-full text-[13px] font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#1E5BE0] text-white shadow-xs"
                      : "bg-white text-[#1E5BE0] border border-[#E3E8F0] hover:border-[#1E5BE0]"
                  }`}
                >
                  {qf}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white border border-[#E3E8F0] flex items-center justify-center shrink-0 text-[#6B7694] hover:text-[#0B1F4B] shadow-2xs"
            aria-label="Scroll quick filters"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Removable Chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#6B7694] font-medium">Applied Filters:</span>
            {activeFilterChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 bg-[#E8F0FF] text-[#1E5BE0] text-xs font-semibold px-3 py-1 rounded-full"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                setSelectedLocation("All");
                setSelectedJobType("All");
                setSelectedExperience("All");
                setSelectedWorkMode("All");
                setSelectedSalary("All");
                setActiveQuickFilter("");
                setSearchTerm("");
              }}
              className="text-xs text-[#EF4444] font-semibold hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 4. Jobs Grid (3 Columns or List Rows) */}
        {sortedFilteredJobs.length === 0 ? (
          <div className="bg-white rounded-[14px] p-12 text-center border border-[#EEF1F7] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1F4B]">
              {searchTerm.trim() ? `No jobs found matching "${searchTerm}"` : "No matching jobs found"}
            </h3>
            <p className="text-sm text-[#6B7694] mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, location filters, or experience range to explore more opportunities.
            </p>
            {(searchTerm.trim() || selectedLocation !== "All" || selectedJobType !== "All" || selectedWorkMode !== "All" || selectedExperience !== "All" || selectedSalary !== "All" || activeQuickFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLocation("All");
                  setSelectedJobType("All");
                  setSelectedExperience("All");
                  setSelectedWorkMode("All");
                  setSelectedSalary("All");
                  setActiveQuickFilter("");
                  setSearchTerm("");
                }}
                className="mt-4 px-5 py-2.5 bg-[#1E5BE0] hover:bg-[#1848B5] text-white text-xs font-semibold rounded-[10px] transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Clear Search & Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {sortedFilteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-[14px] p-[18px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  viewMode === "list" ? "sm:flex-row sm:items-center sm:gap-6" : ""
                }`}
              >
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  {/* Top Row: Company logo (~60px wide) + Name + Verified + Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-[54px] h-[54px] rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center font-bold text-xs text-[#1E5BE0] shrink-0 overflow-hidden shadow-2xs">
                        {(job.company.logo || job.company.id) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getCompanyLogoUrl(job.company, job.company.id)}
                              alt={job.company.name}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const proxyUrl = job.company.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                                if (proxyUrl && !target.dataset.fallbackTried && target.src !== proxyUrl) {
                                  target.dataset.fallbackTried = "true";
                                  target.src = proxyUrl;
                                  return;
                                }
                                target.style.display = "none";
                                if (target.parentElement && !target.parentElement.querySelector(".logo-fallback-span")) {
                                  const fallback = document.createElement("span");
                                  fallback.textContent = job.company.initials || job.company.name.slice(0, 3).toUpperCase();
                                  fallback.className = "font-bold text-xs text-[#1E5BE0] logo-fallback-span";
                                  target.parentElement.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <span>{job.company.initials || job.company.name.slice(0, 3).toUpperCase()}</span>
                          )}

                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-[600] text-[13px] text-[#0B1F4B]">
                            {job.company.name}
                          </span>
                          {/* Green "Verified" pill with tick icon (bg #E5F8EE, text #1E9E63, 11px) */}
                          {job.verified && (
                            <span className="inline-flex items-center gap-1 bg-[#E5F8EE] text-[#1E9E63] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                          {job.hasApplied && (
                            <span className="inline-flex items-center gap-1 bg-[#E5F8EE] text-[#1E9E63] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Applied ✓</span>
                            </span>
                          )}
                        </div>
                        {/* Job title (Poppins 700, 18px, navy) */}
                        <h3 className="font-[700] text-[18px] text-[#0B1F4B] leading-snug mt-1 hover:text-[#1E5BE0] transition-colors">
                          <Link href={`/student/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(job.id)}
                      className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] transition cursor-pointer shrink-0"
                      title="Bookmark job"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarks[job.id] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Two Meta Rows with small grey icons */}
                  <div className="mt-3.5 space-y-1.5 text-[13px] text-[#6B7694]">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7694]" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" />
                        <span>{job.jobType} • {job.workMode}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6B7694]" />
                        <span>{job.experience}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-[#0B1F4B]">
                        <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" />
                        <span>{job.salaryText}</span>
                      </span>
                    </div>
                  </div>

                  {/* Skill Chips Row (bg #E8F0FF, text #1E5BE0, 6px radius, 11-12px) */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#E8F0FF] text-[#1E5BE0] text-[11px] sm:text-[12px] font-medium px-2.5 py-1 rounded-[6px]"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.overflowSkillsCount && job.overflowSkillsCount > 0 ? (
                      <span className="text-[12px] text-[#6B7694] font-medium px-1">
                        +{job.overflowSkillsCount}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Footer: Clock icon + "2 days ago" + Solid Orange Apply Now button */}
                <div
                  className={`mt-5 pt-4 border-t border-[#EEF1F7] flex items-center justify-between gap-3 ${
                    viewMode === "list"
                      ? "sm:mt-0 sm:pt-0 sm:border-t-0 sm:flex-col sm:items-end sm:justify-center"
                      : ""
                  }`}
                >
                  <span className="text-[13px] text-[#6B7694] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.postedAgo}</span>
                  </span>

                  {job.hasApplied ? (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 bg-[#E5F8EE] text-[#1E9E63] font-[600] text-[13px] px-[16px] py-[9px] rounded-[8px] border border-[#22B573]/30 cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Already Applied ✓</span>
                    </button>
                  ) : (
                    <Link
                      href={`/student/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 bg-[#FF6B00] hover:bg-[#e66000] text-white font-[600] text-[14px] px-[18px] py-[10px] rounded-[8px] transition-all shadow-sm hover:shadow-[#FF6B00]/30 hover:shadow-md cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Pagination / Load More button */}
        <div className="pt-6 pb-2 text-center">
          <button
            type="button"
            className="border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white transition-all text-sm font-semibold px-8 py-3 rounded-[10px] shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Load More Opportunities</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* ================= ZONE 3: RIGHT PANEL (~300px stacked cards, gap 20px) ================= */}
      <aside className="w-full xl:w-[300px] shrink-0 space-y-5">
        {/* 1. Profile Completion Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Profile Completion</h3>
            <span className="text-[16px] font-bold text-[#1E5BE0]">
              {profileCompletion.percentage}%
            </span>
          </div>
          <p className="text-[12px] text-[#6B7694] mb-3">
            Higher score increases shortlist chances by 3.4x
          </p>

          {/* Blue progress bar (8px, rounded) */}
          <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-[#1E5BE0] rounded-full transition-all duration-700"
              style={{ width: `${profileCompletion.percentage}%` }}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            {profileCompletion.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[13px]">
                {item.done ? (
                  <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`font-medium ${item.done ? "text-[#0B1F4B]" : "text-[#6B7694]"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Full-width solid ORANGE button "Complete Your Profile →" (10px radius, 48px height) */}
          <Link
            href="/student/profile"
            className="w-full h-[48px] bg-[#FF6B00] hover:bg-[#e66000] text-white text-[14px] font-[600] rounded-[10px] flex items-center justify-center transition-all shadow-sm hover:shadow-[#FF6B00]/30 hover:shadow-md"
          >
            Complete Your Profile →
          </Link>
        </div>

        {/* 2. Top Companies Hiring Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Top Companies Hiring</h3>
            <Link href="/companies" className="text-[13px] font-semibold text-[#1E5BE0] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#EEF1F7]">
            {initialData.topCompanies.map((comp) => (
              <div
                key={comp.id}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50/60 rounded-lg px-1 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* 48px tile */}
                  <div
                    className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center font-bold text-xs border border-[#EEF1F7] bg-white p-1 shrink-0 overflow-hidden shadow-2xs ${
                      comp.logoColor || "bg-[#F7F9FD] text-[#0B1F4B]"
                    }`}
                  >
                    {comp.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                          if (e.currentTarget.parentElement) {
                            const fallback = document.createElement("span");
                            fallback.textContent = comp.initials || comp.name.slice(0, 3);
                            fallback.className = "font-bold text-xs text-[#0B1F4B]";
                            e.currentTarget.parentElement.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <span>{comp.initials || comp.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0B1F4B] group-hover:text-[#1E5BE0] transition-colors">
                      {comp.name}
                    </h4>
                    <p className="text-[12px] text-[#6B7694]">{comp.openings}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#FF6B00] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Latest Jobs Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Latest Jobs</h3>
            <Link href="/student/jobs" className="text-[13px] font-semibold text-[#1E5BE0] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {initialData.latestJobs.map((lj) => (
              <div key={lj.id} className="flex items-start justify-between gap-3 text-[13px]">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EEF1F7] text-[#1E5BE0] font-bold text-[11px] p-0.5 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden shadow-2xs">
                    {lj.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lj.logo}
                        alt={lj.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                          if (e.currentTarget.parentElement) {
                            const fallback = document.createElement("span");
                            fallback.textContent = lj.initials || "JB";
                            fallback.className = "font-bold text-[11px] text-[#1E5BE0]";
                            e.currentTarget.parentElement.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <span>{lj.initials || "JB"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0B1F4B] text-[13px] leading-snug truncate hover:text-[#1E5BE0] transition-colors">
                      <Link href={`/student/jobs/${lj.id}`}>{lj.title}</Link>
                    </h4>
                    <p className="text-[12px] text-[#6B7694] truncate">{lj.companyCity}</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#6B7694] shrink-0 font-medium">{lj.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
