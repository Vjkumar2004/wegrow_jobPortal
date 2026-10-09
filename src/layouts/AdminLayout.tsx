"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Briefcase,
  FileCheck,
  Mail,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Settings,
  HelpCircle,
} from "lucide-react";
import { authService } from "@/services/auth.service";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

import { AuthGuard } from "@/components/common/AuthGuard";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollYRef = React.useRef(0);

  // Auto-hide bottom navbar on scroll down, show on scroll up (native app pattern)
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const prevScrollY = lastScrollYRef.current;
          const diff = currentScrollY - prevScrollY;

          // Always visible at the top of the page
          if (currentScrollY <= 20) {
            setShowBottomNav(true);
          } else if (diff > 8) {
            setShowBottomNav(false);
          } else if (diff < -8) {
            setShowBottomNav(true);
          }

          lastScrollYRef.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setShowBottomNav(true);
  }, [pathname]);

  const menuItems: SidebarItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "HR Management", href: "/admin/hr-management", icon: Building2 },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Jobs Moderation", href: "/admin/jobs", icon: Briefcase },
    { label: "Applications", href: "/admin/applications", icon: FileCheck },
    { label: "Email Dispatcher", href: "/admin/email", icon: Mail },
    { label: "Platform Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: FileSpreadsheet },
  ];

  const handleLogout = async (reason?: string) => {
    await authService.logout();
    if (reason) {
      router.replace(`/admin/login?reason=${reason}`);
    } else {
      router.replace("/admin/login");
    }
  };

  // 10 MINUTES INACTIVITY (IDLE) AUTO-LOGOUT
  // ==============================================================
  React.useEffect(() => {
    // If login page, do not track idle timeout
    if (pathname === "/admin/login") return;

    const IDLE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
    let timeoutId: NodeJS.Timeout;
    let lastActivityTime = Date.now();

    const startIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.warn("[AdminLayout] 10 minutes idle timeout reached. Auto logging out...");
        handleLogout("idle_timeout");
      }, IDLE_LIMIT_MS);
    };

    // User activity handler with throttle (runs at most once every 3 seconds to save CPU)
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > 3000) {
        lastActivityTime = now;
        startIdleTimer();
      }
    };

    // User interaction events to detect active usage
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Start timer on mount
    startIdleTimer();

    // Attach listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If this is login page, do not render shell
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard allowedRoles={["ADMIN"]} loginRoute="/admin/login">
      <div className="min-h-screen bg-[#F7F9FD] text-[#0B1F4B] font-['Poppins',sans-serif] flex flex-col">
      {/* ============================================================== */}
      {/* 1. TOP BAR (~66px height, white, sticky top, matching Student layout) */}
      {/* ============================================================== */}
      <header className="h-[66px] bg-white border-b border-[#EEF1F7] sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Logo within sidebar width ~240px */}
        <div className="flex items-center gap-3 w-auto lg:w-[240px] shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0B1F4B] hover:bg-[#F1F4F9]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="inline-block" aria-label="WeGrow Admin Control">
            <div className="relative w-36 sm:w-40 h-10">
              <Image
                src="/image.png"
                alt="WeGrow Skill Campus"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex flex-1 max-w-[560px] mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6B7694] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search companies, students, jobs, audit logs..."
              className="w-full bg-[#F1F4F9] text-sm text-[#0B1F4B] placeholder-[#6B7694] pl-11 pr-4 py-2.5 rounded-[12px] border-none focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Badge, Notification, Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Super Admin Pill Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0756A8] text-xs font-bold border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0756A8]" />
            <span>Super Admin</span>
          </div>

          {/* Audit Notification Icon */}
          <Link
            href="/admin/audit-logs"
            className="relative p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] transition"
            aria-label="Audit Notifications"
            title="Recent Audit Logs"
          >
            <Bell className="w-5 h-5 text-[#0B1F4B]" strokeWidth={1.75} />
          </Link>

          {/* Admin profile capsule */}
          <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#EEF1F7]">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#0756A8] to-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[14px] font-semibold text-[#0B1F4B] leading-snug">
                Super Admin
              </div>
              <div className="text-[12px] text-[#6B7694] leading-none">
                admin@wegrowcampus.com
              </div>
            </div>
            <button
              onClick={() => handleLogout()}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY LAYOUT: FIXED STICKY SIDEBAR + DYNAMIC CONTENT */}
      {/* ============================================================== */}
      <div className="flex flex-1 relative">
        {/* Mobile Backdrop Overlay with smooth fade animation */}
        <div
          className={`fixed inset-0 bg-[#0B1F4B]/60 backdrop-blur-xs z-[90] lg:hidden transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Left Sidebar (smooth left-to-right slide drawer, 100% solid white) */}
        <aside
          style={{ backgroundColor: "#ffffff" }}
          className={`fixed lg:sticky top-0 lg:top-[66px] left-0 z-[100] lg:z-30 h-full lg:h-[calc(100vh-66px)] w-[270px] sm:w-[240px] bg-white border-r border-[#EEF1F7] flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform shadow-2xl lg:shadow-none shrink-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile Drawer Header with Logo & Close Button (hidden on desktop) */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-[#EEF1F7] lg:hidden">
            <div className="relative w-32 h-8">
              <Image
                src="/image.png"
                alt="WeGrow Skill Campus"
                fill
                className="object-contain object-left"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-[#6B7694] hover:text-[#0B1F4B] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 h-[52px] rounded-[10px] text-[15px] font-medium transition-all ${
                    isActive
                      ? "bg-[#E3EEFF] text-[#1E5BE0] font-semibold border-l-4 border-[#1E5BE0]"
                      : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-[#1E5BE0]" : "text-[#6B7694]"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Security / System Status Card */}
          <div className="mt-6 pt-4 border-t border-[#EEF1F7] space-y-3">
            <div className="bg-[#F1F6FF] rounded-[14px] p-4 text-center border border-[#E3EEFF]">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-[#0756A8]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-[14px] text-[#0B1F4B]">Platform Shield</h4>
              <p className="text-[11px] text-[#6B7694] mt-1 leading-snug">
                All services operational with 99.9% uptime.
              </p>
              <Link
                href="/admin/audit-logs"
                className="mt-3 inline-block bg-[#0756A8] hover:bg-[#06468a] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Audit Trails
              </Link>
            </div>

            <button
              onClick={() => handleLogout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-66px)] overflow-x-hidden">
          <main className="flex-1 min-w-0 w-full pb-20 lg:pb-0">{children}</main>
        </div>

        {/* ============================================================== */}
        {/* 3. NATIVE MOBILE APP BOTTOM NAVIGATION BAR                     */}
        {/* ============================================================== */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEF1F7] px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(11,31,75,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showBottomNav ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Companies", href: "/admin/hr-management", icon: Building2 },
            { label: "Students", href: "/admin/students", icon: GraduationCap },
            { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? "text-[#1E5BE0]" : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? "bg-[#E3EEFF]" : "bg-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? "font-bold text-[#1E5BE0]" : ""}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* More / Menu Button to open drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#6B7694] hover:text-[#0B1F4B] transition-all cursor-pointer"
          >
            <div className="p-1 rounded-xl bg-transparent">
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Menu</span>
          </button>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};
export default AdminLayout;
