"use client";

import React from "react";
import Image from "next/image";

export default function WhyChooseUsSection() {
  const features = [
    // Row 1
    {
      title: "Smart Profile",
      desc: "Showcase your skills and stand out",
      bg: "linear-gradient(135deg, #E6F7FA 0%, #D6F1F7 100%)",
      color: "#0284C7",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: "Resume Builder",
      desc: "Create a professional resume with ease",
      bg: "linear-gradient(135deg, #EEF2FF 0%, #E3E9FF 100%)",
      color: "#4F46E5",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      title: "Verified Jobs",
      desc: "Apply to trusted companies only",
      bg: "linear-gradient(135deg, #FFF0F0 0%, #FFE1E1 100%)",
      color: "#E11D48",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      title: "One-click Applications",
      desc: "Apply in seconds without hassle",
      bg: "linear-gradient(135deg, #FFF4E5 0%, #FFE6C7 100%)",
      color: "#EA580C",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 15l6-6m0 0l-5-1m5 1l-1 5" />
          <path d="M4 20l7-7" />
          <circle cx="9" cy="9" r="6" />
        </svg>
      ),
    },
    // Row 2
    {
      title: "Interview Tracking",
      desc: "Never miss an update",
      bg: "linear-gradient(135deg, #E8FAF1 0%, #D7F5E6 100%)",
      color: "#059669",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Career Reports",
      desc: "Track your progress with insights",
      bg: "linear-gradient(135deg, #EFEFFF 0%, #E5E3FF 100%)",
      color: "#7C3AED",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      title: "Skill Recommendations",
      desc: "Get personalized learning suggestions",
      bg: "linear-gradient(135deg, #FFF4E5 0%, #FFE9CC 100%)",
      color: "#D97706",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      title: "Placement Updates",
      desc: "Get notified about new opportunities",
      bg: "linear-gradient(135deg, #E8FAF0 0%, #D3F4E3 100%)",
      color: "#10B981",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ];

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

        .feature-item {
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .feature-icon-tile {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 6px 18px rgba(11, 31, 75, 0.08);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }

        .feature-item:hover .feature-icon-tile {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 24px rgba(11, 31, 75, 0.14);
        }

        .feature-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: "#0B1F4B";
          line-height: 1.3;
          margin-bottom: 5px;
          transition: color 0.2s ease;
        }

        .feature-item:hover .feature-title {
          color: #FF6B00;
        }

        .feature-desc {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #6B7694;
          line-height: 1.5;
        }
      `}</style>

      {/* Faint cloud-like blur on the left background */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(214, 241, 247, 0.55) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Inner Full-Width Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-8 lg:px-9 relative" style={{ zIndex: 10 }}>
        {/* Content Grid: Left Column (Content & 4x2 Grid) + Right Column (Image & Graphics) */}
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] items-center gap-10">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 2. Pill Badge: arrow icon + WHY CHOOSE US */}
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#FF6B00",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                WHY CHOOSE US
              </span>
            </div>

            {/* 3. Heading */}
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(26px, 3.2vw, 44px)",
                color: "#0B1F4B",
                lineHeight: 1.18,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              Everything You Need to{" "}
              <span style={{ color: "#FF6B00" }}>Build Your Career</span>
            </h2>

            {/* 4. Sub text */}
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                color: "#6B7694",
                margin: "0 0 36px",
                lineHeight: 1.6,
                maxWidth: "600px",
              }}
            >
              More than just a job portal - we help you grow, learn and succeed.
            </p>

            {/* 5. Features Grid: responsive - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-8 w-full">
              {features.map((item, idx) => (
                <div key={idx} className="feature-item flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div
                    className="feature-icon-tile"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="feature-title">{item.title}</div>
                  <div className="feature-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — hidden on mobile/tablet, shown on lg+ only */}
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
            {/* Large Royal Blue Circle partially hidden behind shoulder */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "4%",
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2F5FD0 0%, #1A44A5 100%)",
                boxShadow: "0 20px 48px rgba(47, 95, 208, 0.28)",
                zIndex: 1,
              }}
            />

            {/* Top-Right Handwritten Accent Text (Caveat) */}
            <div
              style={{
                position: "absolute",
                top: "2%",
                right: "4%",
                zIndex: 10,
                fontFamily: "'Caveat', cursive",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "23px",
                color: "#0B1F4B",
                transform: "rotate(-8deg)",
                lineHeight: 1.2,
                textAlign: "right",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div>Skills / Experience</div>
              <div>Opportunities / Growth</div>
              {/* Dashed curved arrow pointing down toward him */}
              <svg width="60" height="42" viewBox="0 0 60 42" fill="none" style={{ marginLeft: "auto", marginTop: "5px" }}>
                <path
                  d="M52 4 C44 20, 24 28, 8 36"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  fill="none"
                />
                <polygon points="14,30 5,38 18,39" fill="#FF6B00" />
              </svg>
            </div>

            {/* Tiny orange paper-plane / arrow accent near left side of image */}
            <div
              style={{
                position: "absolute",
                left: "2%",
                top: "44%",
                zIndex: 8,
                transform: "rotate(-15deg)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF6B00">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>

            {/* Student Cut-out Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                height: "540px",
                zIndex: 5,
              }}
            >
              <Image
                src="/section-3.png"
                alt="Student holding laptop with backpack"
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
