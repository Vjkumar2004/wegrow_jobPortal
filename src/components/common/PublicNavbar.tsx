"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, Building2, Menu, X } from "lucide-react";

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Careers", href: "/#hero-search" },
    { label: "Top Recruiters", href: "/#companies-section" },
    { label: "Resources", href: "/resources" },
    { label: "Career Tips", href: "/career-tips" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: scrolled
          ? "0 8px 30px rgba(1, 78, 156, 0.10), 0 1px 3px rgba(0, 0, 0, 0.04)"
          : "0 1px 15px rgba(11, 31, 75, 0.04)",
        borderBottom: scrolled ? "1px solid rgba(1, 78, 156, 0.12)" : "1px solid rgba(226, 232, 240, 0.7)",
        height: scrolled ? "64px" : "74px",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 32px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Brand Logo with Image.png */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            lineHeight: 1,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            transition: "transform 0.25s ease",
            transform: scrolled ? "scale(0.96)" : "scale(1)",
          }}
          aria-label="WeGrow Skill Campus Home"
        >
          <div
            style={{
              position: "relative",
              width: scrolled ? "152px" : "168px",
              height: scrolled ? "44px" : "48px",
              transition: "all 0.3s ease",
            }}
          >
            <Image
              src="/image.png"
              alt="WeGrow Skill Campus"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }} className="hidden md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#014E9C" : "#0B1F4B",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  position: "relative",
                  padding: "4px 0",
                }}
                className="group hover:text-[#014E9C]"
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: 0,
                      width: "100%",
                      height: "2.5px",
                      background: "#014E9C",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Buttons: Student Login & HR Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }} className="hidden md:flex">
          <Link
            href="/student/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "#014E9C",
              background: "#FFFFFF",
              border: "1.5px solid #014E9C",
              borderRadius: "10px",
              padding: "8px 18px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            className="hover:bg-[#EEF4FD] hover:-translate-y-0.5 hover:shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>Student Login</span>
          </Link>

          <Link
            href="/hr/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "#FFFFFF",
              background: "#F79400",
              border: "1.5px solid #F79400",
              borderRadius: "10px",
              padding: "8px 18px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(247, 148, 0, 0.25)",
            }}
            className="hover:bg-[#e08500] hover:-translate-y-0.5 hover:shadow-md"
          >
            <Building2 className="w-4 h-4" />
            <span>HR Login</span>
          </Link>
        </div>

        {/* Hamburger Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#0B1F4B] hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#FFFFFF",
            padding: "16px 24px 22px",
            borderTop: "1px solid #EEF0F5",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          }}
          className="md:hidden"
        >
          <nav className="flex flex-col space-y-2 mb-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "9px 0",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: pathname === item.href ? "#014E9C" : "#0B1F4B",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-[#014E9C] text-[#014E9C] font-semibold text-sm"
            >
              Student Login
            </Link>
            <Link
              href="/hr/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-[#F79400] text-white font-semibold text-sm"
            >
              HR Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
