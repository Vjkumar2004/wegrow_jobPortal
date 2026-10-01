"use client";

import React from "react";
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
} from "lucide-react";

export const Footer: React.FC = () => {
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
            {/* Logo in White Pill Card for High Contrast */}
            <Link href="/" className="inline-block" aria-label="WeGrow Skill Campus Home">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl inline-flex items-center shadow-md shadow-black/10 transition-transform duration-200 hover:scale-[1.02]">
                <div className="relative w-40 sm:w-44 h-11">
                  <Image
                    src="/image.png"
                    alt="WeGrow Skill Campus"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
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
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow LinkedIn profile"
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
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Instagram profile"
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
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow YouTube channel"
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
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeGrow Facebook page"
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
                  href="/#hero-search"
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
            </ul>
          </nav>

          {/* ──────────────────────────────────────────────────
              COLUMN 3: OUR SERVICES (2-3 Cols on desktop)
          ────────────────────────────────────────────────── */}
          <nav aria-label="Our Services" className="lg:col-span-2 space-y-4">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-orange-300"
            >
              Our Services
            </h3>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li className="hover:text-[#F79400] transition-colors duration-200 cursor-pointer">
                Skill Development
              </li>
              <li className="hover:text-[#F79400] transition-colors duration-200 cursor-pointer">
                Career Counseling
              </li>
              <li className="hover:text-[#F79400] transition-colors duration-200 cursor-pointer">
                Direct Placement
              </li>
              <li className="hover:text-[#F79400] transition-colors duration-200 cursor-pointer">
                Expert Mentorship
              </li>
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
                  href="mailto:enquiry@wegrowcampus.in"
                  className="text-blue-100/90 hover:text-[#F79400] font-medium transition-colors duration-200 break-all"
                  aria-label="Send email to enquiry@wegrowcampus.in"
                >
                  enquiry@wegrowcampus.in
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
    </footer>
  );
};

export default Footer;
