"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForEmployersSection() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        background: "linear-gradient(145deg, #FFFFFF 0%, #F5F8FF 60%, #EEF4FF 100%)",
        borderTop: "1px solid #EEF3FD",
        borderBottom: "1px solid #EEF3FD",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Caveat:ital,wght@1,600;1,700&display=swap');

        @keyframes bobFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .employer-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .employer-icon-tile {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2F5FD0;
          box-shadow: 0 4px 14px rgba(11, 31, 75, 0.08);
          border: 1px solid #EEF2F9;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .employer-feature-item:hover .employer-icon-tile {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(47, 95, 208, 0.18);
        }

        .employer-feature-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: #0B1F4B;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .employer-feature-item:hover .employer-feature-title {
          color: #FF6B00;
        }

        .floating-verify-card {
          animation: bobFloat 3.2s ease-in-out infinite;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 10px 16px;
          box-shadow: 0 10px 28px rgba(11, 31, 75, 0.12);
          border: 1px solid #EEF2FA;
          display: flex;
          align-items: center;
          gap: 10px;
          position: absolute;
          z-index: 20;
        }

        .btn-post-job {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #FFFFFF;
          background: #FF6B00;
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(255, 107, 0, 0.32);
          transition: all 0.2s ease;
        }
        .btn-post-job:hover {
          background: #E85E00;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(255, 107, 0, 0.42);
        }

        .btn-hr-login {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #0B1F4B;
          background: #FFFFFF;
          border: 1.5px solid #D6E3F8;
          border-radius: 10px;
          padding: 12px 28px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(11, 31, 75, 0.04);
          transition: all 0.2s ease;
        }
        .btn-hr-login:hover {
          border-color: #2F5FD0;
          color: #2F5FD0;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(47, 95, 208, 0.12);
        }
      `}</style>

      {/* Ambient background soft glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(214, 233, 255, 0.6) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "20%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 235, 221, 0.5) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative SVG Dot Grid (Top Right) */}
      <svg
        style={{ position: "absolute", top: "40px", right: "60px", zIndex: 1, pointerEvents: "none", opacity: 0.28 }}
        width="140"
        height="140"
        fill="none"
      >
        <pattern id="dot-grid-employer" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#2F5FD0" />
        </pattern>
        <rect width="140" height="140" fill="url(#dot-grid-employer)" />
      </svg>

      {/* Decorative SVG Dot Grid (Bottom Left) */}
      <svg
        style={{ position: "absolute", bottom: "30px", left: "40px", zIndex: 1, pointerEvents: "none", opacity: 0.22 }}
        width="120"
        height="120"
        fill="none"
      >
        <pattern id="dot-grid-employer-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#FF6B00" />
        </pattern>
        <rect width="120" height="120" fill="url(#dot-grid-employer-2)" />
      </svg>

      {/* Subtle geometric plus / cross accents */}
      <div style={{ position: "absolute", top: "18%", left: "48%", zIndex: 1, opacity: 0.35, pointerEvents: "none" }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <line x1="12" y1="2" x2="12" y2="22" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: "22%", right: "8%", zIndex: 1, opacity: 0.25, pointerEvents: "none" }}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <line x1="12" y1="2" x2="12" y2="22" stroke="#2F5FD0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#2F5FD0" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Subtle decorative concentric circle in background center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          border: "1.5px dashed rgba(47, 95, 208, 0.08)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "920px",
          height: "920px",
          borderRadius: "50%",
          border: "1px solid rgba(255, 107, 0, 0.05)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Container */}
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-8 lg:px-9 relative" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] items-center gap-10">
          
          {/* LEFT COLUMN (Image Side) — hidden on mobile/tablet */}
          <div
            className="hidden lg:flex"
            style={{
              position: "relative",
              alignItems: "flex-end",
              justifyContent: "center",
              minHeight: "540px",
              height: "100%",
            }}
          >
            {/* Floating Top Metric Card: "3x Faster" */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "2%",
                zIndex: 20,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                padding: "10px 16px",
                borderRadius: "14px",
                border: "1.5px solid #EEF2FA",
                boxShadow: "0 10px 24px rgba(11, 31, 75, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#ECFDF5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0B1F4B", lineHeight: 1.2 }}>
                  3x Faster
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#6B7694" }}>
                  Shortlisting Time
                </div>
              </div>
            </div>

            {/* 1. Large Royal Blue Circle (#2F5FD0) on the left */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "6%",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2F5FD0 0%, #1A44A5 100%)",
                boxShadow: "0 20px 48px rgba(47, 95, 208, 0.28)",
                zIndex: 1,
              }}
            />

            {/* 2. Medium Orange Circle (#FF9A3D) at top-right of her head */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "12%",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF9A3D 0%, #FF781E 100%)",
                boxShadow: "0 10px 24px rgba(255, 120, 30, 0.3)",
                zIndex: 2,
              }}
            />

            {/* Orange arrow accent with short trail next to orange circle */}
            <div
              style={{
                position: "absolute",
                top: "8%",
                right: "6%",
                zIndex: 4,
                transform: "rotate(15deg)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* 3. Top-left handwritten accent text (Caveat, -8deg, stacked lines) */}
            <div
              style={{
                position: "absolute",
                top: "3%",
                left: "3%",
                zIndex: 10,
                fontFamily: "'Caveat', cursive",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "22px",
                color: "#0B1F4B",
                transform: "rotate(-8deg)",
                lineHeight: 1.25,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div>Post / Review</div>
              <div>Shortlist / Hire</div>
              {/* Curved dashed line pointing downwards */}
              <svg width="65" height="42" viewBox="0 0 65 42" fill="none" style={{ marginTop: "4px" }}>
                <path
                  d="M8 4 C18 20, 42 26, 56 34"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  fill="none"
                />
                <polygon points="50,38 62,37 56,27" fill="#FF6B00" />
              </svg>
            </div>

            {/* 4. Floating white card: "Verified Candidates" */}
            <div className="floating-verify-card" style={{ bottom: "24%", left: "0%" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#EFF5FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2F5FD0",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0B1F4B", lineHeight: 1.2 }}>
                  Verified
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#6B7694" }}>
                  Candidates
                </div>
              </div>
            </div>

            {/* Dashed line running downward along blue circle */}
            <svg
              style={{ position: "absolute", bottom: "14%", left: "12%", zIndex: 3, pointerEvents: "none", width: "80px", height: "90px" }}
              viewBox="0 0 80 90"
              fill="none"
            >
              <path d="M10 5 C35 30, 45 60, 40 85" stroke="#2F5FD0" strokeWidth="1.5" strokeDasharray="4 3" fill="none" strokeLinecap="round" opacity="0.6" />
            </svg>

            {/* Cut-out photo of businesswoman with laptop - Enlarged significantly & shifted left */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "560px",
                height: "600px",
                zIndex: 6,
                transform: "scale(1.45) translateX(-32px) translateY(18px)",
                transformOrigin: "bottom center",
              }}
            >
              <Image
                src="/section-4.webp"
                alt="Smiling Indian businesswoman typing on laptop"
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Content Side) */}
          <div className="lg:pl-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 1. Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 16px",
                borderRadius: "999px",
                background: "#FFEBDD",
                marginBottom: "18px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="9" y1="22" x2="9" y2="18" />
                <line x1="15" y1="22" x2="15" y2="18" />
                <line x1="15" y1="18" x2="9" y2="18" />
                <line x1="8" y1="6" x2="8.01" y2="6" />
                <line x1="16" y1="6" x2="16.01" y2="6" />
                <line x1="12" y1="6" x2="12.01" y2="6" />
                <line x1="12" y1="10" x2="12.01" y2="10" />
                <line x1="12" y1="14" x2="12.01" y2="14" />
                <line x1="16" y1="10" x2="16.01" y2="10" />
                <line x1="16" y1="14" x2="16.01" y2="14" />
                <line x1="8" y1="10" x2="8.01" y2="10" />
                <line x1="8" y1="14" x2="8.01" y2="14" />
              </svg>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#FF6B00",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                FOR EMPLOYERS
              </span>
            </div>

            {/* 2. Heading */}
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 3.2vw, 42px)",
                color: "#0B1F4B",
                lineHeight: 1.2,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              Find <span style={{ color: "#FF6B00" }}>the Right Talent</span> Faster
            </h2>

            {/* 3. Sub text */}
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                color: "#6B7694",
                margin: "0 0 32px",
                lineHeight: 1.6,
                maxWidth: "520px",
              }}
            >
              Hire skilled and job-ready talent from a diverse pool of students.
            </p>

            {/* 4. Features list: 2 columns x 3 rows */}
            <div
              style={{
                columnGap: "28px",
                rowGap: "22px",
                marginBottom: "36px",
              }}
              className="grid grid-cols-1 sm:grid-cols-2 w-full text-left"
            >
              {/* Row 1 Left */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <div>
                  <div className="employer-feature-title">Access verified student profiles</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#8E98B0", marginTop: "2px" }}>
                    from top colleges
                  </div>
                </div>
              </div>

              {/* Row 1 Right */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <div className="employer-feature-title" style={{ marginTop: "7px" }}>
                  Candidate shortlisting with filters
                </div>
              </div>

              {/* Row 2 Left */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="employer-feature-title" style={{ marginTop: "7px" }}>
                  Smart applicant management
                </div>
              </div>

              {/* Row 2 Right */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div className="employer-feature-title" style={{ marginTop: "7px" }}>
                  Hiring analytics and reports
                </div>
              </div>

              {/* Row 3 Left */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="employer-feature-title" style={{ marginTop: "7px" }}>
                  Easy interview scheduling
                </div>
              </div>

              {/* Row 3 Right */}
              <div className="employer-feature-item">
                <div className="employer-icon-tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <div className="employer-feature-title" style={{ marginTop: "7px" }}>
                  Dedicated support from WeGrow
                </div>
              </div>
            </div>

            {/* 5. Buttons row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full">
              <a href="/hr/register" className="btn-post-job">
                Post a Job →
              </a>
              <a href="/hr/login" className="btn-hr-login">
                HR Login
              </a>
            </div>

            {/* Trust and Key Employer Stats strip */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "24px",
                paddingTop: "24px",
                borderTop: "1.5px solid #EEF2F8",
              }}
              className="justify-center lg:justify-start w-full"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <span style={{ color: "#059669", fontSize: "16px" }}>✓</span>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>
                    1,200+
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#6B7694" }}>
                    Active Recruiters
                  </div>
                </div>
              </div>

              <div style={{ height: "24px", width: "1px", background: "#E2E8F0" }} className="hidden sm:block" />

              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <span style={{ color: "#FF6B00", fontSize: "16px" }}>⚡</span>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>
                    &lt; 48 Hours
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#6B7694" }}>
                    Avg. First Response
                  </div>
                </div>
              </div>

              <div style={{ height: "24px", width: "1px", background: "#E2E8F0" }} className="hidden sm:block" />

              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <span style={{ color: "#2F5FD0", fontSize: "16px" }}>★</span>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: "#0B1F4B", lineHeight: 1.2 }}>
                    Zero Cost
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#6B7694" }}>
                    To Post Campus Drives
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
