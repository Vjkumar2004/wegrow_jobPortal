"use client";

import React from "react";
import Image from "next/image";

export default function MobileAppSection() {
  const floatingFeatures = [
    {
      title: "Instant Job Alerts",
      desc: "Real-time alerts for top matched openings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      badgeColor: "#FFF2E8",
    },
    {
      title: "Track Applications",
      desc: "Live interview & application status tracker",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F5FD0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
      badgeColor: "#EEF4FF",
    },
    {
      title: "Interview Updates",
      desc: "Direct schedule & calendar sync",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      badgeColor: "#FFF2E8",
    },
    {
      title: "Apply on the Go",
      desc: "1-Click verified student profiles",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F5FD0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 15l6-6m0 0l-5-1m5 1l-1 5" />
          <path d="M4 20l7-7" />
          <circle cx="9" cy="9" r="6" />
        </svg>
      ),
      badgeColor: "#EEF4FF",
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
        padding: "70px 0",
        background: "linear-gradient(145deg, #FFFFFF 0%, #F5F8FF 55%, #EEF4FF 100%)",
        borderTop: "1px solid #EEF3FD",
        borderBottom: "1px solid #EEF3FD",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        @keyframes phoneHoverFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(0.4deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
          }
        }

        .phone-right-mockup {
          animation: phoneHoverFloat 5s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .phone-right-mockup:hover {
          animation-play-state: paused;
          transform: translateY(-6px) scale(1.02);
        }

        /* ─── Google Play Store Button ─── */
        .google-play-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #0B1F4B;
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 14px;
          box-shadow: 0 10px 24px rgba(11, 31, 75, 0.22);
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          min-width: 200px;
          height: 64px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-sizing: border-box;
        }
        .google-play-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(11, 31, 75, 0.32);
          background: #081738;
        }

        /* ─── Apple App Store Button (Disabled look) ─── */
        .app-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #ECEEF3;
          color: #8A93A8;
          padding: 12px 24px;
          border-radius: 14px;
          cursor: not-allowed;
          min-width: 200px;
          height: 64px;
          border: 1px solid #DFE3EC;
          user-select: none;
          box-sizing: border-box;
        }

        .app-feature-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 6px 18px rgba(11, 31, 75, 0.07);
          border: 1px solid #EEF2FA;
          transition: all 0.25s ease;
        }
        .app-feature-card:hover {
          transform: translateY(-3px) translateX(4px);
          box-shadow: 0 12px 28px rgba(11, 31, 75, 0.12);
          border-color: #E0E7FF;
        }

        .active-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          border-radius: 999px;
          background: #FFEBDD;
          border: 1px solid rgba(255, 107, 0, 0.2);
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.1);
        }
      `}</style>

      {/* Background Soft Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 235, 221, 0.65) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-80px",
          width: "580px",
          height: "580px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(214, 233, 255, 0.7) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative SVG Dot Grid (Top Right) */}
      <svg
        style={{ position: "absolute", top: "50px", right: "60px", zIndex: 1, pointerEvents: "none", opacity: 0.25 }}
        width="130"
        height="130"
        fill="none"
      >
        <pattern id="dot-grid-app-top" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#FF6B00" />
        </pattern>
        <rect width="130" height="130" fill="url(#dot-grid-app-top)" />
      </svg>

      {/* Decorative SVG Dot Grid (Bottom Left) */}
      <svg
        style={{ position: "absolute", bottom: "40px", left: "60px", zIndex: 1, pointerEvents: "none", opacity: 0.22 }}
        width="130"
        height="130"
        fill="none"
      >
        <pattern id="dot-grid-app-bot" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#2F5FD0" />
        </pattern>
        <rect width="130" height="130" fill="url(#dot-grid-app-bot)" />
      </svg>

      {/* Subtle Concentric Decorative Ring Behind Phone on the Right */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "22%",
          transform: "translate(50%, -50%)",
          width: "660px",
          height: "660px",
          borderRadius: "50%",
          border: "1.5px dashed rgba(255, 107, 0, 0.12)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main Container */}
      <div style={{ maxWidth: "1380px", width: "100%", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] items-center gap-12 lg:gap-14">
          
          {/* ═══════════════ LEFT COLUMN (Content, Features, App Store Buttons) ═══════════════ */}
          <div>
            {/* 1. Pill Badge */}
            <div style={{ marginBottom: "18px" }}>
              <div className="active-badge-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B00">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#FF6B00",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  AVAILABLE SOON
                </span>
              </div>
            </div>

            {/* 2. Heading (Single line on desktop) */}
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(26px, 2.7vw, 40px)",
                color: "#0B1F4B",
                lineHeight: 1.2,
                margin: "0 0 16px",
                letterSpacing: "-0.5px",
                whiteSpace: "normal",
              }}
              className="lg:whitespace-nowrap"
            >
              Your Career,{" "}
              <span style={{ color: "#FF6B00", position: "relative" }}>
                Wherever You Go
                <svg
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: 0,
                    width: "100%",
                    height: "8px",
                  }}
                  viewBox="0 0 260 8"
                  fill="none"
                >
                  <path
                    d="M2 6C70 2 190 2 258 6"
                    stroke="#FF6B00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </h2>

            {/* 3. Sub text */}
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#6B7694",
                margin: "0 0 32px",
                lineHeight: 1.65,
                maxWidth: "540px",
              }}
            >
              Get job alerts, track applications and never miss an interview. Experience seamless hiring anywhere, anytime with lightning-fast updates.
            </p>

            {/* 4. Feature Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "14px",
                marginBottom: "36px",
                maxWidth: "540px",
              }}
            >
              {floatingFeatures.map((item, idx) => (
                <div key={idx} className="app-feature-card">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: item.badgeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#0B1F4B",
                        lineHeight: 1.3,
                        marginBottom: "2px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 400,
                        fontSize: "11px",
                        color: "#6B7694",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Store buttons row */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              {/* Google Play Store Button */}
              <a href="#" className="google-play-btn" style={{ minWidth: "205px", height: "64px" }}>
                <div style={{ position: "relative", width: "28px", height: "30px", flexShrink: 0 }}>
                  <Image
                    src="/google-play-icon.svg"
                    alt="Google Play"
                    fill
                    className="object-contain"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.1,
                      fontWeight: 500,
                    }}
                  >
                    Get it on
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#FFFFFF",
                      lineHeight: 1.25,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Google Play
                  </span>
                </div>
              </a>

              {/* Apple App Store Button (Disabled look) */}
              <div className="app-store-btn" title="Coming soon to the Apple App Store" style={{ minWidth: "205px", height: "64px" }}>
                <div style={{ position: "relative", width: "26px", height: "30px", flexShrink: 0, opacity: 0.55 }}>
                  <Image
                    src="/apple-icon.svg"
                    alt="Apple App Store"
                    fill
                    className="object-contain"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#8A93A8",
                      lineHeight: 1.1,
                      fontWeight: 500,
                    }}
                  >
                    Coming Soon
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#8A93A8",
                      lineHeight: 1.25,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    App Store
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ RIGHT COLUMN (High-Res Smartphone Mockup Image section-5.png) ═══════════════ */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "580px",
            }}
          >
            {/* 1. Large Light Orange to Brand Orange Gradient Circle behind phone */}
            <div
              style={{
                position: "absolute",
                top: "6%",
                right: "12%",
                width: "410px",
                height: "410px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8A1F 0%, #FF6B00 100%)",
                boxShadow: "0 24px 60px rgba(255, 107, 0, 0.32)",
                zIndex: 1,
                animation: "pulseGlow 6s ease-in-out infinite",
              }}
            />

            {/* 2. Smaller Royal Blue Circle (#2F5FD0) overlapping bottom-right/left */}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                right: "4%",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2F5FD0 0%, #1742A1 100%)",
                boxShadow: "0 14px 34px rgba(47, 95, 208, 0.35)",
                zIndex: 2,
              }}
            />

            {/* Accent Headset / Sparkle element near Blue Circle */}
            <div
              style={{
                position: "absolute",
                bottom: "16%",
                right: "26%",
                zIndex: 4,
                transform: "rotate(-20deg)",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>

            {/* Decorative Floating Pill Badge top-right of phone */}
            <div
              style={{
                position: "absolute",
                top: "14%",
                right: "0%",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "10px 16px",
                borderRadius: "14px",
                boxShadow: "0 10px 25px rgba(11, 31, 75, 0.12)",
                border: "1px solid rgba(255, 107, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                zIndex: 6,
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                  boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.25)",
                }}
              />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 700, color: "#0B1F4B" }}>
                Live Jobs Stream
              </span>
            </div>

            {/* Decorative Rating / Placement pill bottom-left of phone */}
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                left: "4%",
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(10px)",
                padding: "12px 18px",
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(11, 31, 75, 0.14)",
                border: "1px solid #EEF2FA",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                zIndex: 6,
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#FFEBDD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF6B00",
                }}
              >
                ★
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 800, color: "#0B1F4B" }}>
                  4.9 / 5.0 Rating
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: "#6B7694", fontWeight: 500 }}>
                  By 15,000+ Students
                </div>
              </div>
            </div>

            {/* THE PHONE IMAGE: /section-5.png on RIGHT SIDE */}
            <div
              className="phone-right-mockup"
              style={{
                position: "relative",
                width: "330px",
                maxWidth: "100%",
                height: "640px",
                zIndex: 5,
                filter: "drop-shadow(0 28px 45px rgba(11, 31, 75, 0.22))",
              }}
            >
              <Image
                src="/section-5.png"
                alt="WeGrow Skill Campus Mobile App"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 280px, 330px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
