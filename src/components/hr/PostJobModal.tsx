"use client";

import React, { useState } from "react";
import {
  Briefcase,
  X,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  Building2,
  Users,
  Code,
  FileText,
  AlertCircle,
  PlusCircle,
  Plus,
  Trash2,
  Layers,
  Gift,
  Check,
} from "lucide-react";
import { hrService } from "@/services/hr.service";
import { Job, HiringStage } from "@/types";

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

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (newJob: Job) => void;
}

export default function PostJobModal({ isOpen, onClose, onJobCreated }: PostJobModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states matching rich job portal standards
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("React, Node.js, TypeScript, SQL");
  const [location, setLocation] = useState("Bengaluru, Karnataka (Hybrid)");
  const [salaryMin, setSalaryMin] = useState("650000");
  const [salaryMax, setSalaryMax] = useState("1200000");
  const [experience, setExperience] = useState("Fresher (0 - 1 yr)");
  const [jobType, setJobType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [openings, setOpenings] = useState("5");

  // Dynamic Hiring Stages / Interview Rounds
  const [hiringStages, setHiringStages] = useState<HiringStage[]>([
    { step: "01", title: "Apply Online", desc: "Profile & credentials submitted" },
    { step: "02", title: "Shortlisting", desc: "Recruiter screening & assessment" },
    { step: "03", title: "Technical Interview", desc: "Technical problem solving & coding round" },
    { step: "04", title: "HR Discussion & Offer", desc: "Culture fit, compensation & onboarding" },
  ]);

  // Benefits & Perks
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
      { step: nextStepNum, title: `Round ${hiringStages.length + 1}`, desc: "Evaluation focus for this round" },
    ]);
  };

  const handleRemoveStage = (index: number) => {
    const filtered = hiringStages.filter((_, idx) => idx !== index);
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

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
      });

      // Auto-publish so it appears on the student jobs page immediately
      if (created?.id) {
        await hrService.publishJob(created.id);
        created.status = "Published";
      }

      setSuccess(true);
      if (onJobCreated) onJobCreated(created);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to post job.";
      setErrorMessage(msg);
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
      { step: "02", title: "Technical Assessment", desc: "Online aptitude & coding round" },
      { step: "03", title: "Technical Interview", desc: "Live system design & coding discussion" },
      { step: "04", title: "HR Discussion & Offer", desc: "Culture fit & compensation discussion" },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B1F4B]/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-[20px] max-w-3xl w-full my-8 shadow-2xl border border-[#EEF1F7] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#EEF1F7] flex items-center justify-between bg-gradient-to-r from-white via-white to-blue-50/50 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full mb-1">
              <PlusCircle className="w-3.5 h-3.5" />
              New Opening
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
              Post New Campus Job Opening
            </h2>
            <p className="text-xs text-[#6B7694] mt-0.5">
              Fill role requirements or load the standard engineering fresher template.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickTemplate}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] hover:bg-[#d8e6ff] px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden sm:inline">Fill SDE Template</span>
              <span className="sm:hidden">Auto-fill</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7694] hover:bg-[#F1F4F9] hover:text-[#0B1F4B] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mx-6 mt-4 p-3.5 bg-[#E8F8EF] text-[#22B573] text-xs font-semibold rounded-xl border border-[#C6F0D8] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Job opening published successfully! Added to your dashboard.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-start gap-2">
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Mobile Fill Template Button */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={handleQuickTemplate}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] py-2 rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Fill SDE Fresher Template</span>
            </button>
          </div>

          {/* Section 1: Role Overview */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-1.5">
              1. Role Title & Core Specs
            </h4>

            <div>
              <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                Job Opening Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Graduate Software Engineer (Fresher 2026)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] placeholder-[#6B7694] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site (Office)</option>
                  <option value="Remote">100% Remote</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
                >
                  <option value="Fresher (0 - 1 yr)">Fresher (0 - 1 yr)</option>
                  <option value="1 - 3 yrs">1 - 3 yrs</option>
                  <option value="3 - 5 yrs">3 - 5 yrs</option>
                  <option value="Internship">Internship Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#6B7694] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, Karnataka (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Number of Openings <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 text-[#6B7694] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    required
                    min="1"
                    value={openings}
                    onChange={(e) => setOpenings(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Compensation & Dates */}
          <div className="space-y-3.5 pt-3 border-t border-[#EEF1F7]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-1.5">
              2. Compensation & Timeline
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Min CTC (₹ / yr)
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Max CTC (₹ / yr)
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills & Descriptions */}
          <div className="space-y-3.5 pt-3 border-t border-[#EEF1F7]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-1.5">
              3. Skills & Job Description
            </h4>

            <div>
              <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                Technical Skills (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Code className="w-3.5 h-3.5 text-[#6B7694] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Node.js, SQL, TypeScript, Git"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs pl-9 pr-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                Role Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Overview of the vacancy and candidate responsibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs p-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                Key Responsibilities (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="Build modular React components&#10;Write unit tests..."
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs p-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                Eligibility & Qualifications (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="B.E/B.Tech Computer Science 2025/2026 Batch&#10;Minimum 7.0 CGPA..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs p-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none font-mono"
              />
            </div>
          </div>

          {/* Section 4: Recruitment Workflow / Interview Rounds */}
          <div className="space-y-3.5 pt-3 border-t border-[#EEF1F7]">
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-1.5">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  4. Recruitment Workflow (Interview Rounds)
                </h4>
                <p className="text-[10px] text-[#6B7694]">
                  Define the evaluation rounds & stages for this campus role
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5BE0] bg-[#E8F0FF] hover:bg-[#d8e6ff] px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Round</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {hiringStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] flex items-start sm:items-center gap-2.5 hover:border-[#D0E2FF] transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1E5BE0] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {stage.step}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 w-full">
                    <div className="sm:col-span-5">
                      <label className="block text-[9px] font-bold text-[#6B7694] uppercase tracking-wider mb-0.5">
                        Round / Stage Title
                      </label>
                      <input
                        type="text"
                        required
                        value={stage.title}
                        onChange={(e) => handleStageChange(idx, "title", e.target.value)}
                        placeholder="e.g. Technical Interview"
                        className="w-full bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]"
                      />
                    </div>
                    <div className="sm:col-span-7">
                      <label className="block text-[9px] font-bold text-[#6B7694] uppercase tracking-wider mb-0.5">
                        Focus / Criteria Description
                      </label>
                      <input
                        type="text"
                        required
                        value={stage.desc}
                        onChange={(e) => handleStageChange(idx, "desc", e.target.value)}
                        placeholder="e.g. Problem solving & coding round"
                        className="w-full bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]"
                      />
                    </div>
                  </div>

                  {hiringStages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(idx)}
                      className="p-1 text-[#8E9AAC] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer self-center"
                      title="Remove this round"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Perks & Benefits */}
          <div className="space-y-3.5 pt-3 border-t border-[#EEF1F7]">
            <div className="border-b border-[#EEF1F7] pb-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                5. Perks & Benefits
              </h4>
              <p className="text-[10px] text-[#6B7694]">
                Highlight company benefits & offerings to attract students
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_BENEFITS.map((benefit) => {
                  const isSelected = selectedBenefits.includes(benefit);
                  return (
                    <button
                      key={benefit}
                      type="button"
                      onClick={() => handleToggleBenefit(benefit)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#E8F0FF] text-[#1E5BE0] border border-[#1E5BE0]/30 shadow-2xs font-bold"
                          : "bg-[#F4F6FA] text-[#6B7694] border border-[#E3E8F0] hover:bg-[#EAEFF8] hover:text-[#0B1F4B]"
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{benefit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add custom benefit (e.g. Free Cab, Gym)..."
                value={customBenefitInput}
                onChange={(e) => setCustomBenefitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomBenefit();
                  }
                }}
                className="flex-1 bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]"
              />
              <button
                type="button"
                onClick={handleAddCustomBenefit}
                className="px-3 py-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
              >
                Add
              </button>
            </div>

            {selectedBenefits.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#EEF1F7]">
                <span className="text-[9px] font-bold text-[#8E9AAC] uppercase tracking-wider block mb-1.5">
                  Selected Benefits ({selectedBenefits.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedBenefits.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#D0E2FF] text-[#1E5BE0] text-[11px] font-medium shadow-2xs"
                    >
                      <Check className="w-2.5 h-2.5 text-[#22B573]" />
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleBenefit(b)}
                        className="text-[#8E9AAC] hover:text-rose-500 cursor-pointer ml-1"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#EEF1F7] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[10px] border border-[#E3E8F0] text-xs font-semibold text-[#6B7694] hover:bg-[#F1F4F9] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-[10px] bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing Opening...</span>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job Immediately</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
