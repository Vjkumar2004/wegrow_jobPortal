"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Calendar,
  Building,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Headphones,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { hrService } from "@/services/hr.service";
import { getHRAvatarUrl } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

const HRShellContext = React.createContext<boolean>(false);

import { AuthGuard } from "@/components/common/AuthGuard";

export const HRLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInsideShell = React.useContext(HRShellContext);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hrUserId, setHrUserId] = useState<string>("");
  const [hrUserName, setHrUserName] = useState("");
  const [hrCompanyName, setHrCompanyName] = useState("");
  const [hrCompanyLogoUrl, setHrCompanyLogoUrl] = useState<string | null>(null);
  const [hrAvatarUrl, setHrAvatarUrl] = useState<string | null>(null);
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

  const { data: compProfile } = useQuery({
    queryKey: ["hr-company"],
    queryFn: () => hrService.getCompanyProfile(),
    staleTime: 60_000,
    enabled: !isInsideShell,
  });

  React.useEffect(() => {
    if (isInsideShell) return;

    const localUser = authService.getCurrentUser();
    if (localUser) {
      if (localUser.id) setHrUserId(localUser.id);
      const name = localUser.name || localUser.fullName || (localUser as any).hrProfile?.fullName || "Recruiter";
      setHrUserName(name);
      const company = (localUser as any).hrProfile?.company;
      if (company?.name) setHrCompanyName(company.name);
      if (company?.logoUrl) setHrCompanyLogoUrl(company.logoUrl);

      const avatar =
        (localUser as any).avatarUrl ||
        (localUser as any).avatar ||
        (localUser as any).hrProfile?.avatarUrl ||
        (localUser as any).hrProfile?.avatar ||
        (typeof window !== "undefined"
          ? localStorage.getItem(`wegrow_hr_avatar_${localUser.id}`) || localStorage.getItem("wegrow_hr_avatar")
          : null);
      if (avatar) setHrAvatarUrl(avatar);
    }

    // Always fetch fresh profile on mount to hydrate cross-browser sessions
    authService.getMe().then((res) => {
      const user = res?.data?.user;
      if (user) {
        if (user.id) setHrUserId(user.id);
        const name = user.name || user.fullName || (user as any).hrProfile?.fullName;
        if (name) setHrUserName(name);
        const company = (user as any).hrProfile?.company;
        if (company?.name) setHrCompanyName(company.name);
        if (company?.logoUrl) setHrCompanyLogoUrl(company.logoUrl);
        const avatar =
          (user as any).avatarUrl ||
          (user as any).avatar ||
          (user as any).hrProfile?.avatarUrl ||
          (user as any).hrProfile?.avatar;
        if (avatar) {
          setHrAvatarUrl(avatar);
        } else if (user.id) {
          setHrAvatarUrl(getHRAvatarUrl(user.id));
        }
      }
    }).catch(() => {});

    const onAvatarUpdate = (e: any) => {
      const newAvatar = e.detail?.avatarUrl ?? null;
      setHrAvatarUrl(newAvatar);
    };

    window.addEventListener("hr-avatar-updated", onAvatarUpdate);
    return () => {
      window.removeEventListener("hr-avatar-updated", onAvatarUpdate);
    };
  }, [isInsideShell]);

  React.useEffect(() => {
    if (compProfile?.name) setHrCompanyName(compProfile.name);
    if (compProfile?.logoUrl) setHrCompanyLogoUrl(compProfile.logoUrl);
  }, [compProfile]);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If already inside the shell, only render children
  if (isInsideShell) {
    return <>{children}</>;
  }

  // If this is login or register page, do not render recruiter app shell
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/hr/login");
  };

  const sidebarLinks: SidebarItem[] = [
    { label: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
    { label: "My Jobs", href: "/hr/jobs", icon: Briefcase },
    { label: "Post New Job", href: "/hr/dashboard?action=post-job", icon: PlusCircle },
    { label: "Applicants", href: "/hr/applicants", icon: Users },
    { label: "Interviews", href: "/hr/interviews", icon: Calendar },
    { label: "Company Profile", href: "/hr/dashboard?tab=company", icon: Building },
    { label: "Reports & Analytics", href: "/hr/reports", icon: BarChart3 },
  ];

  // 5 core native tabs for recruiter mobile APK dock
  const bottomNavLinks = [
    { label: "Home", href: "/hr/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/hr/jobs", icon: Briefcase },
    { label: "Post Job", href: "/hr/dashboard?action=post-job", icon: PlusCircle, isAction: true },
    { label: "Candidates", href: "/hr/applicants", icon: Users },
    { label: "Interviews", href: "/hr/interviews", icon: Calendar },
  ];

  return (
    <AuthGuard allowedRoles={["HR"]} loginRoute="/hr/login">
      <HRShellContext.Provider value={true}>
        <div className="min-h-screen bg-[#F7F9FD] text-[#0B1F4B] font-['Poppins',sans-serif] flex flex-col selection:bg-[#FF6B00] selection:text-white">
          {/* ============================================================== */}
          {/* 1. TOP APP BAR (Native Mobile App Header on mobile, desktop navbar on lg) */}
          {/* ============================================================== */}
          <header className="h-[52px] sm:h-[66px] bg-white/95 backdrop-blur-md border-b border-[#EEF1F7] sticky top-0 z-40 px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 shadow-2xs">
            {/* Left: Mobile Drawer Trigger + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 w-auto lg:w-[240px] shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] active:scale-95 transition-all cursor-pointer focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/hr/dashboard" className="inline-flex items-center gap-2" aria-label="WeGrow Skill Campus Home">
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

            {/* Right: Recruiter Badge, Notification, Profile Capsule */}
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#FF6B00] text-[11px] font-bold tracking-wide uppercase border border-[#FFE0CC]">
                Recruiter Portal
              </span>

              {/* Quick Post Job button on mobile header */}
              <button
                type="button"
                onClick={() => {
                  if (pathname === "/hr/dashboard") {
                    window.dispatchEvent(new CustomEvent("open-post-job"));
                  } else {
                    router.push("/hr/dashboard?action=post-job");
                  }
                }}
                className="lg:hidden flex items-center gap-1 bg-[#FF6B00] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg active:scale-95 transition-all shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>

              {/* Bell Icon */}
              <div className="relative p-1.5 sm:p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] active:scale-95 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#0B1F4B]" strokeWidth={1.75} />
              </div>

              {/* Recruiter profile capsule */}
              <Link
                href="/hr/company"
                className="flex items-center gap-1.5 sm:gap-3 pl-1 sm:pl-3 border-l border-[#EEF1F7] hover:opacity-90 active:scale-98 transition select-none"
              >
                <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
                  {hrAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hrAvatarUrl}
                      alt={hrUserName || "Recruiter"}
                      className="w-full h-full object-cover"
                      onError={() => {
                        if (hrUserId && hrAvatarUrl !== getHRAvatarUrl(hrUserId)) {
                          setHrAvatarUrl(getHRAvatarUrl(hrUserId));
                        } else {
                          setHrAvatarUrl(null);
                        }
                      }}
                    />
                  ) : hrCompanyLogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hrCompanyLogoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                      onError={() => setHrCompanyLogoUrl(null)}
                    />
                  ) : (
                    hrUserName ? hrUserName.slice(0, 2).toUpperCase() : "HR"
                  )}
                  {/* Online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[13px] sm:text-[14px] font-semibold text-[#0B1F4B] leading-snug truncate max-w-[140px]">
                    {hrUserName || "Recruiter"}
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-[#6B7694] leading-none truncate max-w-[140px]">
                    {hrCompanyName || "WeGrow Partner"}
                  </div>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-[#6B7694] cursor-pointer" />
              </Link>
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
              <div className="lg:hidden p-4 bg-gradient-to-br from-[#0B1F4B] via-[#0E2963] to-[#FF6B00] text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-200 bg-white/10 px-2 py-0.5 rounded-full">
                    Recruiter APK
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
                    {hrAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={hrAvatarUrl}
                        alt={hrUserName || "Recruiter"}
                        className="w-full h-full object-cover"
                        onError={() => {
                          if (hrUserId && hrAvatarUrl !== getHRAvatarUrl(hrUserId)) {
                            setHrAvatarUrl(getHRAvatarUrl(hrUserId));
                          } else {
                            setHrAvatarUrl(null);
                          }
                        }}
                      />
                    ) : hrCompanyLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={hrCompanyLogoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                        onError={() => setHrCompanyLogoUrl(null)}
                      />
                    ) : (
                      hrUserName ? hrUserName.slice(0, 2).toUpperCase() : "HR"
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-[15px] truncate leading-tight">
                      {hrUserName || "Recruiter"}
                    </h3>
                    <p className="text-amber-100 text-[12px] truncate mt-0.5 opacity-90">
                      {hrCompanyName || "WeGrow Partner"}
                    </p>
                    <Link
                      href="/hr/company"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-200 hover:text-white font-medium mt-1 transition-colors"
                    >
                      Company profile <ChevronDown className="w-3 h-3 -rotate-90" />
                    </Link>
                  </div>
                </div>

                {/* Quick Post Job Button inside Mobile Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (pathname === "/hr/dashboard") {
                      window.dispatchEvent(new CustomEvent("open-post-job"));
                    } else {
                      router.push("/hr/dashboard?action=post-job");
                    }
                  }}
                  className="mt-3.5 w-full bg-white text-[#FF6B00] hover:bg-amber-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Post New Job Opening</span>
                </button>
              </div>

              {/* ── DESKTOP BRAND HEADER ── */}
              <div className="hidden lg:flex items-center justify-between p-4 pb-2 border-b border-[#EEF1F7]/60">
                <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                  Recruiter Menu
                </span>
              </div>

              {/* Menu items list */}
              <div className="p-3 sm:p-4 flex-1">
                <nav className="space-y-1">
                  {sidebarLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/hr/dashboard"
                        ? pathname === "/hr/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          if (item.label === "Post New Job") {
                            if (pathname === "/hr/dashboard") {
                              e.preventDefault();
                              window.dispatchEvent(new CustomEvent("open-post-job"));
                            }
                          }
                          if (item.label === "Company Profile") {
                            if (pathname === "/hr/dashboard") {
                              e.preventDefault();
                              window.dispatchEvent(new CustomEvent("open-company-profile"));
                            }
                          }
                        }}
                        className={`flex items-center justify-between px-3.5 h-[48px] lg:h-[50px] rounded-xl text-[14px] lg:text-[15px] font-medium transition-all ${
                          isActive
                            ? "bg-[#FFF0E6] text-[#FF6B00] font-semibold border-l-4 border-[#FF6B00] shadow-xs"
                            : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 shrink-0 transition-transform ${
                              isActive ? "text-[#FF6B00] scale-105" : "text-[#6B7694]"
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

                {/* Bottom "Need Support?" card */}
                <div className="mt-5 pt-4 border-t border-[#EEF1F7]">
                  <div className="bg-[#FFF0E6]/50 rounded-2xl p-3.5 text-center border border-[#FFE0CC]">
                    <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto mb-2 text-[#FF6B00]">
                      <Headphones className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <h4 className="font-bold text-[13px] text-[#0B1F4B]">Campus Hiring Desk</h4>
                    <p className="text-[11px] text-[#6B7694] mt-0.5 leading-snug">
                      Customized drive assistance
                    </p>
                    <button
                      type="button"
                      className="mt-2.5 w-full border-[1.5px] border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-colors text-[11px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer active:scale-98"
                    >
                      Contact Desk →
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
                  WeGrow Recruiter • Android APK v2.4
                </p>
              </div>
            </aside>

            {/* ================= RIGHT SIDE CONTENT AREA (with clearance for bottom nav on mobile) ================= */}
            <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-52px)] sm:min-h-[calc(100vh-66px)] overflow-x-hidden pb-20 lg:pb-0">
              {children}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. NATIVE APK MOBILE BOTTOM NAVIGATION (Home, Jobs, +Post, Candidates, Interviews) */}
          {/* ============================================================== */}
          <nav
            aria-label="Recruiter Mobile App Navigation"
            className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EEF1F7] px-2 pt-1.5 shadow-[0_-8px_30px_rgba(11,31,75,0.08)] pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-in-out will-change-transform ${
              showBottomNav ? "translate-y-0" : "translate-y-[120%] pointer-events-none"
            }`}
          >
            <div className="grid grid-cols-5 max-w-md mx-auto items-center">
              {bottomNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/hr/dashboard"
                    ? pathname === "/hr/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (item.isAction) {
                        if (pathname === "/hr/dashboard") {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("open-post-job"));
                        }
                      }
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 group relative active:scale-90 ${
                      item.isAction
                        ? "text-[#FF6B00]"
                        : isActive
                        ? "text-[#FF6B00]"
                        : "text-[#6B7694] hover:text-[#0B1F4B]"
                    }`}
                  >
                    <div
                      className={`relative w-11 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                        item.isAction
                          ? "bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white shadow-sm shadow-[#FF6B00]/30"
                          : isActive
                          ? "bg-[#FFF0E6] text-[#FF6B00] shadow-2xs"
                          : "group-hover:bg-[#F7F9FD]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isActive && !item.isAction ? "scale-105" : ""
                        }`}
                        strokeWidth={item.isAction ? 2.5 : isActive ? 2.3 : 1.75}
                      />
                      {/* Active pill dot */}
                      {isActive && !item.isAction && (
                        <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 truncate max-w-full ${
                        item.isAction
                          ? "font-bold text-[#FF6B00]"
                          : isActive
                          ? "font-bold text-[#FF6B00]"
                          : "font-medium text-[#6B7694]"
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
      </HRShellContext.Provider>
    </AuthGuard>
  );
};

