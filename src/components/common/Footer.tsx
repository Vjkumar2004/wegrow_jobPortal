"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Code,
  Compass,
  Briefcase,
  Award,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ServiceDetail {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  outcomes: { label: string; value: string }[];
  targetAudience: string;
  ctaText: string;
  ctaHref: string;
}

const SERVICES_DATA: Record<string, ServiceDetail> = {
  "skill-development": {
    id: "skill-development",
    name: "Skill Development",
    badge: "Technical Mastery & Practical Labs",
    tagline: "Master industry-standard Full-Stack engineering, algorithmic problem solving & cloud architectures.",
    description: "Our intensive technical coaching bridges the gap between academic theory and real-world software engineering. Learn by building scalable applications with rigorous code reviews, automated tests, and modern design patterns.",
    icon: Code,
    features: [
      "Modern Full-Stack Specialization (React, Next.js, Node.js, Python, Java & TypeScript)",
      "Data Structures, Algorithms & LeetCode/HackerRank coding round mastery",
      "Production-grade Capstone Projects with Git workflows, Docker & Cloud deployment",
      "ATS-Optimized Resume Crafting & GitHub technical portfolio development",
    ],
    outcomes: [
      { label: "Practical Coding Labs", value: "95%" },
      { label: "Live Industry Projects", value: "10+" },
      { label: "Mentor Review Turnaround", value: "24 hrs" },
    ],
    targetAudience: "College graduates, final-year engineering students, and developers aiming for tier-1 tech roles.",
    ctaText: "Explore Active Job Openings",
    ctaHref: "/jobs",
  },
  "career-counseling": {
    id: "career-counseling",
    name: "Career Counseling",
    badge: "Personalized Strategic Advisory",
    tagline: "1-on-1 career roadmap mapping, technical strengths assessment & corporate role alignment.",
    description: "Navigate competitive hiring markets with clarity. Our veteran counselors analyze your aptitude, portfolio, and career goals to architect a step-by-step strategy for campus and lateral placement success.",
    icon: Compass,
    features: [
      "Diagnostic Assessment of technical strengths, problem-solving skills & interests",
      "Specialization Roadmap (Full-Stack, QA Automation, DevOps, Cloud, or Product)",
      "Actionable 30 / 60 / 90 Day Placement Readiness milestones",
      "Professional Communication, Corporate Etiquette & Email writing coaching",
    ],
    outcomes: [
      { label: "Students Guided", value: "5,000+" },
      { label: "Tailored Roadmaps", value: "100%" },
      { label: "Advisory Rating", value: "4.9 / 5" },
    ],
    targetAudience: "Students confused about career specialization or looking for high-impact campus drive preparation.",
    ctaText: "Book Free Career Counseling",
    ctaHref: "mailto:wegrowjobz@gmail.com?subject=Free%20Career%20Counseling%20Inquiry%20-%20WeGrow",
  },
  "direct-placement": {
    id: "direct-placement",
    name: "Direct Placement",
    badge: "Direct Hiring Pipelines",
    tagline: "Direct interview pipelines with 50+ corporate recruiters, tech startups, and MNC hiring partners.",
    description: "Bypass generic application queues and portal black holes. WeGrow provides verified candidates with direct recruiter referrals, scheduled interview slots, and end-to-end placement advocacy.",
    icon: Briefcase,
    features: [
      "Direct Recruiter Referrals without third-party screening roadblocks",
      "On-Campus & Virtual Placement Drives with verified hiring budgets",
      "Competitive Compensation Benchmarking (₹4.5 LPA to ₹12 LPA Starting Packages)",
      "Post-Placement Offer Evaluation, joining support & career longevity advisory",
    ],
    outcomes: [
      { label: "Corporate Hiring Partners", value: "50+" },
      { label: "Average Starting Package", value: "4.5 - 12 LPA" },
      { label: "Candidate Placement Fee", value: "₹0 Free" },
    ],
    targetAudience: "Candidates ready for job interviews seeking high-growth tech positions with verified salaries.",
    ctaText: "Browse Explore Careers",
    ctaHref: "/jobs",
  },
  "expert-mentorship": {
    id: "expert-mentorship",
    name: "Expert Mentorship",
    badge: "Senior Tech Leaders & Alumni",
    tagline: "Simulated tech interviews, real hiring manager feedback, and ongoing career mentorship.",
    description: "Learn directly from senior software engineers, engineering managers, and technical interviewers from top product companies. Understand what recruiters evaluate during live coding and system design rounds.",
    icon: Award,
    features: [
      "Live 1-on-1 System Design & Technical Mock Interviews with real-time scoring",
      "STAR-Method Behavioral & HR Interview simulations with actionable feedback",
      "Weekly Masterclasses on emerging industry tech stacks and architecture patterns",
      "Lifelong access to the WeGrow Alumni Network & internal referral opportunities",
    ],
    outcomes: [
      { label: "Senior Tech Mentors", value: "100+" },
      { label: "Mock Interview Rounds", value: "Unlimited" },
      { label: "Interview Success Rate", value: "92%" },
    ],
    targetAudience: "Students and junior engineers preparing for rigorous MNC technical rounds and coding interviews.",
    ctaText: "Explore Career Tips & Guides",
    ctaHref: "/career-tips",
  },
};

export const Footer: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (activeServiceId) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setActiveServiceId(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [activeServiceId]);

  const activeService = activeServiceId ? SERVICES_DATA[activeServiceId] : null;
  return (
    <footer
      className="w-full relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(145deg, #014E9C 0%, #013C78 60%, #012D5A 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        fontFamily: "'Poppins', sans-serif",
      }}
      aria-label="Site Footer"
    >
      {/* Subtle Ambient Lighting Effects */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #016BE0 0%, rgba(1, 78, 156, 0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, #F79400 0%, rgba(247, 148, 0, 0) 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          MAIN FOOTER FULL WIDTH 4-COLUMN CONTENT
      ═══════════════════════════════════════════════════════ */}
      <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 pb-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* ──────────────────────────────────────────────────
              COLUMN 1: BRAND (4 Cols on desktop)
          ────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Brand Logo - Transparent Background */}
            <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.02]" aria-label="WeGrow Skill Campus Home">
              <div className="relative w-44 sm:w-52 h-12">
                <Image
                  src="/wegrow-portal-logo.png"
                  alt="WeGrow Skill Campus"
                  fill
                  className="object-contain object-left drop-shadow-[0_0_1px_rgba(255,255,255,0.85)] drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                  priority
                />
              </div>
            </Link>

            {/* Short Description */}
            <p className="text-sm text-blue-100/90 leading-relaxed max-w-sm">
              Leading technical coaching and placement center dedicated to bridging the gap between education and career success.
            </p>

            {/* Trust statement */}
            <div
              className="p-3.5 rounded-xl border max-w-sm"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.16)",
              }}
            >
              <p className="text-xs text-blue-100/95 font-medium italic">
                &ldquo;Empowering students with skills, opportunities and career guidance.&rdquo;
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200/80 mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/wegrow-skill-campus/posts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Skill Campus on LinkedIn"
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:border-[#F79400] hover:text-[#F79400] hover:bg-white/15 hover:shadow-md"
                  style={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.22)",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/wegrowskillcampus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Skill Campus on Instagram"
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:border-[#F79400] hover:text-[#F79400] hover:bg-white/15 hover:shadow-md"
                  style={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.22)",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@wegrowskillcampus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Skill Campus on YouTube"
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:border-[#F79400] hover:text-[#F79400] hover:bg-white/15 hover:shadow-md"
                  style={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.22)",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/wegrowskillcampus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Skill Campus on Facebook"
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:border-[#F79400] hover:text-[#F79400] hover:bg-white/15 hover:shadow-md"
                  style={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.22)",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────
              COLUMN 2: QUICK LINKS (2-3 Cols on desktop)
          ────────────────────────────────────────────────── */}
          <nav aria-label="Quick Links" className="lg:col-span-2 space-y-4">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-orange-300"
            >
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Explore Careers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/student/login"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Login / Signup</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* ──────────────────────────────────────────────────
              COLUMN 3: OUR SERVICES (Interactive Working Modal)
          ────────────────────────────────────────────────── */}
          <nav aria-label="Our Services" className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-300">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {Object.values(SERVICES_DATA).map((srv) => (
                <li key={srv.id}>
                  <button
                    type="button"
                    onClick={() => setActiveServiceId(srv.id)}
                    className="text-left text-blue-100/90 hover:text-[#F79400] transition-colors duration-200 cursor-pointer flex items-center gap-2 group w-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300/40 group-hover:bg-[#F79400] group-hover:scale-125 transition-all shrink-0" />
                    <span>{srv.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ──────────────────────────────────────────────────
              COLUMN 4: CONTACT (Sivakasi Office) (4 Cols)
          ────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-4">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-orange-300"
            >
              Sivakasi Office
            </h3>

            <div className="space-y-4 text-sm text-blue-100/90">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: "rgba(247, 148, 0, 0.18)",
                    border: "1px solid rgba(247, 148, 0, 0.4)",
                    color: "#F79400",
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="leading-snug">
                  <p>100A/5, 1st Floor,</p>
                  <p>Thiruthangal Road, Opposite Bell Hotel,</p>
                  <p className="font-semibold text-white mt-0.5">Sivakasi – 626123</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(247, 148, 0, 0.18)",
                    border: "1px solid rgba(247, 148, 0, 0.4)",
                    color: "#F79400",
                  }}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href="mailto:wegrowjobz@gmail.com"
                  className="text-blue-100/90 hover:text-[#F79400] font-medium transition-colors duration-200 break-all"
                  aria-label="Send email to wegrowjobz@gmail.com"
                >
                  wegrowjobz@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(247, 148, 0, 0.18)",
                    border: "1px solid rgba(247, 148, 0, 0.4)",
                    color: "#F79400",
                  }}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+919344337331"
                  className="text-white hover:text-[#F79400] font-semibold transition-colors duration-200"
                  aria-label="Call phone number +91 93443 37331"
                >
                  +91 93443 37331
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM FOOTER: COPYRIGHT & LEGAL (FULL WIDTH)
      ═══════════════════════════════════════════════════════ */}
      <div
        className="w-full border-t"
        style={{
          background: "rgba(1, 38, 76, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.12)",
        }}
      >
        <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/80">
          <p className="text-center sm:text-left">
            © 2026 WeGrow Skill Campus. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-[#F79400] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#F79400] transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#F79400] transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE SERVICE DETAILS MODAL
      ═══════════════════════════════════════════════════════ */}
      {activeService && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#051124]/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveServiceId(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-[#014E9C] to-[#013C78] text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#F79400] flex items-center justify-center shrink-0 shadow-inner">
                  <activeService.icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-[11px] font-semibold tracking-wide uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-[#F79400]" />
                    {activeService.badge}
                  </div>
                  <h2
                    id="service-modal-title"
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                  >
                    {activeService.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveServiceId(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Service Switcher Tabs */}
            <div className="flex border-b border-slate-200/80 bg-slate-50/90 px-4 pt-2 overflow-x-auto no-scrollbar gap-1.5">
              {Object.values(SERVICES_DATA).map((srv) => {
                const isCurrent = srv.id === activeService.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setActiveServiceId(srv.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer border-b-2 ${isCurrent
                        ? "bg-white text-[#014E9C] border-[#014E9C] shadow-xs"
                        : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100"
                      }`}
                  >
                    {srv.name}
                  </button>
                );
              })}
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
              {/* Tagline & Description */}
              <div>
                <p className="text-base font-semibold text-slate-900 leading-snug mb-2">
                  {activeService.tagline}
                </p>
                <p className="text-slate-600 leading-relaxed text-[13px] sm:text-sm">
                  {activeService.description}
                </p>
              </div>

              {/* Key Features & Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  What You Get &amp; Key Deliverables
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeService.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs sm:text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Metrics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Performance &amp; Track Record
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {activeService.outcomes.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100/80 text-center"
                    >
                      <div className="text-lg sm:text-xl font-extrabold text-[#014E9C]">
                        {stat.value}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
                <span className="font-bold shrink-0">Ideal For:</span>
                <span>{activeService.targetAudience}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveServiceId(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>

              <Link
                href={activeService.ctaHref}
                onClick={() => setActiveServiceId(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#014E9C] hover:bg-[#013C78] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition hover:shadow cursor-pointer"
              >
                <span>{activeService.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
