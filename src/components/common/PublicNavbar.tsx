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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#FFFFFF",
            padding: "16px 20px 22px",
            borderTop: "1px solid #EEF0F5",
            boxShadow: "0 16px 36px rgba(11,31,75,0.12)",
          }}
          className="md:hidden animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <nav className="flex flex-col space-y-1 mb-4">
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
                  style={{
                    padding: "10px 14px",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: isActive ? "#014E9C" : "#0B1F4B",
                    borderRadius: "8px",
                    background: isActive ? "#F0F6FF" : "transparent",
                    textDecoration: "none",
                  }}
                  className="flex items-center justify-between transition-colors hover:bg-slate-50"
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#014E9C]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <Link
              href="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-1.5 border-[#014E9C] text-[#014E9C] font-semibold text-xs text-center shadow-xs bg-white active:bg-blue-50"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </Link>
            <Link
              href="/hr/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F79400] text-white font-semibold text-xs text-center shadow-sm shadow-orange-500/25 active:bg-[#e08500]"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>HR Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
