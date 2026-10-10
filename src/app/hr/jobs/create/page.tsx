"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Building2,
  Users,
  Code,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Gift,
  Check,
  X,
} from "lucide-react";
import { hrService } from "@/services/hr.service";
import { HiringStage } from "@/types";

const POPULAR_BENEFITS = [
  "Health & Medical Insurance",
  "Flexible Working Hours",
  "Performance Bonus",
  "Free Meals & Snacks",
  "Remote / Hybrid Flexibility",
  "Upskilling & Certification Allowance",
  "PF & Gratuity",
  "Paid Time Off (PTO)",
  "Relocation Assistance",
];

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states matching rich job portal standards
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("React, Node.js, TypeScript, SQL");
  const [location, setLocation] = useState("Bengaluru, Karnataka (Hybrid)");
  const [salaryMin, setSalaryMin] = useState("600000");
  const [salaryMax, setSalaryMax] = useState("1200000");
  const [experience, setExperience] = useState("Fresher (0 - 1 yr)");
  const [jobType, setJobType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [openings, setOpenings] = useState("5");

  // Dynamic Hiring Stages / Workflow builder
  const [hiringStages, setHiringStages] = useState<HiringStage[]>([
    { step: "01", title: "Apply Online", desc: "Profile & credentials submitted" },
    { step: "02", title: "Shortlisting", desc: "Recruiter screening & assessment" },
    { step: "03", title: "Interviews", desc: "Technical & problem solving round" },
    { step: "04", title: "Final Offer", desc: "HR discussion & onboarding" },
  ]);

  // Benefits & Perks state
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    "Health & Medical Insurance",
    "Flexible Working Hours",
    "Performance Bonus",
  ]);
  const [customBenefitInput, setCustomBenefitInput] = useState("");

  const handleAddStage = () => {
    const nextStepNum = String(hiringStages.length + 1).padStart(2, "0");
    setHiringStages([
      ...hiringStages,
      { step: nextStepNum, title: `Stage ${hiringStages.length + 1}`, desc: "Evaluation criteria for this round" },
    ]);
  };

  const handleRemoveStage = (index: number) => {
    const filtered = hiringStages.filter((_, idx) => idx !== index);
    // Renumber steps
    const renumbered = filtered.map((stage, idx) => ({
      ...stage,
      step: String(idx + 1).padStart(2, "0"),
    }));
    setHiringStages(renumbered);
  };

  const handleStageChange = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...hiringStages];
    updated[index] = { ...updated[index], [field]: value };
    setHiringStages(updated);
  };

  const handleToggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleAddCustomBenefit = () => {
    const trimmed = customBenefitInput.trim();
    if (trimmed && !selectedBenefits.includes(trimmed)) {
      setSelectedBenefits([...selectedBenefits, trimmed]);
      setCustomBenefitInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await hrService.createJob({
        title,
        description,
        responsibilities: responsibilities.split("\n").filter(Boolean),
        requirements: requirements.split("\n").filter(Boolean),
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        location,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        experience,
        jobType: jobType as any,
        workMode: workMode as any,
        deadline,
        openings: Number(openings),
        benefits: selectedBenefits,
        hiringStages: hiringStages.length > 0 ? hiringStages : undefined,
        publish: true as any,
      });

      if (created?.id) {
        await hrService.publishJob(created.id).catch(() => {});
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/hr/jobs");
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickTemplate = () => {
    setTitle("Graduate Software Engineer (Fresher 2026)");
    setLocation("Bengaluru / Chennai / Hyderabad (Hybrid)");
    setSalaryMin("650000");
    setSalaryMax("1200000");
    setExperience("Fresher (0 - 1 yr)");
    setJobType("Full Time");
    setWorkMode("Hybrid");
    setOpenings("8");
    setSkills("React, Node.js, Java, Python, SQL, REST APIs, Git");
    setDescription(
      "We are hiring enthusiastic final year engineering graduates and recent pass-outs for our flagship core engineering team. You will build highly scalable cloud services and interactive digital interfaces for global enterprise users."
    );
    setResponsibilities(
      "Develop and maintain high performance React frontend applications.\nBuild resilient microservices using Node.js or Java Spring Boot.\nParticipate in code reviews, technical architecture sessions, and automated unit testing.\nCollaborate closely with product managers and UX designers."
    );
    setRequirements(
      "B.E / B.Tech / MCA in Computer Science, IT, or related technical disciplines.\nStrong conceptual understanding of data structures, algorithms, and OOP principles.\nHands-on experience with modern JavaScript, Git version control, and relational databases.\nExcellent analytical mindset and proactive communication skills."
    );
    setSelectedBenefits([
      "Health & Medical Insurance",
      "Flexible Working Hours",
      "Performance Bonus",
      "Free Meals & Snacks",
      "Learning & Upskilling Stipend",
    ]);
    setHiringStages([
      { step: "01", title: "Apply Online", desc: "Profile & credentials submitted" },
      { step: "02", title: "Shortlisting", desc: "Recruiter screening & assessment" },
      { step: "03", title: "Interviews", desc: "Technical & problem solving round" },
      { step: "04", title: "Final Offer", desc: "HR discussion & onboarding" },
    ]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-5xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/hr/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7694] hover:text-[#1E5BE0] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Openings
        </Link>

        <button
          type="button"
          onClick={handleQuickTemplate}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] hover:bg-[#d8e6ff] px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load SDE Fresher Template</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
          <Briefcase className="w-3.5 h-3.5" /> Campus Recruitment Drive
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
          Create & Post New Job Vacancy
        </h1>
        <p className="text-sm text-[#6B7694] mt-1">
          Publish campus job positions visible to verified students across NIT, IIT, and accredited engineering colleges.
        </p>
      </div>

      {/* Success notification */}
      {success && (
        <div className="p-4 bg-[#E8F8EF] text-[#22B573] text-sm font-semibold rounded-[12px] border border-[#C6F0D8] flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
          <span>Job vacancy published successfully! Redirecting to job listings...</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 sm:p-8 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-6">
        {/* Section 1: Basic Role Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-2">
            1. Role Title & Core Specifications
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Job Opening Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Graduate Software Engineer (Fresher 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] placeholder-[#6B7694] text-sm px-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
              >
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Work Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site (Office)</option>
                <option value="Remote">100% Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
              >
                <option value="Fresher (0 - 1 yr)">Fresher (0 - 1 yr)</option>
                <option value="1 - 3 yrs">1 - 3 yrs</option>
                <option value="3 - 5 yrs">3 - 5 yrs</option>
                <option value="Internship">Internship Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Work Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Karnataka (or Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-10 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Number of Vacancies / Openings <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  required
                  min="1"
                  value={openings}
                  onChange={(e) => setOpenings(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-10 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Compensation & Timeline */}
        <div className="space-y-4 pt-4 border-t border-[#EEF1F7]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-2">
            2. Compensation & Application Deadline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Minimum Annual CTC (₹)
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g. 600000"
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-8 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Maximum Annual CTC (₹)
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g. 1200000"
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-8 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Application Deadline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-10 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Skills, Job Description, Responsibilities */}
        <div className="space-y-4 pt-4 border-t border-[#EEF1F7]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-2">
            3. Skills, Description & Evaluation Criteria
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Required Technical Skills (Comma separated) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Code className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. React, Node.js, TypeScript, SQL, Docker, Python"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm pl-10 pr-4 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>
            <p className="text-[11px] text-[#6B7694] mt-1">
              These skill tags are matched with student resumes for ATS automated scoring.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Job Description Overview <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Introduce your team, product vision, and what the candidate will work on..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm p-3.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Key Responsibilities (One bullet per line)
            </label>
            <textarea
              rows={3}
              placeholder="Design scalable frontend components in React&#10;Implement REST APIs using Node.js or Java&#10;Write automated tests..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm p-3.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Eligibility & Academic Qualifications (One bullet per line)
            </label>
            <textarea
              rows={3}
              placeholder="B.E / B.Tech Computer Science 2025/2026 Batch&#10;Minimum 7.0 CGPA with no active backlogs&#10;Strong understanding of data structures..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-sm p-3.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Section 4: Recruitment Workflow / Hiring Stages */}
        <div className="space-y-4 pt-4 border-t border-[#EEF1F7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF1F7] pb-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                4. Recruitment Workflow (Hiring Stages)
              </h3>
              <p className="text-[11px] text-[#6B7694] mt-0.5">
                Define the interview rounds and evaluation steps for candidates applying to this role.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStage}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] hover:bg-[#d8e6ff] px-3 py-1.5 rounded-lg transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stage</span>
            </button>
          </div>

          <div className="space-y-3">
            {hiringStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] flex flex-col sm:flex-row items-start sm:items-center gap-3 relative group hover:border-[#D0E2FF] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1E5BE0] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                  {stage.step}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 flex-1 w-full">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold text-[#6B7694] uppercase tracking-wider mb-1">
                      Stage Title
                    </label>
                    <input
                      type="text"
                      required
                      value={stage.title}
                      onChange={(e) => handleStageChange(idx, "title", e.target.value)}
                      placeholder="e.g. Technical Interview"
                      className="w-full bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]"
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <label className="block text-[10px] font-bold text-[#6B7694] uppercase tracking-wider mb-1">
                      Description / Focus
                    </label>
                    <input
                      type="text"
                      required
                      value={stage.desc}
                      onChange={(e) => handleStageChange(idx, "desc", e.target.value)}
                      placeholder="e.g. Problem solving & coding round"
                      className="w-full bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]"
                    />
                  </div>
                </div>

                {hiringStages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(idx)}
                    className="p-1.5 text-[#8E9AAC] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer self-end sm:self-center"
                    title="Remove this stage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Perks & Benefits */}
        <div className="space-y-4 pt-4 border-t border-[#EEF1F7]">
          <div className="border-b border-[#EEF1F7] pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] flex items-center gap-2">
              <Gift className="w-4 h-4" />
              5. Employee Benefits & Perks
            </h3>
            <p className="text-[11px] text-[#6B7694] mt-0.5">
              Highlight company offerings, insurance, and work perks to attract top talent.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-2">
              Select Popular Perks & Benefits:
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_BENEFITS.map((benefit) => {
                const isSelected = selectedBenefits.includes(benefit);
                return (
                  <button
                    key={benefit}
                    type="button"
                    onClick={() => handleToggleBenefit(benefit)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#E8F0FF] text-[#1E5BE0] border border-[#1E5BE0]/30 shadow-2xs font-bold"
                        : "bg-[#F4F6FA] text-[#6B7694] border border-[#E3E8F0] hover:bg-[#EAEFF8] hover:text-[#0B1F4B]"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{benefit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Add Custom Benefit
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                placeholder="e.g. Free Cab Facilities, Gym Membership"
                value={customBenefitInput}
                onChange={(e) => setCustomBenefitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomBenefit();
                  }
                }}
                className="flex-1 bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
              <button
                type="button"
                onClick={handleAddCustomBenefit}
                className="px-4 py-2.5 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold rounded-[10px] transition cursor-pointer shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {selectedBenefits.length > 0 && (
            <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7]">
              <span className="text-[10px] font-bold text-[#8E9AAC] uppercase tracking-wider block mb-2">
                Currently Selected ({selectedBenefits.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedBenefits.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D0E2FF] text-[#1E5BE0] text-xs font-medium shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-[#22B573]" />
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBenefit(b)}
                      className="text-[#8E9AAC] hover:text-rose-500 cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-5 border-t border-[#EEF1F7] flex items-center justify-end gap-3">
          <Link
            href="/hr/jobs"
            className="px-5 py-2.5 rounded-[10px] border border-[#E3E8F0] text-xs font-semibold text-[#6B7694] hover:bg-[#F1F4F9] transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-[10px] bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold shadow-md shadow-[#1E5BE0]/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                <span>Publish Campus Job Opening</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
