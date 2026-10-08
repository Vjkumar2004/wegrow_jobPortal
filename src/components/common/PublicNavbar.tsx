"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User, Building2, Menu, X } from "lucide-react";

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Smooth-scroll to a hash anchor; works both on homepage and when navigating from other pages
  const handleHashLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return; // not a hash link — let Next.js handle it normally

      const hash = href.slice(hashIndex + 1);
      const pagePath = href.slice(0, hashIndex) || "/";

      if (pathname === pagePath || pathname === "/") {
        // Already on the right page — just smooth-scroll
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Navigate to the page first; hash scroll happens via useEffect below
        e.preventDefault();
        router.push(href);
      }
    },
    [pathname, router]
  );

  // After navigation, scroll to hash if present in the URL
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // Small delay to let the page render
      const t = setTimeout(tryScroll, 120);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  const navLinks = [
    { label: "Home",           href: "/",               hash: null },
    { label: "Explore Careers", href: "/#hero-search",   hash: "hero-search" },
    { label: "Top Recruiters", href: "/#top-companies",  hash: "top-companies" },
    { label: "About Us",       href: "/about",           hash: null },
    { label: "Resources",      href: "/resources",       hash: null },
    { label: "Career Tips",    href: "/career-tips",     hash: null },
  ];

  // Active detection: only exact page routes get the underline (hash links never show as active)
  const isLinkActive = (href: string, hash: string | null) => {
    if (hash) return false; // anchor links never highlighted
    return pathname === href;
  };

  return (
    <>
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
        className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4 sm:gap-6"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-transform duration-200 hover:opacity-95 focus:outline-none"
          aria-label="WeGrow Skill Campus Home"
        >
          <div
            style={{
              position: "relative",
              width: scrolled ? "152px" : "168px",
              height: scrolled ? "42px" : "46px",
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

        {/* Center Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((item) => {
            const isActive = isLinkActive(item.href, item.hash);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => item.hash ? handleHashLink(e, item.href) : undefined}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#014E9C" : "#0B1F4B",
                  textDecoration: "none",
                  position: "relative",
                  padding: "6px 0",
                }}
                className="transition-colors duration-200 hover:text-[#014E9C]"
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
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/student/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "#014E9C",
              background: "#FFFFFF",
              border: "1.5px solid #014E9C",
              borderRadius: "10px",
              padding: "8px 18px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            className="hover:bg-[#EEF4FD] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span>Student Login</span>
          </Link>

          <Link
            href="/hr/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "#FFFFFF",
              background: "#F79400",
              border: "1.5px solid #F79400",
              borderRadius: "10px",
              padding: "8px 18px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(247, 148, 0, 0.25)",
            }}
            className="hover:bg-[#e08500] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <Building2 className="w-4 h-4" />
            <span>HR Login</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#0B1F4B] hover:bg-slate-100 transition-colors border border-slate-200/60"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF6B00]" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>

    {/* ============================================================== */}
    {/* MOBILE DRAWER: SMOOTH LEFT-TO-RIGHT SLIDE WITH BACKDROP (OUTSIDE HEADER) */}
    {/* ============================================================== */}
    {/* 1. Backdrop Overlay with smooth fade */}
    <div
      className={`fixed inset-0 bg-[#0B1F4B]/60 backdrop-blur-xs z-[99] md:hidden transition-opacity duration-300 ease-in-out ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* 2. Sliding Drawer Panel (100% solid white, viewport containing block) */}
    <aside
      style={{ backgroundColor: "#ffffff" }}
      className={`fixed top-0 left-0 bottom-0 z-[100] w-[290px] max-w-[85vw] bg-white shadow-2xl flex flex-col overflow-y-auto p-5 md:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Drawer Header: Logo + Close Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EEF1F7] shrink-0">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-block"
          aria-label="WeGrow Skill Campus Home"
        >
          <div className="relative w-36 h-9">
            <Image
              src="/image.png"
              alt="WeGrow Skill Campus"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="p-2 rounded-xl text-[#6B7694] hover:text-[#0B1F4B] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Navigation Links */}
      <nav className="flex flex-col space-y-1 mt-4">
        {navLinks.map((item) => {
          const isActive = isLinkActive(item.href, item.hash);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (item.hash) handleHashLink(e, item.href);
              }}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-[14px] transition-all cursor-pointer ${
                isActive
                  ? "bg-[#E3EEFF] text-[#1E5BE0] font-semibold"
                  : "text-[#0B1F4B] hover:bg-[#F7F9FD] hover:text-[#1E5BE0]"
              }`}
            >
              <span>{item.label}</span>
              {isActive && <span className="w-2 h-2 rounded-full bg-[#1E5BE0]" />}
            </Link>
          );
        })}
      </nav>

      {/* Drawer Action Buttons: Student Login & HR Login placed comfortably right below nav links */}
      <div className="pt-4 mt-4 border-t border-[#EEF1F7] space-y-2.5">
        <Link
          href="/student/login"
          onClick={() => setMobileMenuOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-[1.5px] border-[#014E9C] text-[#014E9C] font-semibold text-[13px] hover:bg-blue-50 transition-colors shadow-2xs"
        >
          <User className="w-4 h-4" />
          <span>Student Portal Login</span>
        </Link>

        <Link
          href="/hr/login"
          onClick={() => setMobileMenuOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F79400] text-white font-semibold text-[13px] hover:bg-[#e08500] transition-colors shadow-md shadow-orange-500/20"
        >
          <Building2 className="w-4 h-4" />
          <span>Recruiter / HR Login</span>
        </Link>
      </div>
    </aside>
  </>
  );
};

export default PublicNavbar;
