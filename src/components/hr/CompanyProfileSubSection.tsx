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

export default function CompanyProfileSubSection() {
  const [name, setName] = useState("Infosys Technologies");
  const [tagline, setTagline] = useState("Navigate Your Next — Enterprise Digital Consulting");
  const [industry, setIndustry] = useState("Information Technology & Services");
  const [location, setLocation] = useState("Electronics City, Bengaluru, Karnataka 560100");
  const [website, setWebsite] = useState("https://infosys.com");
  const [size, setSize] = useState("100,000+ employees");
  const [hrEmail, setHrEmail] = useState("campus.recruitment@infosys.com");
  const [hrPhone, setHrPhone] = useState("+91 80 2852 0261");
  const [description, setDescription] = useState(
    "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 56 countries to navigate their digital transformation, powering continuous learning and digital innovation for fresh campus graduates."
  );
  const [culture, setCulture] = useState(
    "We believe in nurturing early-career engineers through global mentorship programs, progressive learning hackathons, and high-impact enterprise projects."
  );
  const [saved, setSaved] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [recruiterAvatarUrl, setRecruiterAvatarUrl] = useState<string | null>(null);

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3200);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCompanyLogoUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setRecruiterAvatarUrl(result);
        }
      };
      reader.readAsDataURL(file);
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

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Showcase Header Card with Logo Upload & Recruiter Avatar Upload */}
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
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
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1E5BE0] to-blue-500 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md cursor-pointer overflow-hidden border-2 border-white hover:opacity-90 transition"
                title="Click to upload official company logo"
              >
                {companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>INF</span>
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
              <p className="text-xs text-[#6B7694] mt-0.5">{tagline}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6B7694] mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E5BE0]" /> Bengaluru
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
              </div>
            </div>
          </div>

          {/* Right Recruiter Profile Avatar Upload Box */}
          <div className="flex items-center gap-4 bg-[#F7F9FD] p-3.5 rounded-xl border border-[#EEF1F7] shrink-0">
            <div className="relative">
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0 cursor-pointer border-2 border-white hover:opacity-90 transition"
                title="Click to upload recruiter profile photo"
              >
                {recruiterAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recruiterAvatarUrl} alt="Recruiter Photo" className="w-full h-full object-cover" />
                ) : (
                  <span>SR</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-sm border border-white cursor-pointer"
                title="Upload Recruiter Photo"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="text-left text-xs">
              <div className="font-bold text-[#0B1F4B]">Sneha Roy</div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-[11px] text-[#FF6B00] font-semibold hover:underline block cursor-pointer mt-0.5"
              >
                Upload Photo →
              </button>
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
                <option value="50 - 200 employees">50 - 200 employees</option>
                <option value="200 - 1,000 employees">200 - 1,000 employees</option>
                <option value="1,000 - 10,000 employees">1,000 - 10,000 employees</option>
                <option value="100,000+ employees">100,000+ employees</option>
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
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Campus HR Email *
              </label>
              <input
                type="email"
                required
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">
                Campus Desk Phone
              </label>
              <input
                type="tel"
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
