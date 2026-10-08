"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  Calendar,
  Bookmark,
  User,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  Headphones,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { studentService } from "@/services/student.service";
import { getNameInitials } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

const StudentShellContext = React.createContext<boolean>(false);

import { AuthGuard } from "@/components/common/AuthGuard";

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInsideShell = React.useContext(StudentShellContext);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navImgError, setNavImgError] = useState(false);
  const [studentProfile, setStudentProfile] = useState<{
    id?: string;
    name: string;
    headline: string;
    avatarUrl?: string;
    avatar?: string;
    photoUrl?: string;
  }>({
    name: "Student",
    headline: "Candidate",
  });

  React.useEffect(() => {
    setNavImgError(false);
  }, [studentProfile.avatarUrl, studentProfile.avatar, studentProfile.photoUrl]);

  React.useEffect(() => {
    studentService
      .getProfile()
      .then((p) => {
        if (p) {
          const url = p.avatarUrl || p.avatar || p.photoUrl;
          setStudentProfile({
            id: p.id,
            name: p.name || "Student",
            headline: p.degreeName || p.headline || "Candidate",
            avatarUrl: url,
            avatar: url,
            photoUrl: url,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  React.useEffect(() => {
    const handleAvatarUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ avatarUrl?: string; avatar?: string; photoUrl?: string }>).detail;
      const newUrl = detail?.avatarUrl || detail?.avatar || detail?.photoUrl;
      if (newUrl) {
        setNavImgError(false);
        setStudentProfile((prev) => ({
          ...prev,
          avatarUrl: newUrl,
          avatar: newUrl,
          photoUrl: newUrl,
        }));
      }
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  // If already inside the student shell, only render children (prevents nested double sidebars)
  if (isInsideShell) {
    return <>{children}</>;
  }

  // If this is login or register page, do not render student app shell
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/student/login");
  };

  const sidebarLinks: SidebarItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "My Applications", href: "/student/applications", icon: FileCheck },
    { label: "Interviews", href: "/student/interviews", icon: Calendar },
    { label: "Saved Jobs", href: "/student/saved-jobs", icon: Bookmark },
    { label: "Profile", href: "/student/profile", icon: User },
    { label: "Resume", href: "/student/resume", icon: FileText },
    { label: "Reports", href: "/student/reports", icon: BarChart3 },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  return (
    <AuthGuard allowedRoles={["STUDENT"]} loginRoute="/student/login">
      <StudentShellContext.Provider value={true}>
      <div className="min-h-screen bg-[#F7F9FD] text-[#0B1F4B] font-['Poppins',sans-serif] flex flex-col">
        {/* ============================================================== */}
        {/* 1. TOP BAR (~66px height, white, bottom border, sticky top) */}
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

          <Link href="/" className="inline-block" aria-label="WeGrow Skill Campus Home">
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

        {/* Center: Wide search input (~560px, #F1F4F9, 12px radius) */}
        <div className="hidden md:flex flex-1 max-w-[560px] mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6B7694] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              className="w-full bg-[#F1F4F9] text-sm text-[#0B1F4B] placeholder-[#6B7694] pl-11 pr-4 py-2.5 rounded-[12px] border-none focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Notification, Profile, Chevron */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Bell Icon */}
          <Link
            href="/student/notifications"
            className="relative p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#0B1F4B]" strokeWidth={1.75} />
          </Link>

          {/* User profile capsule */}
          <Link
            href="/student/profile"
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#EEF1F7] hover:opacity-90 transition"
          >
            {(() => {
              const navAvatar = studentProfile.avatarUrl || studentProfile.avatar || studentProfile.photoUrl;
              return (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                  {navAvatar && !navImgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={navAvatar}
                      alt={studentProfile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const fallbackUrl = studentProfile.id
                          ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"}/media/avatar/${studentProfile.id}`
                          : "";
                        if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                          e.currentTarget.src = fallbackUrl;
                          return;
                        }
                        setNavImgError(true);
                      }}
                    />
                  ) : (
                    <span>{getNameInitials(studentProfile.name)}</span>
                  )}
                </div>
              );
            })()}
            <div className="hidden sm:block text-left">
              <div className="text-[14px] font-semibold text-[#0B1F4B] leading-snug">
                {studentProfile.name}
              </div>
              <div className="text-[12px] text-[#6B7694] leading-none truncate max-w-[150px]">
                {studentProfile.headline}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6B7694] cursor-pointer" />
          </Link>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY LAYOUT: FIXED STICKY SIDEBAR + DYNAMIC RIGHT CONTENT */}
      {/* ============================================================== */}
      <div className="flex flex-1 relative">
        {/* ================= LEFT SIDEBAR (240px fixed, sticky) ================= */}
        <aside
          className={`fixed lg:sticky top-[66px] left-0 z-30 h-[calc(100vh-66px)] w-[240px] bg-white border-r border-[#EEF1F7] flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-200 ease-in-out shrink-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Menu items (icon + label, Poppins 500, 15px, 52px row height) */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/student/dashboard"
                  ? pathname === "/student/dashboard"
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

          {/* Bottom "Need Help?" card */}
          <div className="mt-6 pt-4 border-t border-[#EEF1F7]">
            <div className="bg-[#F1F6FF] rounded-[14px] p-4 text-center border border-[#E3EEFF]">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-[#1E5BE0]">
                <Headphones className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h4 className="font-bold text-[14px] text-[#0B1F4B]">Need Help?</h4>
              <p className="text-[12px] text-[#6B7694] mt-0.5 leading-snug">
                Have questions? We&apos;re here to help.
              </p>
              <button
                type="button"
                className="mt-3 w-full border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white transition-colors text-[12px] font-semibold py-2 px-3 rounded-[8px] cursor-pointer"
              >
                Contact Support →
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#EF4444] hover:bg-rose-50 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ================= RIGHT SIDE CONTENT AREA (Only this part updates/scrolls) ================= */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-66px)] overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
    </StudentShellContext.Provider>
    </AuthGuard>
  );
};
