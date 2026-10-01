"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/types";
import { formatSalary, formatDate } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Building2,
  Bookmark,
  Share2,
  CheckCircle,
  Globe,
  ArrowLeft,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { applicationsService } from "@/services/applications.service";
import { authService } from "@/services/auth.service";

export default function JobDetailsClient({ job }: { job: Job }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application form state
  const [fullName, setFullName] = useState("Aarav Sharma");
  const [email, setEmail] = useState("aarav.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [coverNote, setCoverNote] = useState("");

  const handleApplyClick = () => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      router.push(`/student/login?redirect=/jobs/${job.id}`);
      return;
    }
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await applicationsService.applyToJob(job.id, {
      fullName,
      email,
      phone,
      coverNote,
    });
    setIsSubmitting(false);
    setApplied(true);
    setTimeout(() => {
      setApplyModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0756A8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to all jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {job.company.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  <p className="text-sm font-semibold text-[#0756A8] mt-0.5">{job.company.name}</p>
                </div>
              </div>

              {/* Actions Header */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isSaved
                      ? "bg-amber-50 text-[#F79400] border-[#F79400]/30"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                  title={isSaved ? "Saved" : "Save Job"}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                </button>
                <Button
                  variant={applied ? "outline" : "secondary"}
                  size="md"
                  onClick={handleApplyClick}
                  disabled={applied}
                  className="font-bold px-6"
                >
                  {applied ? "Applied ✓" : "Apply via Student Portal"}
                </Button>
              </div>
            </div>

            {/* Meta chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Salary / Stipend</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Experience</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.experience}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Work Mode</span>
                <span className="font-bold text-[#0756A8] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  {job.workMode}
                </span>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
                Job Description
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0756A8] mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
                Requirements & Eligibility
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F79400] mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="primary" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Company Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">About the Company</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.company.about || "Leading corporate employer partnering with WeGrow Skill Campus to recruit young talent."}
            </p>

            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Industry:</span>
                <span className="font-semibold text-slate-800">{job.company.industry || "Technology"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Company Size:</span>
                <span className="font-semibold text-slate-800">{job.company.size || "1,000+ employees"}</span>
              </div>
              {job.company.website && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Website:</span>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#0756A8] hover:underline"
                  >
                    Visit Website ↗
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleApplyClick}
                disabled={applied}
                className="w-full font-bold shadow-md"
              >
                {applied ? "Applied Successfully" : "Apply via Student Portal"}
              </Button>
            </div>
          </div>

          {/* Job Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Job Summary
            </h3>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Posted On:</span>
              <span className="font-semibold text-slate-800">{formatDate(job.postedDate)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Application Deadline:</span>
              <span className="font-semibold text-slate-800">{job.deadline || "Open until filled"}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Openings:</span>
              <span className="font-semibold text-slate-800">{job.openings || 1} Positions</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400">Total Applicants:</span>
              <span className="font-bold text-[#0756A8]">{job.applicantsCount || 0} applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to ${job.company.name}`}
        description={`Role: ${job.title}`}
        maxWidth="lg"
      >
        {applied ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your profile and resume have been delivered to the hiring team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Textarea
              label="Cover Note / Why are you a good fit?"
              placeholder="Briefly state your relevant project experience or coursework..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={3}
            />

            <div className="p-3 bg-blue-50/70 rounded-xl text-xs text-[#0756A8] border border-blue-100 flex items-center justify-between">
              <span>Attached Resume: Aarav_Sharma_Resume_2025.pdf</span>
              <span className="font-bold cursor-pointer hover:underline">Change</span>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isSubmitting}
                className="font-bold px-5"
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
