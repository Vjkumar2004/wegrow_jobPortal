"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WhyChooseUsSection from "./WhyChooseUsSection";
import ForEmployersSection from "./ForEmployersSection";
import MobileAppSection from "./MobileAppSection";
import TopCompaniesHiringSection from "./TopCompaniesHiringSection";


/* ═══════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════ */
const GraduationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const BriefcaseIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const BuildingIcon = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);
const TrendIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const StarIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </svg>
);
const UsersIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════════════ */
const StatItem = ({ icon, number, label, isLast = false }: {
  icon: React.ReactNode; number: string; label: string; isLast?: boolean;
}) => (
  <div className={`flex items-center gap-3 sm:gap-4 py-3.5 sm:py-5 px-3.5 sm:px-6 flex-1 ${!isLast ? "lg:border-r border-slate-100" : ""}`}>
    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFE9D6] flex items-center justify-center text-[#FF6B00] shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(16px, 1.8vw, 22px)", color: "#0B1F4B", lineHeight: 1.2 }}>{number}</div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(11px, 1vw, 13px)", color: "#5B6580", marginTop: "2px" }} className="truncate">{label}</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   COMPANY LOGO (prominent brand card)
═══════════════════════════════════════════════════════ */
const CompanyLogo = ({ name, color, bg, category, jobs, logoUrl }: {
  name: string; color: string; bg: string; category?: string; jobs?: string; logoUrl?: string;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href="/companies"
      style={{ textDecoration: "none" }}
      className="group flex items-center gap-5 px-6 py-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_24px_rgba(11,31,75,0.06)] hover:shadow-[0_16px_36px_rgba(11,31,75,0.14)] hover:-translate-y-1.5 transition-all duration-300 min-w-[310px]"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-base tracking-tight shrink-0 overflow-hidden bg-white shadow-xs p-2.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105"
      >
        {logoUrl && !imgError ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: bg, color }}
          >
            {name.slice(0, 3)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "17px", color: "#0B1F4B" }} className="truncate">
            {name}
          </span>
          <span className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: "11px", color: "#059669", fontWeight: 700 }}>Hiring</span>
          </span>
        </div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "13px", color: "#5B6580" }} className="truncate font-medium">
          {category || "Technology"}
        </div>
        {jobs && (
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "13px", color: "#FF6B00", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span>{jobs}</span>
            <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </div>
        )}
      </div>
    </a>
  );
};

/* ═══════════════════════════════════════════════════════
   PREMIUM PROFESSIONAL STEP CARD (Modern & Vector Only)
═══════════════════════════════════════════════════════ */
const StepCard = ({
  step,
  icon,
  title,
  desc,
  tag,
  highlights,
  accentColor = "#FF6B00",
  bgGradient = "linear-gradient(135deg, #FF6B00 0%, #FF8A3D 100%)",
  lightBg = "#FFF5ED",
  borderColor = "rgba(255,107,0,0.18)",
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  highlights: string[];
  accentColor?: string;
  bgGradient?: string;
  lightBg?: string;
  borderColor?: string;
}) => (
  <div
    className="group relative bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden border border-slate-100/90 shadow-[0_8px_30px_rgba(11,31,75,0.05)] hover:shadow-[0_16px_40px_rgba(11,31,75,0.10)]"
  >
    {/* Top decorative gradient glow accent */}
    <div
      className="absolute top-0 left-0 right-0 h-[4px] transition-all duration-300 group-hover:h-[6px]"
      style={{ background: bgGradient }}
    />

    {/* Background ambient radial glow on hover */}
    <div
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl z-0"
      style={{ background: lightBg }}
    />

    {/* Big stylish step number watermark */}
    <div
      className="absolute top-5 right-6 font-['Poppins',sans-serif] text-5xl sm:text-6xl font-[900] text-[#0B1F4B]/5 pointer-events-none select-none z-1 leading-none"
    >
      0{step}
    </div>

    <div className="relative z-10 flex flex-col items-center text-center">
      {/* Top Header Row with Centered Icon and Tag */}
      <div className="flex flex-col items-center gap-3 mb-5 w-full">
        {/* Phase Pill Tag */}
        <span
          className="font-['Poppins',sans-serif] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{
            color: accentColor,
            background: lightBg,
            border: `1px solid ${borderColor}`,
          }}
        >
          {tag}
        </span>

        {/* Vector Icon Box */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 my-1"
          style={{
            background: bgGradient,
            boxShadow: `0 8px 20px ${accentColor}30`,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-['Poppins',sans-serif] font-bold text-lg sm:text-[21px] text-[#0B1F4B] mb-2.5 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="font-['Poppins',sans-serif] text-[13px] sm:text-sm text-[#5B6580] leading-relaxed mb-6 font-normal max-w-[340px]">
        {desc}
      </p>

      {/* Key Feature List */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-4.5 border border-slate-100 space-y-2.5 w-full text-left">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-xs text-[#3E4A68] font-['Poppins',sans-serif] font-medium"
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
              style={{
                background: lightBg,
                color: accentColor,
                border: `1px solid ${borderColor}`,
              }}
            >
              ✓
            </span>
            <span className="font-semibold text-xs text-[#223354]">{h}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Footer Link */}
    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs relative z-10 w-full">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accentColor }}
        />
        <span className="font-['Poppins',sans-serif] text-slate-500 font-semibold">
          Phase 0{step}
        </span>
      </div>
      <a
        href="/student/login"
        className="font-['Poppins',sans-serif] font-bold flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: accentColor }}
      >
        <span>Get Started</span>
        <ArrowRightIcon />
      </a>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function HeroPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Jobs", "Companies", "Resources", "Career Tips", "About Us"];
  const tags = ["Internship", "Full Time", "Remote", "Fresher", "IT Jobs", "Marketing", "Design"];

  const companies = [
    {
      name: "Google",
      color: "#4285F4",
      bg: "#EEF4FE",
      category: "Tech & Cloud",
      jobs: "160+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Microsoft",
      color: "#00A4EF",
      bg: "#F0F9FF",
      category: "Software & AI",
      jobs: "130+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    },
    {
      name: "Amazon",
      color: "#FF9900",
      bg: "#FFF9F0",
      category: "E-Commerce & AWS",
      jobs: "150+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      name: "Zoho",
      color: "#C60000",
      bg: "#FFF5F5",
      category: "SaaS & Cloud",
      jobs: "65+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_logo.svg",
    },
    {
      name: "TCS",
      color: "#001B69",
      bg: "#F0F4FF",
      category: "IT & Consulting",
      jobs: "140+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    },
    {
      name: "Infosys",
      color: "#007CC2",
      bg: "#F0F8FF",
      category: "Digital Services",
      jobs: "95+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    },
    {
      name: "Wipro",
      color: "#0057A8",
      bg: "#F0F6FF",
      category: "Global Tech",
      jobs: "80+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
    },
    {
      name: "Accenture",
      color: "#A100FF",
      bg: "#FAF0FF",
      category: "Strategy & Tech",
      jobs: "120+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
    },
    {
      name: "IBM",
      color: "#1F70C1",
      bg: "#F0F6FF",
      category: "Cloud & Cognitive",
      jobs: "65+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
    {
      name: "Deloitte",
      color: "#86BC25",
      bg: "#F6FBF0",
      category: "Audit & Advisory",
      jobs: "85+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
    },
    {
      name: "Cognizant",
      color: "#005DAA",
      bg: "#F0F6FF",
      category: "Enterprise Services",
      jobs: "110+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Cognizant_logo_2022.svg",
    },
    {
      name: "Capgemini",
      color: "#0070AD",
      bg: "#F0F7FF",
      category: "Innovation & Cloud",
      jobs: "50+ Openings",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .hero-page {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(160deg, #FFF6EE 0%, #FFFAF6 50%, #FFFFFF 100%);
          min-height: 100vh;
          position: relative;
        }

        @keyframes floatA {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-11px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -18; }
        }

        .fa { animation: floatA 3.4s ease-in-out infinite; }
        .fb { animation: floatB 4.2s ease-in-out infinite 0.9s; }
        .fc { animation: floatC 3.8s ease-in-out infinite 1.7s; }

        .da {
          stroke-dasharray: 5 4;
          animation: dash 1.6s linear infinite;
        }

        /* NAV */
        .nav-link {
          font-family: 'Poppins',sans-serif;
          font-size: 14px; font-weight: 500;
          color: #0B1F4B; text-decoration: none;
          transition: color .2s;
          position: relative;
        }
        .nav-link:hover { color: #FF6B00; }
        .nav-link::after {
          content:''; position:absolute; bottom:-3px; left:0;
          width:0; height:2px; background:#FF6B00;
          border-radius:2px; transition:width .2s;
        }
        .nav-link:hover::after { width:100%; }

        .btn-stu {
          display:inline-flex; align-items:center; gap:6px;
          font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
          color:#1E4FA3; background:white; border:1.5px solid #1E4FA3;
          border-radius:8px; padding:8px 16px; cursor:pointer; text-decoration:none;
          transition:all .2s; white-space:nowrap;
        }
        .btn-stu:hover { background:#EEF3FF; transform:translateY(-2px); box-shadow:0 4px 12px rgba(30,79,163,.18); }

        .btn-hr {
          display:inline-flex; align-items:center; gap:6px;
          font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
          color:white; background:#FF6B00; border:1.5px solid #FF6B00;
          border-radius:8px; padding:8px 16px; cursor:pointer; text-decoration:none;
          transition:all .2s; white-space:nowrap;
        }
        .btn-hr:hover { background:#e55f00; transform:translateY(-2px); box-shadow:0 4px 14px rgba(255,107,0,.30); }

        .search-btn {
          font-family:'Poppins',sans-serif; font-weight:700; font-size:14px;
          color:white; background:#FF6B00; border:none; border-radius:10px;
          padding:0 22px; height:46px; cursor:pointer;
          display:inline-flex; align-items:center; gap:5px;
          transition:all .2s; white-space:nowrap; flex-shrink:0;
        }
        .search-btn:hover { background:#e55f00; transform:translateY(-1px); box-shadow:0 4px 16px rgba(255,107,0,.30); }

        .chip {
          font-family:'Poppins',sans-serif; font-size:12px; font-weight:500;
          color:#0B1F4B; background:white; border:1.5px solid #DEE1E9;
          border-radius:999px; padding:4px 13px; cursor:pointer;
          text-decoration:none; transition:all .2s;
          display:inline-flex; align-items:center;
        }
        .chip:hover { background:#FFE9D6; border-color:#FF6B00; color:#FF6B00; transform:translateY(-1px); }

        .float-card {
          background:white; border-radius:16px;
          box-shadow: 0 8px 28px rgba(11,31,75,0.13);
          display:flex; align-items:center; gap:12px;
          padding:12px 16px; position:absolute;
        }

        /* Marquee styles */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marquee 38s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="hero-page">



        {/* ── Above‑the‑fold wrapper: fills desktop height on lg+, smooth flow on mobile ── */}
        <div className="flex flex-col overflow-visible lg:overflow-hidden lg:h-[calc(100vh-64px)] lg:min-h-[640px]">

          {/* ══════════════ HERO ════════════════════════════════════════════════ */}
          <section id="hero-search" className="w-full flex-1 overflow-visible lg:overflow-hidden py-8 sm:py-12 lg:py-0 flex items-center">
            <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[48%_52%] items-center h-full">

              {/* HERO CONTENT: Centered on mobile/tablet, left-aligned on desktop */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5 px-5 sm:px-8 lg:pl-12 lg:pr-6 py-6 lg:py-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 w-full">

                {/* Badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "#FFE9D6", borderRadius: "999px", padding: "7px 16px",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "13px", color: "#0B1F4B"
                }}>
                  <span style={{ color: "#FF6B00" }}><GraduationIcon /></span>
                  Your Career Starts Here
                </div>

                {/* Heading */}
                <h1 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 800, lineHeight: 1.15, color: "#0B1F4B",
                  fontSize: "clamp(30px, 4.2vw, 56px)", margin: 0
                }}>
                  Find the Right<br className="hidden sm:inline" />{" "}
                  <span style={{ color: "#FF6B00" }}>Opportunities</span><br className="hidden sm:inline" />{" "}
                  Build a Brighter Future
                </h1>

                {/* Paragraph */}
                <p style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 500, color: "#5B6580",
                  fontSize: "clamp(13.5px, 1.1vw, 16px)", lineHeight: 1.65, margin: 0, maxWidth: "520px"
                }}>
                  Explore top jobs, internships and career opportunities from trusted companies.
                  Build your profile, apply easily and track your progress – all in one place.
                </p>

                {/* Search bar */}
                <div className="bg-white rounded-2xl p-2 shadow-[0_10px_30px_rgba(11,31,75,0.07)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-[540px] border border-slate-100">
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-1">
                    <span style={{ color: "#FF6B00", flexShrink: 0 }}><SearchIcon /></span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search jobs, skills, companies..."
                      className="w-full bg-transparent border-none outline-none font-['Poppins',sans-serif] font-medium text-sm text-[#0B1F4B] h-10"
                    />
                  </div>
                  <button className="search-btn justify-center w-full sm:w-auto shadow-md shadow-[#FF6B00]/20">Search Jobs →</button>
                </div>


              </div>


              {/* RIGHT — image with decorative shapes (STRICTLY DESKTOP ONLY: lg:block, completely omitted from flow on mobile) */}
              <div className="hidden lg:block relative h-full min-h-[480px] w-full overflow-hidden select-none">

                {/* Blue circle — behind right of image */}
                <div style={{
                  position: "absolute", width: "340px", height: "340px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #2356BC 0%, #1A3F8F 100%)",
                  right: "20px", bottom: "30px", zIndex: 1,
                }} />

                {/* Orange circle — behind left shoulder */}
                <div style={{
                  position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF8C3D 0%, #FF6B00 100%)",
                  left: "60px", bottom: "50px", zIndex: 1,
                }} />

                {/* Small orange accent shapes */}
                <svg style={{ position: "absolute", top: "60px", left: "52px", zIndex: 3 }} width="28" height="28" viewBox="0 0 28 28">
                  <line x1="14" y1="1" x2="14" y2="27" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
                  <line x1="1" y1="14" x2="27" y2="14" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <svg style={{ position: "absolute", top: "50px", right: "80px", zIndex: 3 }} width="22" height="22" viewBox="0 0 22 22">
                  <line x1="11" y1="1" x2="11" y2="21" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="1" y1="11" x2="21" y2="11" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {/* Orange dots top */}
                <svg style={{ position: "absolute", top: "36px", left: "38%", zIndex: 3 }} width="40" height="14" viewBox="0 0 40 14">
                  <circle cx="5" cy="7" r="3.5" fill="#FF6B00" opacity="0.7" />
                  <circle cx="20" cy="7" r="3.5" fill="#FF6B00" opacity="0.5" />
                  <circle cx="35" cy="7" r="3.5" fill="#FF6B00" opacity="0.4" />
                </svg>

                {/* Hero Image */}
                <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                  <Image
                    src="/hero_image_1.webp"
                    alt="Smiling student with backpack and laptop"
                    fill
                    className="object-contain object-bottom"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                </div>

                {/* Handwritten text — top right */}
                <div style={{
                  position: "absolute", top: "20px", right: "30px", zIndex: 30,
                  fontFamily: "'Caveat',cursive", fontWeight: 700, fontSize: "22px",
                  color: "#0B1F4B", transform: "rotate(-9deg)", whiteSpace: "nowrap", lineHeight: 1.2,
                  pointerEvents: "none",
                }}>
                  Learn / Apply / Grow
                  <svg width="80" height="22" viewBox="0 0 80 22" fill="none" style={{ display: "block", marginTop: "3px" }}>
                    <path d="M4 8 C18 17, 54 18, 74 8" stroke="#FF6B00" strokeWidth="2" fill="none" strokeLinecap="round" className="da" />
                    <polygon points="70,4 80,9 69,12" fill="#FF6B00" />
                  </svg>
                </div>

                {/* Floating card 1 — 1000+ Jobs (left side) */}
                <div className="float-card fa scale-90 sm:scale-100" style={{ top: "34%", left: "4px", zIndex: 30, minWidth: "160px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", background: "#FFE9D6",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B00", flexShrink: 0
                  }}>
                    <BriefcaseIcon s={18} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>1000+</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "10px", color: "#5B6580" }}>Active Opportunities</div>
                  </div>
                </div>

                {/* Floating card 2 — Verified (top right) */}
                <div className="float-card fb scale-90 sm:scale-100" style={{ top: "10%", right: "4px", zIndex: 30, minWidth: "148px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", background: "#EEF3FF",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#1E4FA3", flexShrink: 0
                  }}>
                    <ShieldIcon />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>Verified</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "10px", color: "#5B6580" }}>Companies</div>
                  </div>
                </div>

                {/* Floating card 3 — Easy Applications (right lower) */}
                <div className="float-card fc scale-90 sm:scale-100" style={{ bottom: "16%", right: "4px", zIndex: 30, minWidth: "148px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", background: "#FFE9D6",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B00", flexShrink: 0
                  }}>
                    <TrendIcon />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>Easy</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "10px", color: "#5B6580" }}>Applications</div>
                  </div>
                </div>

                {/* Dashed connector 1 → 2 */}
                <svg style={{ position: "absolute", top: "20%", left: "8%", zIndex: 20, pointerEvents: "none", width: "190px", height: "100px" }}
                  viewBox="0 0 190 100" fill="none">
                  <path d="M12 88 C12 28, 175 12, 175 18" stroke="#0B1F4B" strokeWidth="1.5" fill="none" strokeLinecap="round" className="da" />
                  <polygon points="168,10 180,20 170,23" fill="#0B1F4B" opacity="0.6" />
                </svg>

                {/* Dashed connector 2 → 3 */}
                <svg style={{ position: "absolute", top: "28%", right: "8%", zIndex: 20, pointerEvents: "none", width: "36px", height: "110px" }}
                  viewBox="0 0 36 110" fill="none">
                  <path d="M18 5 C30 28, 30 65, 18 102" stroke="#0B1F4B" strokeWidth="1.5" fill="none" strokeLinecap="round" className="da"
                    style={{ animationDelay: "0.7s" }} />
                  <polygon points="12,96 22,110 11,108" fill="#0B1F4B" opacity="0.6" />
                </svg>

              </div>
            </div>
          </section>

          {/* ══════════════ STATS BAR (RESPONSIVE) ═══════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-6 pt-2 max-w-[1400px] mx-auto w-full shrink-0">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(11,31,75,0.06)] grid grid-cols-2 lg:grid-cols-4 border border-slate-100 divide-y divide-x-0 sm:divide-y-0 divide-slate-100">
              <StatItem icon={<BriefcaseIcon s={22} />} number="5,000+" label="Job Openings" />
              <StatItem icon={<BuildingIcon s={22} />} number="1,200+" label="Trusted Companies" />
              <StatItem icon={<UsersIcon s={22} />} number="50,000+" label="Students Placed" />
              <StatItem icon={<StarIcon s={22} />} number="95%" label="Positive Feedback" isLast />
            </div>
          </section>

        </div> {/* end above-the-fold wrapper */}

        {/* ══════════════ TOP COMPANIES HIRING (PIXEL-PERFECT SECTION) ═════════════════════ */}
        <TopCompaniesHiringSection />

        {/* ══════════════ HOW IT WORKS (RESPONSIVE) ═════════════════════════════ */}
        <section id="how-it-works" className="px-5 sm:px-8 py-16 sm:py-24 max-w-[1400px] mx-auto relative">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14 max-w-[700px] mx-auto">
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 18px",
              borderRadius: "999px",
              background: "#FFF4EB",
              border: "1px solid rgba(255,107,0,0.2)",
              marginBottom: "16px"
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6B00" }} />
              <span style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#FF6B00",
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}>
                HOW IT WORKS
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.4vw, 42px)",
              color: "#0B1F4B",
              margin: "0 0 14px",
              lineHeight: 1.2
            }}>
              Get Hired in <span style={{ color: "#FF6B00" }}>3 Simple Steps</span>
            </h2>

            <p style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#5B6580",
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              From creating your dynamic profile to landing your dream offer, our streamlined journey makes campus hiring effortless and transparent.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 relative">
            <StepCard
              step="1"
              tag="Step 01 • Onboarding"
              icon={<UserIcon />}
              title="Build Your Smart Profile"
              desc="Highlight your technical skills, college credentials, projects, and certifications to stand out to verified recruiters."
              highlights={[
                "Upload Resume or auto-import",
                "Skill endorsement badges",
                "Instant portfolio preview",
              ]}
              accentColor="#1E4FA3"
              bgGradient="linear-gradient(135deg, #1E4FA3 0%, #0B2565 100%)"
              lightBg="#EFF5FF"
              borderColor="rgba(30, 79, 163, 0.2)"
            />
            <StepCard
              step="2"
              tag="Step 02 • Discovery"
              icon={<BriefcaseIcon s={24} />}
              title="Apply with 1-Click"
              desc="Browse verified campus drives, internships, and full-time vacancies tailored to your branch and career preferences."
              highlights={[
                "Direct HR & Recruiter inbox",
                "Filter by CTC & location",
                "Instant application confirmation",
              ]}
              accentColor="#FF6B00"
              bgGradient="linear-gradient(135deg, #FF6B00 0%, #FF8A3D 100%)"
              lightBg="#FFF5ED"
              borderColor="rgba(255, 107, 0, 0.2)"
            />
            <StepCard
              step="3"
              tag="Step 03 • Placement"
              icon={<TrendIcon />}
              title="Track & Get Placed"
              desc="Monitor live recruitment status, assessment schedules, interview rounds, and receive formal offer letters directly."
              highlights={[
                "Live interview alerts & updates",
                "Direct feedback from employers",
                "Verified offer letter vault",
              ]}
              accentColor="#059669"
              bgGradient="linear-gradient(135deg, #059669 0%, #10B981 100%)"
              lightBg="#ECFDF5"
              borderColor="rgba(5, 150, 105, 0.2)"
            />
          </div>

        </section>

        {/* ══════════════ WHY CHOOSE US SECTION ════════════════════════════ */}
        <WhyChooseUsSection />

        {/* ══════════════ FOR EMPLOYERS SECTION ═════════════════════════════ */}
        <ForEmployersSection />

        {/* ══════════════ MOBILE APP SECTION ════════════════════════════════ */}
        <MobileAppSection />



      </div>
    </>
  );
}
