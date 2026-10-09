"use client";

import React, { useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  ExternalLink,
  Camera,
} from "lucide-react";

import { hrService } from "@/services/hr.service";
import { authService } from "@/services/auth.service";

export default function CompanyProfileSubSection() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [size, setSize] = useState("10 - 20 employees");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");
  const [description, setDescription] = useState("");
  const [culture, setCulture] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [saved, setSaved] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [recruiterAvatarUrl, setRecruiterAvatarUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  React.useEffect(() => {
    // 1. Check local user first for instant hydration
    const localUser = authService.getCurrentUser();
    if (localUser) {
      const name = localUser.name || localUser.fullName || (localUser as any).hrProfile?.fullName || "Recruiter";
      setRecruiterName(name);
      if (localUser.email) setRecruiterEmail(localUser.email);
      const phone = (localUser as any).hrProfile?.phone || (localUser as any).phone || (localUser as any).hrPhone;
      if (phone) setHrPhone(phone);
      const storedAvatar =
        (localUser as any).avatarUrl ||
        (localUser as any).avatar ||
        (localUser as any).hrProfile?.avatarUrl ||
        (localUser as any).hrProfile?.avatar ||
        (typeof window !== "undefined"
          ? localStorage.getItem(`wegrow_hr_avatar_${localUser.id}`) || localStorage.getItem("wegrow_hr_avatar")
          : null);
      if (storedAvatar) {
        setRecruiterAvatarUrl(storedAvatar);
      }
    }

    // 2. Load HR user from API
    authService.getMe().then((res) => {
      const user = res.data?.user;
      if (user) {
        const name = user.name || user.fullName || (user as any).hrProfile?.fullName || "Recruiter";
        setRecruiterName(name);
        if (user.email) setRecruiterEmail(user.email);
        const phone = (user as any).hrProfile?.phone || (user as any).phone || (user as any).hrPhone;
        if (phone) setHrPhone(phone);
        const storedAvatar =
          (user as any).avatarUrl ||
          (user as any).avatar ||
          (user as any).hrProfile?.avatarUrl ||
          (user as any).hrProfile?.avatar ||
          (typeof window !== "undefined"
            ? localStorage.getItem(`wegrow_hr_avatar_${user.id}`) || localStorage.getItem("wegrow_hr_avatar")
            : null);
        if (storedAvatar) {
          setRecruiterAvatarUrl(storedAvatar);
        }
      }
    }).catch(() => {});

    // 3. Load company profile via GET /api/v1/hr/company
    hrService.getCompanyProfile()
      .then((comp: any) => {
        if (comp) {
          if (comp.name) setName(comp.name);
          if (comp.tagline) setTagline(comp.tagline);
          if (comp.industry) setIndustry(comp.industry);
          if (comp.location) setLocation(comp.location);
          if (comp.website) setWebsite(comp.website);
          if (comp.size || comp.companySize) {
            const raw = comp.size || comp.companySize;
            if (raw === "SIZE_1_10" || raw === "SIZE_11_50") setSize("10 - 20 employees");
            else if (raw === "SIZE_51_200") setSize("50 - 200 employees");
            else if (raw === "SIZE_201_500") setSize("200 - 1,000 employees");
            else if (raw === "SIZE_500_PLUS") setSize("1,000 - 10,000 employees");
            else setSize(raw);
          }
          if (comp.about || comp.description) setDescription(comp.about || comp.description);
          if (comp.culture) setCulture(comp.culture);
          if (comp.hrPhone || comp.phone) setHrPhone(comp.hrPhone || comp.phone);
          if (comp.logoUrl) {
            setCompanyLogoUrl(comp.logoUrl);
          }
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hrService.updateCompanyProfile({
        name,
        tagline,
        industry,
        location,
        website,
        size,
        hrPhone,
        phone: hrPhone,
        about: description,
        culture,
      });

      // Update local storage user phone if present so next instant hydration has it
      const currentUser = authService.getCurrentUser();
      if (currentUser && typeof window !== "undefined") {
        try {
          const userStr = localStorage.getItem("wegrow_auth_user");
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userObj.phone = hrPhone;
            if (userObj.hrProfile) userObj.hrProfile.phone = hrPhone;
            localStorage.setItem("wegrow_auth_user", JSON.stringify(userObj));
          }
        } catch {}
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3200);
      showToast("Company profile updated successfully!");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save company profile.", true);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload a valid logo (JPEG, PNG, WebP, or SVG).", true);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Company logo must be under 2 MB.", true);
      return;
    }

    setIsUploadingLogo(true);
    try {
      const res = await hrService.uploadCompanyLogo(file);
      if (res?.logoUrl) {
        setCompanyLogoUrl(res.logoUrl + `?t=${Date.now()}`);
      }
      showToast("Company logo uploaded successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to upload company logo";
      showToast(msg, true);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm("Are you sure you want to remove the company logo?")) return;
    try {
      await hrService.deleteCompanyLogo();
      setCompanyLogoUrl(null);
      showToast("Company logo removed successfully.");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete company logo", true);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload a valid photo (JPEG, PNG, or WebP).", true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Profile photo must be under 5 MB.", true);
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Upload directly to Cloudflare R2 via backend API
      const res = await hrService.uploadAvatar(file);
      const uploadedUrl = res?.avatarUrl || res?.avatar;

      if (!uploadedUrl) {
        throw new Error("No avatar URL returned from storage service");
      }

      setRecruiterAvatarUrl(uploadedUrl);

      // Persist in localStorage for instant fast hydration
      const currentUser = authService.getCurrentUser();
      const userId = currentUser?.id || "default";
      if (typeof window !== "undefined") {
        localStorage.setItem(`wegrow_hr_avatar_${userId}`, uploadedUrl);
        localStorage.setItem("wegrow_hr_avatar", uploadedUrl);

        const userStr = localStorage.getItem("wegrow_auth_user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            userObj.avatarUrl = uploadedUrl;
            userObj.avatar = uploadedUrl;
            localStorage.setItem("wegrow_auth_user", JSON.stringify(userObj));
          } catch {}
        }
      }

      // Broadcast to HRLayout and navbar
      window.dispatchEvent(
        new CustomEvent("hr-avatar-updated", { detail: { avatarUrl: uploadedUrl } })
      );

      showToast("Recruiter profile photo uploaded to Cloudflare storage successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload profile photo";
      showToast(msg, true);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    try {
      await hrService.deleteAvatar();
      setRecruiterAvatarUrl(null);
      const currentUser = authService.getCurrentUser();
      const userId = currentUser?.id || "default";
      if (typeof window !== "undefined") {
        localStorage.removeItem(`wegrow_hr_avatar_${userId}`);
        localStorage.removeItem("wegrow_hr_avatar");

        const userStr = localStorage.getItem("wegrow_auth_user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            delete userObj.avatarUrl;
            delete userObj.avatar;
            localStorage.setItem("wegrow_auth_user", JSON.stringify(userObj));
          } catch {}
        }
      }

      window.dispatchEvent(
        new CustomEvent("hr-avatar-updated", { detail: { avatarUrl: null } })
      );

      showToast("Profile photo removed successfully.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to remove profile photo";
      showToast(msg, true);
    }
  };

  return (
    <div id="company-profile-section" className="space-y-6 pt-2">
      {/* Success Notification */}
      {saved && (
        <div className="p-4 bg-[#E8F8EF] text-[#22B573] text-sm font-semibold rounded-[12px] border border-[#C6F0D8] flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
          <span>Company profile and recruiter branding updated successfully!</span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 text-sm font-semibold rounded-[12px] border flex items-center gap-2.5 animate-in fade-in ${
            toastMessage.isError
              ? "bg-rose-50 text-[#EF4444] border-rose-200"
              : "bg-[#E8F8EF] text-[#22B573] border-[#C6F0D8]"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Showcase Header Card with Logo Upload & Recruiter Avatar Upload */}
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={logoInputRef}
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            {/* Uploadable Company Logo */}
            <div className="relative group">
              <div
                onClick={() => logoInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1E5BE0] to-blue-500 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md cursor-pointer overflow-hidden border-2 border-white hover:opacity-90 transition relative"
                title="Click to upload official company logo (Cloudflare R2)"
              >
                {isUploadingLogo ? (
                  <div className="flex items-center justify-center text-xs font-semibold">Uploading...</div>
                ) : companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={companyLogoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setCompanyLogoUrl(null);
                    }}
                  />
                ) : (
                  <span>{name ? name.slice(0, 3).toUpperCase() : "LOGO"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1E5BE0] text-white flex items-center justify-center shadow-md hover:scale-110 transition border-2 border-white cursor-pointer"
                title="Upload Company Logo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-[#0B1F4B]">{name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#22B573] bg-[#E8F8EF] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                </span>
              </div>
              <p className="text-xs text-[#6B7694] mt-0.5">{tagline || "Add your corporate motto or tagline"}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6B7694] mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E5BE0]" /> {location || "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#FF6B00]" /> {size}
                </span>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-xs text-[#1E5BE0] font-semibold hover:underline cursor-pointer"
                >
                  Change Logo ↗
                </button>
                {companyLogoUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteLogo}
                    className="text-xs text-[#EF4444] font-semibold hover:underline cursor-pointer"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Recruiter Profile Avatar Upload Box */}
          <div className="flex items-center gap-3.5 bg-[#F7F9FD] p-3.5 rounded-2xl border border-[#EEF1F7] shrink-0">
            <div className="relative group">
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-white font-bold text-base flex items-center justify-center shadow-md shrink-0 cursor-pointer border-2 border-white hover:opacity-90 transition relative ring-2 ring-[#FF6B00]/20"
                title="Click to upload recruiter profile photo"
              >
                {isUploadingAvatar ? (
                  <div className="flex items-center justify-center text-[11px] font-semibold text-white">...</div>
                ) : recruiterAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recruiterAvatarUrl} alt="Recruiter Photo" className="w-full h-full object-cover" />
                ) : (
                  <span>{recruiterName ? recruiterName.slice(0, 2).toUpperCase() : "HR"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition"
                title="Upload Recruiter Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="text-left text-xs">
              <div className="font-bold text-[#0B1F4B] text-[13px]">{recruiterName || "Recruiter"}</div>
              <p className="text-[11px] text-[#6B7694] truncate max-w-[180px]">{recruiterEmail || "Hiring Lead / Recruiter"}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-[11px] text-[#FF6B00] font-semibold hover:underline cursor-pointer"
                >
                  {recruiterAvatarUrl ? "Change Photo" : "Upload Photo →"}
                </button>
                {recruiterAvatarUrl && (
                  <>
                    <span className="text-[#9BA5BB] text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="text-[11px] text-rose-500 font-semibold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Core Company Details */}
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 sm:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-2">
            Corporate Identifiers & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Official Entity Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Corporate Tagline / Motto
              </label>
              <input
                type="text"
                placeholder="e.g. Innovating Tomorrow's Talent"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Industry Sector *
              </label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Official Website *
              </label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Workforce Scale *
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer"
              >
                <option value="10 - 20 employees">10 - 20 employees</option>
                <option value="20 - 50 employees">20 - 50 employees</option>
                <option value="50 - 200 employees">50 - 200 employees</option>
                <option value="200 - 1,000 employees">200 - 1,000 employees</option>
                <option value="1,000 - 10,000 employees">1,000 - 10,000 employees</option>
                <option value="10,000+ employees">10,000+ employees</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Headquarters Address *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B1F4B]">
                  Recruiter Account Email
                </label>
                <span className="text-[10px] font-bold text-[#22B573] bg-[#E8F8EF] px-2 py-0.5 rounded-full">
                  Login Account
                </span>
              </div>
              <input
                type="email"
                disabled
                value={recruiterEmail}
                className="w-full bg-[#F1F4F9] border border-[#E3E8F0] text-[#6B7694] text-xs px-3.5 py-2.5 rounded-[10px] cursor-not-allowed select-none font-medium"
                title="Your verified login email (managed via account settings)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Campus Desk Phone
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={hrPhone}
                onChange={(e) => setHrPhone(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Narrative & Student Pitch */}
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 sm:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E5BE0] border-b border-[#EEF1F7] pb-2">
            About Organization & Campus Work Culture
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              About the Organization *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs p-3.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
              Campus Work Culture & Fresher Onboarding
            </label>
            <textarea
              rows={3}
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs p-3.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-[10px] bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold shadow-md shadow-[#1E5BE0]/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
