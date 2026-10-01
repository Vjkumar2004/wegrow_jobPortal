"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WhyChooseUsSection from "./WhyChooseUsSection";
import ForEmployersSection from "./ForEmployersSection";
import MobileAppSection from "./MobileAppSection";
import { Footer } from "@/components/common/Footer";
import { PublicNavbar } from "@/components/common/PublicNavbar";

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
  <div className={`flex items-center gap-4 py-5 px-6 flex-1 ${!isLast ? "border-r border-slate-100" : ""}`}>
    <div className="w-12 h-12 rounded-2xl bg-[#FFE9D6] flex items-center justify-center text-[#FF6B00] shrink-0">
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "22px", color: "#0B1F4B", lineHeight: 1.2 }}>{number}</div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "13px", color: "#5B6580", marginTop: "2px" }}>{label}</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   COMPANY LOGO (styled text)
═══════════════════════════════════════════════════════ */
const CompanyLogo = ({ name, color, bg, category, jobs, logoUrl }: {
  name: string; color: string; bg: string; category?: string; jobs?: string; logoUrl?: string;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href="/companies"
      style={{ textDecoration: "none" }}
      className="group flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(11,31,75,0.05)] hover:shadow-[0_12px_32px_rgba(11,31,75,0.12)] hover:-translate-y-1.5 transition-all duration-300 min-w-[270px]"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base tracking-tight shrink-0 overflow-hidden bg-white shadow-inner p-2 border border-slate-100 transition-transform duration-300 group-hover:scale-105"
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
            className="w-full h-full rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: bg, color }}
          >
            {name.slice(0, 3)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-0.5">
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "15px", color: "#0B1F4B" }} className="truncate">
            {name}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: "10px", color: "#059669", fontWeight: 600 }}>Hiring</span>
          </span>
        </div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "12px", color: "#5B6580" }} className="truncate font-medium">
          {category || "Technology"}
        </div>
        {jobs && (
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "12px", color: "#FF6B00", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{jobs}</span>
            <span className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </div>
        )}
      </div>
    </a>
  );
};

/* ═══════════════════════════════════════════════════════
   STEP CARD
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
    className="group relative bg-white rounded-[28px] p-8 transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between overflow-hidden"
    style={{
      border: `1.5px solid #EEF0F5`,
      boxShadow: "0 10px 30px rgba(11,31,75,0.06)",
    }}
  >
    {/* Top decorative gradient glow accent */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "5px",
        background: bgGradient,
      }}
    />

    {/* Background ambient radial glow on hover */}
    <div
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        background: lightBg,
        filter: "blur(40px)",
        zIndex: 0,
      }}
    />

    {/* Big stylish step number watermark */}
    <div
      style={{
        position: "absolute",
        top: "22px",
        right: "26px",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "72px",
        fontWeight: 900,
        color: "#0B1F4B",
        opacity: 0.05,
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1,
      }}
    >
      0{step}
    </div>

    <div style={{ position: "relative", zIndex: 2 }}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 mb-7">
        {/* Glow Icon Box */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
          style={{
            background: bgGradient,
            boxShadow: `0 8px 22px ${accentColor}35`,
          }}
        >
          {icon}
        </div>

        {/* Phase Pill Tag */}
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: accentColor,
            background: lightBg,
            border: `1px solid ${borderColor}`,
            padding: "6px 14px",
            borderRadius: "999px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: "21px",
          color: "#0B1F4B",
          marginBottom: "12px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "14px",
          color: "#5B6580",
          lineHeight: 1.65,
          marginBottom: "24px",
        }}
      >
        {desc}
      </p>

      {/* Key Feature List */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: "16px",
          padding: "16px 18px",
          border: "1px solid #EEF2F6",
        }}
        className="space-y-2.5"
      >
        {highlights.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-xs text-[#3E4A68]"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: lightBg,
                color: accentColor,
                fontSize: "10px",
                fontWeight: 800,
                border: `1px solid ${borderColor}`,
              }}
            >
              ✓
            </span>
            <span className="font-semibold text-[13px] text-[#223354]">{h}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Footer Navigation link */}
    <div
      className="mt-8 pt-4 flex items-center justify-between text-xs"
      style={{ borderTop: "1px solid #F1F4F9", position: "relative", zIndex: 2 }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accentColor }}
        />
        <span style={{ fontFamily: "'Poppins', sans-serif", color: "#64748B", fontWeight: 600 }}>
          Phase 0{step}
        </span>
      </div>
      <a
        href="/student/login"
        style={{
          fontFamily: "'Poppins', sans-serif",
          color: accentColor,
          fontWeight: 700,
          textDecoration: "none",
        }}
        className="flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-200"
      >
        Get Started <ArrowRightIcon />
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
        @keyframes marqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marquee 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-track-reverse {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marqueeReverse 36s linear infinite;
        }
        .marquee-track-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="hero-page">

        {/* ══════════════ UNIFIED PUBLIC NAVBAR (Used across all pages) ══════════════ */}
        <PublicNavbar />

        {/* ── Above‑the‑fold wrapper: fills exactly 100vh (navbar + hero + stats) ── */}
        <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* ══════════════ HERO ════════════════════════════════════════════════ */}
          <section id="hero-search" style={{ width: "100%", flex: 1, overflow: "hidden", minHeight: 0 }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "46% 54%", alignItems: "center", height: "100%" }}
              className="grid-cols-1 lg:grid-cols-[46%_54%]">

              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "48px 32px 48px 48px" }}
                className="order-2 lg:order-1">

                {/* Badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px", alignSelf: "flex-start",
                  background: "#FFE9D6", borderRadius: "999px", padding: "8px 16px",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "13px", color: "#0B1F4B"
                }}>
                  <span style={{ color: "#FF6B00" }}><GraduationIcon /></span>
                  Your Career Starts Here
                </div>

                {/* Heading */}
                <h1 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 800, lineHeight: 1.1, color: "#0B1F4B",
                  fontSize: "clamp(36px, 4.2vw, 60px)", margin: 0
                }}>
                  Find the Right<br />
                  <span style={{ color: "#FF6B00" }}>Opportunities</span><br />
                  Build a Brighter Future
                </h1>

                {/* Paragraph */}
                <p style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 500, color: "#5B6580",
                  fontSize: "clamp(14px, 1.1vw, 16.5px)", lineHeight: 1.7, margin: 0, maxWidth: "480px"
                }}>
                  Explore top jobs, internships and career opportunities from trusted companies.
                  Build your profile, apply easily and track your progress – all in one place.
                </p>

                {/* Search bar */}
                <div style={{
                  background: "white", borderRadius: "14px", padding: "6px",
                  boxShadow: "0 8px 32px rgba(11,31,75,0.10)", display: "flex", alignItems: "center", gap: "8px", maxWidth: "520px"
                }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "0 12px" }}>
                    <span style={{ color: "#FF6B00", flexShrink: 0 }}><SearchIcon /></span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search jobs, skills, companies..."
                      style={{
                        width: "100%", background: "transparent", border: "none", outline: "none",
                        fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: "14px",
                        color: "#0B1F4B", height: "40px"
                      }}
                    />
                  </div>
                  <button className="search-btn">Search Jobs →</button>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", maxWidth: "520px" }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "13px", color: "#0B1F4B", flexShrink: 0 }}>
                    Popular Searches:
                  </span>
                  {tags.map(t => (
                    <a key={t} href={`/jobs?search=${encodeURIComponent(t)}`} className="chip">{t}</a>
                  ))}
                </div>
              </div>

              {/* RIGHT — image with decorative shapes */}
              <div style={{ position: "relative", height: "100%", overflow: "visible" }} className="order-1 lg:order-2">

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
                    src="/hero_image_1.png"
                    alt="Smiling student with backpack and laptop"
                    fill
                    className="object-contain object-bottom"
                    priority
                    sizes="(max-width: 768px) 100vw, 55vw"
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
                <div className="float-card fa" style={{ top: "34%", left: "-4px", zIndex: 30, minWidth: "180px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", background: "#FFE9D6",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B00", flexShrink: 0
                  }}>
                    <BriefcaseIcon s={19} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "15px", color: "#0B1F4B", lineHeight: 1.2 }}>1000+</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "11px", color: "#5B6580" }}>Active Job Opportunities</div>
                  </div>
                </div>

                {/* Floating card 2 — Verified (top right) */}
                <div className="float-card fb" style={{ top: "14%", right: "2%", zIndex: 30, minWidth: "162px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", background: "#EEF3FF",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#1E4FA3", flexShrink: 0
                  }}>
                    <ShieldIcon />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "15px", color: "#0B1F4B", lineHeight: 1.2 }}>Verified</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "11px", color: "#5B6580" }}>Companies</div>
                  </div>
                </div>

                {/* Floating card 3 — Easy Applications (right lower) */}
                <div className="float-card fc" style={{ bottom: "20%", right: "2%", zIndex: 30, minWidth: "162px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", background: "#FFE9D6",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B00", flexShrink: 0
                  }}>
                    <TrendIcon />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "15px", color: "#0B1F4B", lineHeight: 1.2 }}>Easy</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "11px", color: "#5B6580" }}>Applications</div>
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

          {/* ══════════════ STATS BAR ═══════════════════════════════════════════ */}
          <section style={{ padding: "0 32px 20px", maxWidth: "1400px", margin: "0 auto", width: "100%", flexShrink: 0 }}>
            <div style={{
              background: "white", borderRadius: "18px", overflow: "hidden",
              boxShadow: "0 8px 36px rgba(11,31,75,0.08)", display: "grid", gridTemplateColumns: "repeat(4,1fr)"
            }}
              className="grid-cols-2 md:grid-cols-4">
              <StatItem icon={<BriefcaseIcon s={22} />} number="5,000+" label="Job Openings" />
              <StatItem icon={<BuildingIcon s={22} />} number="1,200+" label="Trusted Companies" />
              <StatItem icon={<UsersIcon s={22} />} number="50,000+" label="Students Placed" />
              <StatItem icon={<StarIcon s={22} />} number="95%" label="Positive Feedback" isLast />
            </div>
          </section>

        </div> {/* end above-the-fold wrapper */}

        {/* ══════════════ TOP COMPANIES HIRING (MARQUEE) ═════════════════════ */}
        <section id="companies-section" style={{ padding: "70px 0 80px", background: "#FFFFFF", borderTop: "1px solid #EEF0F5", borderBottom: "1px solid #EEF0F5", overflow: "hidden" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px 36px", textAlign: "center" }}>
            {/* Pill Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "#FFE9D6",
              border: "1px solid rgba(255,107,0,0.2)",
              marginBottom: "16px"
            }}>
              <span style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#FF6B00",
                boxShadow: "0 0 0 3px rgba(255,107,0,0.25)"
              }} />
              <span style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FF6B00",
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}>
                Featured Employers
              </span>
            </div>

            {/* Big Title */}
            <h2 style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.4vw, 44px)",
              color: "#0B1F4B",
              lineHeight: 1.2,
              margin: "0 0 14px",
              letterSpacing: "-0.5px"
            }}>
              Top Companies <span style={{ color: "#FF6B00" }}>Actively Hiring</span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: "'Poppins',sans-serif",
              fontSize: "16px",
              color: "#5B6580",
              lineHeight: 1.6,
              margin: "0 auto 24px",
              maxWidth: "680px",
              fontWeight: 400
            }}>
              Get placed in world-leading tech giants, high-growth startups, and Fortune 500 enterprises partnering with WeGrow.
            </p>

            {/* Action Button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a
                href="/companies"
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#0B1F4B",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  transition: "all 0.25s ease"
                }}
                className="hover:border-[#FF6B00] hover:text-[#FF6B00] hover:shadow-md hover:bg-white"
              >
                Explore All 1,200+ Companies
                <span style={{ color: "#FF6B00" }}><ArrowRightIcon /></span>
              </a>
            </div>
          </div>

          {/* Marquee viewport with gradient mask */}
          <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            {/* Left & Right gradient edge fades */}
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "160px", background: "linear-gradient(to right, #FFFFFF, rgba(255,255,255,0))", zIndex: 10, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "160px", background: "linear-gradient(to left, #FFFFFF, rgba(255,255,255,0))", zIndex: 10, pointerEvents: "none" }} />

            {/* Row 1: Leftward marquee */}
            <div className="marquee-track" style={{ marginBottom: "20px" }}>
              {companies.concat(companies).map((c, i) => (
                <CompanyLogo key={`row1-${c.name}-${i}`} {...c} />
              ))}
            </div>

            {/* Row 2: Rightward marquee */}
            <div className="marquee-track-reverse">
              {companies.slice(5).concat(companies.slice(0, 5)).concat(companies.slice(5)).concat(companies.slice(0, 5)).map((c, i) => (
                <CompanyLogo key={`row2-${c.name}-${i}`} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ═════════════════════════════════════════ */}
        <section id="how-it-works" style={{ padding: "80px 32px 100px", maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "50px", maxWidth: "700px", margin: "0 auto 50px" }}>
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
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", position: "relative" }}
            className="grid-cols-1 md:grid-cols-3"
          >
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

        {/* ══════════════ WEGROW FOOTER ═════════════════════════════════════ */}
        <Footer />

      </div>
    </>
  );
}
