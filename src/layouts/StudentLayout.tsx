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
import { getNameInitials, getAvatarUrl } from "@/lib/utils";

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
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollYRef = React.useRef(0);

  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

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
            // Scrolling DOWN -> Hide bottom nav
            setShowBottomNav(false);
          } else if (diff < -8) {
            // Scrolling UP -> Show bottom nav
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

  const getInitialProfile = React.useCallback(() => {
    if (typeof window !== "undefined") {
      const u = authService.getCurrentUser();
      if (u) {
        const student = (u as any).studentProfile;
        const savedAvatar =
          (u as any).avatarUrl ||
          (u as any).avatar ||
          student?.avatarUrl ||
          student?.avatar ||
          student?.photoUrl ||
          (u.id ? localStorage.getItem(`wegrow_student_avatar_${u.id}`) : null) ||
          localStorage.getItem("wegrow_student_avatar") ||
          (student?.id ? getAvatarUrl(student.id) : undefined);

        return {
          id: student?.id || u.id,
          name: student?.fullName || (u as any).fullName || u.name || "Student",
          headline: student?.branch || student?.college || (u as any).headline || "Candidate",
          avatarUrl: savedAvatar,
          avatar: savedAvatar,
          photoUrl: savedAvatar,
        };
      }
    }
    return {
      name: "Student",
      headline: "Candidate",
    };
  }, []);

  const [studentProfile, setStudentProfile] = useState<{
    id?: string;
    name: string;
    headline: string;
    avatarUrl?: string;
    avatar?: string;
    photoUrl?: string;
  }>(getInitialProfile);

  const { data: profileQuery } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => studentService.getProfile(),
    staleTime: 60_000,
    enabled: !isAuthPage && !isInsideShell,
  });

  const { data: unreadNotifCount = 0 } = useQuery({
    queryKey: ["student-unread-notifs"],
    queryFn: () => studentService.getUnreadCount(),
    staleTime: 30_000,
    enabled: !isAuthPage && !isInsideShell,
  });

  React.useEffect(() => {
    setNavImgError(false);
  }, [studentProfile.avatarUrl, studentProfile.avatar, studentProfile.photoUrl]);

  // Re-hydrate profile and invalidate query when navigating from login to dashboard
  React.useEffect(() => {
    if (!isAuthPage) {
      const local = getInitialProfile();
      if (local.id || local.avatarUrl) {
        setNavImgError(false);
        setStudentProfile((prev) => ({
          ...prev,
          ...local,
          avatarUrl: local.avatarUrl || prev.avatarUrl,
        }));
      }
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      queryClient.invalidateQueries({ queryKey: ["student-unread-notifs"] });
    }
  }, [pathname, isAuthPage, queryClient, getInitialProfile]);

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

  // 5 core native tabs for mobile APK bottom bar
  const bottomNavLinks = [
    { label: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "Applications", href: "/student/applications", icon: FileCheck },
    { label: "Interviews", href: "/student/interviews", icon: Calendar },
    { label: "Profile", href: "/student/profile", icon: User },
  ];

  const navAvatar = studentProfile.avatarUrl || studentProfile.avatar || studentProfile.photoUrl;

  return (
    <AuthGuard allowedRoles={["STUDENT"]} loginRoute="/student/login">
      <StudentShellContext.Provider value={true}>
      <div className="min-h-screen bg-[#F7F9FD] text-[#0B1F4B] font-['Poppins',sans-serif] flex flex-col selection:bg-[#1E5BE0] selection:text-white">
        {/* ============================================================== */}
        {/* 1. TOP APP BAR (Native Mobile App Header on mobile, desktop navbar on lg) */}
        {/* ============================================================== */}
        <header className="h-[52px] sm:h-[66px] bg-white/95 backdrop-blur-md border-b border-[#EEF1F7] sticky top-0 z-40 px-2.5 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
          {/* Left: Mobile Drawer Trigger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 w-auto lg:w-[240px] shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] active:scale-95 transition-all cursor-pointer focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/student/dashboard" className="inline-flex items-center gap-2" aria-label="WeGrow Skill Campus Home">
              <div className="relative w-28 sm:w-40 h-7 sm:h-10">
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

          {/* Right: Quick Notifications + Profile */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {/* Bell Icon with badge */}
            <Link
              href="/student/notifications"
              className="relative p-1.5 sm:p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#0B1F4B]" strokeWidth={1.75} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 bg-[#EF4444] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </Link>

            {/* User profile capsule with dropdown (desktop) and direct profile avatar tap (mobile) */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                className="flex items-center gap-1.5 sm:gap-3 pl-1 sm:pl-3 border-l border-[#EEF1F7] hover:opacity-90 transition cursor-pointer select-none py-0.5 sm:py-1 focus:outline-none active:scale-98"
              >
                <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
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
                  {/* Online indicator dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-[13px] sm:text-[14px] font-semibold text-[#0B1F4B] leading-snug truncate max-w-[140px]">
                    {studentProfile.name}
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-[#6B7694] leading-none truncate max-w-[140px]">
                    {studentProfile.headline}
                  </div>
                </div>
                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-[#6B7694] transition-transform duration-200 ${
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
                        {navAvatar && !navImgError ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={navAvatar}
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
                          Student Portal
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
        {/* 2. BODY LAYOUT: DESKTOP SIDEBAR + APK MOBILE DRAWER + CONTENT */}
        {/* ============================================================== */}
        <div className="flex flex-1 relative">
          {/* Mobile backdrop */}
          <div
            className={`fixed inset-0 bg-[#0B1F4B]/60 backdrop-blur-xs z-[90] lg:hidden transition-opacity duration-300 ease-in-out ${
              mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* ================= NATIVE APK MOBILE DRAWER + DESKTOP SIDEBAR ================= */}
          <aside
            style={{ backgroundColor: "#ffffff" }}
            className={`fixed lg:sticky top-0 lg:top-[66px] left-0 z-[100] lg:z-30 h-full lg:h-[calc(100vh-66px)] w-[82vw] max-w-[320px] lg:w-[240px] bg-white border-r border-[#EEF1F7] flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform shadow-2xl lg:shadow-none shrink-0 ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* ── APK MOBILE APP HEADER BANNER (Mobile Drawer Only) ── */}
            <div className="lg:hidden p-4 bg-gradient-to-br from-[#0B1F4B] to-[#1E5BE0] text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
                  Student APK
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card in Drawer */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/60 bg-white/20 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-md">
                  {navAvatar && !navImgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={navAvatar}
                      alt={studentProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getNameInitials(studentProfile.name)}</span>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-[15px] truncate leading-tight">
                    {studentProfile.name}
                  </h3>
                  <p className="text-blue-100 text-[12px] truncate mt-0.5 opacity-90">
                    {studentProfile.headline}
                  </p>
                  <Link
                    href="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-200 hover:text-white font-medium mt-1 transition-colors"
                  >
                    View profile <ChevronDown className="w-3 h-3 -rotate-90" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── DESKTOP BRAND HEADER ── */}
            <div className="hidden lg:flex items-center justify-between p-4 pb-2 border-b border-[#EEF1F7]/60">
              <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                Student Portal
              </span>
            </div>

            {/* Menu items list */}
            <div className="p-3 sm:p-4 flex-1">
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
                      className={`flex items-center justify-between px-3.5 h-[48px] lg:h-[50px] rounded-xl text-[14px] lg:text-[15px] font-medium transition-all ${
                        isActive
                          ? "bg-[#E3EEFF] text-[#1E5BE0] font-semibold border-l-4 border-[#1E5BE0] shadow-xs"
                          : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-transform ${
                            isActive ? "text-[#1E5BE0] scale-105" : "text-[#6B7694]"
                          }`}
                          strokeWidth={isActive ? 2.2 : 1.75}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-none shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom "Need Help?" card */}
              <div className="mt-5 pt-4 border-t border-[#EEF1F7]">
                <div className="bg-[#F1F6FF] rounded-2xl p-3.5 text-center border border-[#E3EEFF]">
                  <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto mb-2 text-[#1E5BE0]">
                    <Headphones className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <h4 className="font-bold text-[13px] text-[#0B1F4B]">Need Help?</h4>
                  <p className="text-[11px] text-[#6B7694] mt-0.5 leading-snug">
                    Placement assistance & support
                  </p>
                  <button
                    type="button"
                    className="mt-2.5 w-full border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white transition-colors text-[11px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer active:scale-98"
                  >
                    Contact Support →
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#EF4444] hover:bg-rose-50 py-2.5 rounded-xl transition-colors cursor-pointer active:scale-98"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Mobile Drawer Footer with App Info */}
            <div className="lg:hidden px-4 py-3 bg-[#F7F9FD] border-t border-[#EEF1F7] text-center">
              <p className="text-[10px] text-[#9BA5BB] font-medium">
                WeGrow Skill Campus • Android APK v2.4
              </p>
            </div>
          </aside>

          {/* ================= RIGHT SIDE CONTENT AREA (with clearance for bottom nav on mobile) ================= */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-52px)] sm:min-h-[calc(100vh-66px)] overflow-x-hidden pb-20 lg:pb-0">
            {children}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. NATIVE APK MOBILE BOTTOM NAVIGATION (Home, Jobs, Applications, Interviews, Profile) */}
        {/* ============================================================== */}
        <nav
          aria-label="Student Mobile App Navigation"
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EEF1F7] px-2 pt-1.5 shadow-[0_-8px_30px_rgba(11,31,75,0.08)] pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-in-out will-change-transform ${
            showBottomNav ? "translate-y-0" : "translate-y-[120%] pointer-events-none"
          }`}
        >
          <div className="grid grid-cols-5 max-w-md mx-auto items-center">
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
                  className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 group relative active:scale-90 ${
                    isActive
                      ? "text-[#1E5BE0]"
                      : "text-[#6B7694] hover:text-[#0B1F4B]"
                  }`}
                >
                  <div
                    className={`relative w-11 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#E3EEFF] text-[#1E5BE0] shadow-2xs"
                        : "group-hover:bg-[#F7F9FD]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? "scale-105" : ""
                      }`}
                      strokeWidth={isActive ? 2.3 : 1.75}
                    />
                    {/* Active pill dot */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#1E5BE0]" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 truncate max-w-full ${
                      isActive ? "font-bold text-[#1E5BE0]" : "font-medium text-[#6B7694]"
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
