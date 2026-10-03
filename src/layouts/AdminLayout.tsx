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

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If this is login page, do not render shell
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems: SidebarItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "HR Management", href: "/admin/hr-management", icon: Building2, badge: "2" },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Jobs Moderation", href: "/admin/jobs", icon: Briefcase },
    { label: "Applications", href: "/admin/applications", icon: FileCheck },
    { label: "Email Dispatcher", href: "/admin/email", icon: Mail },
    { label: "Platform Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: FileSpreadsheet },
  ];

  const handleLogout = () => {
    authService.logout();
    router.push("/admin/login");
  };

  return (
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
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white">
              4
            </span>
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
              onClick={handleLogout}
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
        {/* Left Sidebar (240px fixed, matching student layout) */}
        <aside
          className={`fixed lg:sticky top-[66px] left-0 z-30 h-[calc(100vh-66px)] w-[240px] bg-white border-r border-[#EEF1F7] flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-200 ease-in-out shrink-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 min-w-0 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
