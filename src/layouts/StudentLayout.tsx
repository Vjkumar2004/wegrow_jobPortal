"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Headphones,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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

  const { data: profileQuery } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => studentService.getProfile(),
    staleTime: 60_000,
  });

  const { data: unreadNotifCount = 0 } = useQuery({
    queryKey: ["student-unread-notifs"],
    queryFn: () => studentService.getUnreadCount(),
    staleTime: 30_000,
  });

  React.useEffect(() => {
    setNavImgError(false);
  }, [studentProfile.avatarUrl, studentProfile.avatar, studentProfile.photoUrl]);

  React.useEffect(() => {
    if (profileQuery) {
      const url = profileQuery.avatarUrl || profileQuery.avatar || profileQuery.photoUrl;
      setStudentProfile({
        id: profileQuery.id,
        name: profileQuery.name || "Student",
        headline: profileQuery.degreeName || profileQuery.headline || "Candidate",
        avatarUrl: url,
        avatar: url,
        photoUrl: url,
      });
    }
  }, [profileQuery]);

  React.useEffect(() => {
    const handleNotifUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["student-unread-notifs"] });
    };
    window.addEventListener("notificationsUpdated", handleNotifUpdate);
    return () => window.removeEventListener("notificationsUpdated", handleNotifUpdate);
  }, [queryClient]);

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
        queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      }
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, [queryClient]);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

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
    { label: "Notifications", href: "/student/notifications", icon: Bell, badge: unreadNotifCount > 0 ? (unreadNotifCount > 99 ? "99+" : String(unreadNotifCount)) : undefined },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  const bottomNavLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "My Applications", href: "/student/applications", icon: FileCheck },
    { label: "Profile", href: "/student/profile", icon: User },
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

        {/* Right: Notification, Profile, Chevron */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Bell Icon */}
          <Link
            href="/student/notifications"
            className="relative p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] transition flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#0B1F4B]" strokeWidth={1.75} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
              </span>
            )}
          </Link>

          {/* User profile capsule with dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
              className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3 border-l border-[#EEF1F7] hover:opacity-90 transition cursor-pointer select-none py-1 focus:outline-none"
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
                            ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${studentProfile.id}`
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
                <div className="text-[14px] font-semibold text-[#0B1F4B] leading-snug truncate max-w-[150px]">
                  {studentProfile.name}
                </div>
                <div className="text-[12px] text-[#6B7694] leading-none truncate max-w-[150px]">
                  {studentProfile.headline}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7694] transition-transform duration-200 ${
                  profileDropdownOpen ? "rotate-180 text-[#1E5BE0]" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EEF1F7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ filter: "drop-shadow(0 10px 25px rgba(11, 31, 75, 0.08))" }}
              >
                {/* Header info */}
                <div className="px-4 py-3 border-b border-[#EEF1F7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {studentProfile.avatarUrl && !navImgError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={studentProfile.avatarUrl}
                          alt={studentProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getNameInitials(studentProfile.name)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0B1F4B] truncate leading-tight">
                        {studentProfile.name}
                      </p>
                      <p className="text-xs text-[#6B7694] truncate mt-0.5">
                        {studentProfile.headline}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2 py-0.5 rounded-full">
                        Student Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Navigation Links */}
                <div className="py-1 px-1">
                  <Link
                    href="/student/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#0B1F4B] hover:bg-[#F7F9FD] hover:text-[#1E5BE0] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#6B7694]" strokeWidth={1.75} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/student/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#0B1F4B] hover:bg-[#F7F9FD] hover:text-[#1E5BE0] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#6B7694]" strokeWidth={1.75} />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* Logout Divider & Action */}
                <div className="pt-1 mt-1 border-t border-[#EEF1F7] px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" strokeWidth={1.75} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY LAYOUT: FIXED STICKY SIDEBAR + DYNAMIC RIGHT CONTENT */}
      {/* ============================================================== */}
      <div className="flex flex-1 relative">
        {/* Mobile backdrop with smooth fade animation */}
        <div
          className={`fixed inset-0 bg-[#0B1F4B]/60 backdrop-blur-xs z-[90] lg:hidden transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* ================= LEFT SIDEBAR (smooth left-to-right slide drawer, 100% solid white) ================= */}
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
        <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-66px)] overflow-x-hidden pb-18 lg:pb-0">
          {children}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Dashboard, Browse Jobs, My Applications, Profile) */}
      {/* ============================================================== */}
      <nav
        aria-label="Student Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEF1F7] px-2 py-1 shadow-[0_-4px_20px_rgba(11,31,75,0.06)] pb-[max(0.35rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-4 max-w-lg mx-auto items-center">
          {bottomNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/student/dashboard"
                ? pathname === "/student/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "text-[#1E5BE0]"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
              >
                <div
                  className={`relative w-10 h-7 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-[#E3EEFF] text-[#1E5BE0]"
                      : "group-hover:bg-[#F7F9FD]"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 transition-transform duration-200 group-active:scale-95"
                    strokeWidth={isActive ? 2.2 : 1.75}
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#1E5BE0]" />
                  )}
                </div>
                <span
                  className={`text-[11px] mt-0.5 tracking-tight transition-all duration-200 truncate max-w-full ${
                    isActive ? "font-bold text-[#1E5BE0]" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </StudentShellContext.Provider>
    </AuthGuard>
  );
};
