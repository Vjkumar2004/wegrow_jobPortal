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
  const [hrUserName, setHrUserName] = useState("");
  const [hrCompanyName, setHrCompanyName] = useState("");
  const [hrCompanyLogoUrl, setHrCompanyLogoUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (isInsideShell) return;
    authService.getMe().then((res) => {
      const user = res.data?.user;
      const name = user?.name || user?.fullName || user?.hrProfile?.fullName || "Recruiter"; setHrUserName(name);
      const company = user?.hrProfile?.company;
      if (company?.name) setHrCompanyName(company.name);
    }).catch(() => {});

    hrService.getCompanyProfile().then((comp: any) => {
      if (comp?.logoUrl) setHrCompanyLogoUrl(comp.logoUrl);
    }).catch(() => {});
  }, [isInsideShell]);

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

  return (
    <AuthGuard allowedRoles={["HR"]} loginRoute="/hr/login">
      <HRShellContext.Provider value={true}>
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

          {/* Right: Recruiter Badge, Notification, Profile, Chevron */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#FF6B00] text-[11px] font-bold tracking-wide uppercase border border-[#FFE0CC]">
              Recruiter Portal
            </span>

            {/* Bell Icon */}
            <div className="relative p-2 rounded-xl text-[#0B1F4B] hover:bg-[#F1F4F9] transition cursor-pointer">
              <Bell className="w-5 h-5 text-[#0B1F4B]" strokeWidth={1.75} />
            </div>

            {/* Recruiter profile capsule */}
            <Link
              href="/hr/company"
              className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#EEF1F7] hover:opacity-90 transition"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                {hrCompanyLogoUrl ? (
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
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[14px] font-semibold text-[#0B1F4B] leading-snug">
                  {hrUserName || "Recruiter"}
                </div>
                <div className="text-[12px] text-[#6B7694] leading-none">
                  {hrCompanyName || "WeGrow Partner"}
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

            {/* Bottom "Need Support?" card */}
            <div className="mt-6 pt-4 border-t border-[#EEF1F7]">
              <div className="bg-[#F1F6FF] rounded-[14px] p-4 text-center border border-[#E3EEFF]">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-[#1E5BE0]">
                  <Headphones className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h4 className="font-bold text-[14px] text-[#0B1F4B]">Campus Hiring Desk</h4>
                <p className="text-[12px] text-[#6B7694] mt-0.5 leading-snug">
                  Need customized drive management?
                </p>
                <button
                  type="button"
                  className="mt-3 w-full border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white transition-colors text-[12px] font-semibold py-2 px-3 rounded-[8px] cursor-pointer"
                >
                  Contact Desk →
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

          {/* ================= RIGHT SIDE CONTENT AREA ================= */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-66px)] overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </HRShellContext.Provider>
    </AuthGuard>
  );
};

