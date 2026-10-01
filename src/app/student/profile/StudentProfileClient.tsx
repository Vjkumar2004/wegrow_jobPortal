"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { StudentProfile } from "@/types";
import { studentService } from "@/services/student.service";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  User,
  Check,
  CheckCircle2,
  Camera,
  Pencil,
  Plus,
  ExternalLink,
  FileText,
  Upload,
  Globe,
  DollarSign,
  Clock,
  Sparkles,
  X,
  FileCheck,
  Building2,
  Code,
  ArrowRight,
  ShieldCheck,
  Share2,
} from "lucide-react";

interface StudentProfileClientProps {
  initialProfile: StudentProfile;
}

export default function StudentProfileClient({ initialProfile }: StudentProfileClientProps) {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState("Overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit states for sections
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form states for inline editing
  const [aboutForm, setAboutForm] = useState(profile.bio);
  const [personalForm, setPersonalForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    dateOfBirth: profile.dateOfBirth || "12 Mar 2003",
    gender: profile.gender || "Male",
  });
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profile.photoUrl || "");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Career Preferences form
  const [careerPrefForm, setCareerPrefForm] = useState({
    preferredRoles: profile.careerPreferences?.preferredRoles || "Software Developer, Full Stack Developer",
    preferredLocations: profile.careerPreferences?.preferredLocations || "Chennai, Bangalore, Remote",
    employmentType: profile.careerPreferences?.employmentType || "Full Time",
    expectedSalary: profile.careerPreferences?.expectedSalary || "Rs 4 - 7 LPA",
    joiningTimeline: profile.careerPreferences?.joiningTimeline || "Immediate / 1 Month",
  });

  // Animated progress ring state (sweeps to 85% on load)
  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(profile.completionPercentage || 85);
    }, 150);
    return () => clearTimeout(timer);
  }, [profile.completionPercentage]);

  // Toast auto-clear
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Scroll to section matching tab
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal-info", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Building2 },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "other-links", label: "Other Links", icon: Globe },
  ];

  const handleTabClick = (tabId: string, label: string) => {
    setActiveTab(label);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Profile Strength Ring calculations (Radius 36, circumference ~226.2)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  // Handlers for Save actions
  const handleSaveAbout = async () => {
    const updated = { ...profile, bio: aboutForm };
    setProfile(updated);
    setEditingSection(null);
    await studentService.updateProfile(updated);
    showToast("About Me updated successfully!");
  };

  const handleSavePersonal = async () => {
    const updated = {
      ...profile,
      name: personalForm.name,
      email: personalForm.email,
      phone: personalForm.phone,
      location: personalForm.location,
      dateOfBirth: personalForm.dateOfBirth,
      gender: personalForm.gender,
    };
    setProfile(updated);
    setEditingSection(null);
    await studentService.updateProfile(updated);
    showToast("Personal Information updated successfully!");
  };

  const handleSaveCareerPref = async () => {
    const updated = {
      ...profile,
      careerPreferences: { ...careerPrefForm },
    };
    setProfile(updated);
    setEditingSection(null);
    await studentService.updateProfile(updated);
    showToast("Career Preferences updated successfully!");
  };

  const handleAddSkill = async () => {
    if (!newSkillInput.trim()) return;
    if (!profile.skills.includes(newSkillInput.trim())) {
      const updatedSkills = [...profile.skills, newSkillInput.trim()];
      const updated = { ...profile, skills: updatedSkills };
      setProfile(updated);
      setNewSkillInput("");
      setShowAddSkillInput(false);
      await studentService.updateProfile(updated);
      showToast(`Added skill "${newSkillInput.trim()}"`);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter((s) => s !== skillToRemove);
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    await studentService.updateProfile(updated);
    showToast(`Removed skill "${skillToRemove}"`);
  };

  const handleResumeReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF document (max 5 MB).");
        return;
      }
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(null);
              setProfile((prevProf) => ({
                ...prevProf,
                resumeName: file.name,
                resumeFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                resumeUploadDate: `Uploaded on ${new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`,
              }));
              showToast("New resume uploaded & ATS scanned successfully!");
            }, 400);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FD] p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1440px] mx-auto text-[#0B1F4B] font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F4B] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-[13px] animate-in slide-in-from-top-3 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. PROFILE HEADER CARD (White, 16px radius, padding 24px) ================= */}
      <section
        id="overview"
        className="bg-white rounded-[16px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          {/* Left: Large circular photo (~140px, white 4px border, soft shadow) with camera button */}
          <div className="relative shrink-0">
            {/* Hidden file input for direct computer file upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async (uploadEvent) => {
                    const result = uploadEvent.target?.result as string;
                    if (result) {
                      setPhotoPreview(result);
                      const updated = { ...profile, photoUrl: result };
                      setProfile(updated);
                      await studentService.updateProfile(updated);
                      showToast("Profile picture uploaded & updated successfully!");
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[136px] h-[136px] sm:w-[140px] sm:h-[140px] rounded-full border-4 border-white shadow-[0_8px_24px_rgba(11,31,75,0.12)] overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer group"
              title="Click to upload profile photo from your device"
            >
              {profile.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-[#1E5BE0] text-white font-black text-3xl flex items-center justify-center">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Overlapping blue camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#1E5BE0] hover:bg-[#1548b8] text-white border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              title="Upload photo from your computer or phone"
              aria-label="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Middle: Details & Meta info */}
          <div className="flex-1 text-center lg:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <h1 className="text-[24px] sm:text-[26px] font-[800] text-[#0B1F4B] tracking-tight">
                {profile.name}
              </h1>
              {/* Blue verified badge */}
              <span className="inline-flex items-center text-[#1E5BE0]" title="Verified Student Profile">
                <CheckCircle2 className="w-5 h-5 fill-[#1E5BE0] text-white" />
              </span>
            </div>

            {/* Tagline */}
            <p className="text-[15px] sm:text-[16px] text-[#6B7694] font-[500] mt-1 leading-snug">
              {profile.headline}
            </p>

            {/* Meta Row 1: MapPin, GraduationCap, Briefcase */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3 text-[13px] text-[#6B7694]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.degreeName || "B.E Computer Science"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.experienceLevel || "Fresher"}</span>
              </span>
            </div>

            {/* Meta Row 2: Mail, Phone */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 text-[13px] text-[#6B7694]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.phone}</span>
              </span>
            </div>
          </div>

          {/* Right: Profile Strength Mini Card */}
          <div className="w-full lg:w-auto shrink-0 bg-[#FBFDFF] rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-2xs">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-[13px] font-[600] text-[#1E5BE0]">Profile Strength</span>
              <button
                type="button"
                onClick={() => setEditingSection("personal")}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Circular SVG Progress Ring (~84px, 8px stroke, blue progress, light track) */}
              <div className="relative w-[84px] h-[84px] flex items-center justify-center shrink-0">
                <svg className="w-[84px] h-[84px] -rotate-90 transform" viewBox="0 0 84 84">
                  <circle
                    cx="42"
                    cy="42"
                    r={radius}
                    stroke="#EAF1FF"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="42"
                    cy="42"
                    r={radius}
                    stroke="#1E5BE0"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[18px] font-[700] text-[#0B1F4B]">
                    {animatedPercent}%
                  </span>
                </div>
              </div>

              {/* Checklist with green tick circles */}
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[#0B1F4B] font-medium">Personal Information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[#0B1F4B] font-medium">Education Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[#0B1F4B] font-medium">Skills (8/10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[#0B1F4B] font-medium">Add Projects (2/2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[#0B1F4B] font-medium">Upload Resume</span>
                </div>
              </div>
            </div>

            {/* Solid blue "Improve Profile →" button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("skills");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full mt-3.5 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[14px] font-[600] py-[10px] px-[18px] rounded-[8px] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Improve Profile →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 2. TABS ROW (White card, 14px radius, height 52px) ================= */}
      <nav className="bg-white rounded-[14px] px-3 sm:px-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-x-auto scrollbar-none sticky top-[66px] z-30">
        <div className="flex items-center justify-between min-w-[760px] h-[52px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id, tab.label)}
                className={`h-full flex items-center gap-2 px-3 text-[14px] font-[500] border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#1E5BE0] text-[#1E5BE0] font-[600]"
                    : "border-transparent text-[#0B1F4B] hover:text-[#1E5BE0]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#1E5BE0]" : "text-[#6B7694]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ================= 3. TWO-COLUMN LAYOUT (Main ~64% & Right ~34%) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= MAIN COLUMN (lg:col-span-8 ~64%) ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: About Me */}
          <div
            id="about-me"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">About Me</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(editingSection === "about" ? null : "about")}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>{editingSection === "about" ? "Cancel" : "Edit"}</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {editingSection === "about" ? (
              <div className="space-y-3 pt-1">
                <textarea
                  value={aboutForm}
                  onChange={(e) => setAboutForm(e.target.value)}
                  rows={4}
                  className="w-full bg-[#F4F6FA] text-[14px] text-[#0B1F4B] p-3.5 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 focus:border-[#1E5BE0]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 border border-[#E3E8F0] text-xs font-semibold rounded-lg hover:bg-slate-50 text-[#6B7694]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAbout}
                    className="px-4 py-2 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[14px] text-[#475569] leading-[1.7]">{profile.bio}</p>
            )}
          </div>

          {/* Card 2: Personal Information (3 x 2 grid of field tiles) */}
          <div
            id="personal-info"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Personal Information</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(editingSection === "personal" ? null : "personal")}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>{editingSection === "personal" ? "Cancel" : "Edit"}</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {editingSection === "personal" ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={personalForm.name}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Location</label>
                    <input
                      type="text"
                      value={personalForm.location}
                      onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={personalForm.dateOfBirth}
                      onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Gender</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 border border-[#E3E8F0] text-xs font-semibold rounded-lg hover:bg-slate-50 text-[#6B7694]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePersonal}
                    className="px-4 py-2 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* Full Name */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Full Name</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.name}
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Email Address</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.email}
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Phone Number</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.phone}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Location</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.location}
                    </span>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Date of Birth</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.dateOfBirth || "12 Mar 2003"}
                    </span>
                  </div>
                </div>

                {/* Gender */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Gender</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.gender || "Male"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Education */}
          <div
            id="education"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Education</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Vertical timeline */}
            <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EEF1F7] space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="relative">
                  {/* Blue filled dot */}
                  <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1E5BE0] ring-4 ring-[#EAF1FF]" />
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-[600] text-[16px] text-[#0B1F4B] leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-[14px] text-[#6B7694] mt-0.5">{edu.institution}</p>
                      <div className="mt-1.5 text-[13px]">
                        <span className="text-[#6B7694]">CGPA: </span>
                        <span className="font-[700] text-[#0B1F4B]">{edu.cgpa || edu.grade || "8.1 / 10.0"}</span>
                      </div>
                    </div>
                    {/* Pill: 2021 - 2025 */}
                    <span className="self-start sm:self-auto bg-[#F1F4F9] text-[#0B1F4B] text-[13px] font-medium px-3 py-1 rounded-[8px] shrink-0">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Projects */}
          <div
            id="projects"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Projects</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* List of project rows separated by thin dividers */}
            <div className="divide-y divide-[#EEF1F7]">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail screenshot (~120x72px, 8px radius, border) */}
                    <div className="w-[120px] h-[72px] rounded-[8px] border border-[#EEF1F7] overflow-hidden bg-slate-100 shrink-0">
                      {proj.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={proj.thumbnailUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-xs font-bold text-slate-500">
                          PROJ
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-[600] text-[15px] text-[#0B1F4B] leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-[13px] text-[#6B7694] mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                      {/* Project Tech Tags: 6px radius, bg #F1F4F9, text navy, 12px */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="bg-[#F1F4F9] text-[#0B1F4B] text-[12px] font-medium px-2 py-0.5 rounded-[6px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    <a
                      href={proj.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[500] transition inline-flex items-center gap-1"
                    >
                      <span>View Project ↗</span>
                    </a>
                    {proj.dateText && (
                      <span className="text-[12px] text-[#6B7694]">{proj.dateText}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Internships & Experience */}
          <div
            id="experience"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Internships & Experience</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Experience items */}
            {profile.internships.map((intern) => (
              <div key={intern.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Bluestock Fintech company logo tile */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#1E5BE0] shrink-0 overflow-hidden shadow-2xs">
                      {intern.companyLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={intern.companyLogo}
                          alt={intern.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>BF</span>
                      )}
                    </div>
                    <div>
                      <div className="font-[700] text-[14px] text-[#0B1F4B]">{intern.company}</div>
                      <h3 className="font-[600] text-[15px] text-[#0B1F4B] leading-snug">
                        {intern.role}
                      </h3>
                    </div>
                  </div>
                  {/* Right-aligned grey date */}
                  <span className="text-[13px] text-[#6B7694] self-start sm:self-auto font-medium">
                    {intern.duration}
                  </span>
                </div>

                {/* Bullet list (grey, 13px) */}
                <ul className="list-disc pl-5 text-[13px] text-[#475569] space-y-1.5">
                  {(intern.bullets || [
                    "Built IPO management system with React.js and Firebase.",
                    "Implemented secure authentication and real-time data handling.",
                    "Worked with Python for data processing and automation.",
                  ]).map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (lg:col-span-4 ~34%) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Resume */}
          <div
            id="resume"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Resume</h2>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeReplace}
              accept="application/pdf"
              className="hidden"
            />

            {/* File Row (light grey #F7F9FC bg, 12px radius, padding 14px) */}
            <div className="bg-[#F7F9FC] rounded-[12px] p-3.5 flex items-center gap-3 border border-[#EEF1F7]">
              {/* Red PDF icon tile */}
              <div className="w-10 h-10 rounded-lg bg-[#FFEBEB] text-[#EF4444] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-[600] text-[14px] text-[#0B1F4B] truncate">
                  {profile.resumeName || "Vijayakumar_M_Resume.pdf"}
                </h4>
                <p className="text-[12px] text-[#6B7694] mt-0.5">
                  {profile.resumeUploadDate || "Uploaded on Sep 10, 2026 - 420 KB"}
                </p>
              </div>
            </div>

            {/* Upload progress indicator */}
            {uploadProgress !== null && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#6B7694]">
                  <span>Uploading PDF & scanning ATS keywords...</span>
                  <span className="font-bold text-[#1E5BE0]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EAF1FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E5BE0] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Two equal buttons: outlined blue "View Resume" and solid blue "Replace" */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={profile.resumeUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[44px] rounded-[10px] border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-blue-50 font-[600] text-[13px] flex items-center justify-center transition"
              >
                View Resume
              </a>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[44px] rounded-[10px] bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-[600] text-[13px] flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                Replace
              </button>
            </div>

            {/* Green Success Box with tick icon: "Your resume is optimized for ATS" */}
            <div className="bg-[#E8F8EF] text-[#1E9E63] text-[13px] rounded-[10px] p-3 flex items-center gap-2.5 font-medium border border-[#22B573]/20">
              <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span>Your resume is optimized for ATS</span>
            </div>
          </div>

          {/* Card 2: Skills */}
          <div
            id="skills"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Skills</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSkillInput(!showAddSkillInput)}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Inline Add Skill Input */}
            {showAddSkillInput && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Type skill & press enter (e.g. Next.js, Redux)..."
                  className="flex-1 bg-[#F4F6FA] text-xs text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:border-[#1E5BE0]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-[#1E5BE0] text-white text-xs px-3.5 py-2.5 rounded-[10px] font-semibold hover:bg-[#1548b8]"
                >
                  Add
                </button>
              </div>
            )}

            {/* Wrap of rounded blue chips: bg #E8F0FF, text #1E5BE0, fully rounded (skills), 12px */}
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-[#E8F0FF] text-[#1E5BE0] text-[12px] font-medium px-3 py-1 rounded-full group hover:bg-[#dbe7ff] transition"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="opacity-60 hover:opacity-100 text-[#1E5BE0] cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Full-width dashed blue-border button "+ Add Skill" (10px radius, 40px height) */}
            <button
              type="button"
              onClick={() => setShowAddSkillInput(true)}
              className="w-full h-[40px] border-[1.5px] border-dashed border-[#1E5BE0] text-[#1E5BE0] hover:bg-blue-50/60 rounded-[10px] text-[13px] font-[600] flex items-center justify-center transition cursor-pointer"
            >
              + Add Skill
            </button>
          </div>

          {/* Card 3: Online Presence */}
          <div
            id="other-links"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Online Presence</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            <div className="space-y-3">
              {/* LinkedIn Row */}
              <a
                href={profile.linkedin || "https://linkedin.com/in/vijayakumarm"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-[#EEF1F7] hover:border-[#1E5BE0]/40 flex items-center justify-between gap-3 group transition bg-[#FBFDFF]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center font-bold text-xs shrink-0">
                    in
                  </div>
                  <div className="min-w-0">
                    <span className="font-[600] text-[14px] text-[#0B1F4B] block leading-tight group-hover:text-[#1E5BE0] transition-colors">
                      LinkedIn Profile
                    </span>
                    <span className="text-[12px] text-[#6B7694] truncate block mt-0.5">
                      {profile.linkedin || "https://linkedin.com/in/vijayakumarm"}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#1E5BE0] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* GitHub Row */}
              <a
                href={profile.github || "https://github.com/vijayakumarm"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-[#EEF1F7] hover:border-[#1E5BE0]/40 flex items-center justify-between gap-3 group transition bg-[#FBFDFF]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    GH
                  </div>
                  <div className="min-w-0">
                    <span className="font-[600] text-[14px] text-[#0B1F4B] block leading-tight group-hover:text-[#1E5BE0] transition-colors">
                      GitHub Profile
                    </span>
                    <span className="text-[12px] text-[#6B7694] truncate block mt-0.5">
                      {profile.github || "https://github.com/vijayakumarm"}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#1E5BE0] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Dashed blue button */}
            <button
              type="button"
              onClick={() => showToast("Add Link dialog opened")}
              className="w-full h-[40px] border-[1.5px] border-dashed border-[#1E5BE0] text-[#1E5BE0] hover:bg-blue-50/60 rounded-[10px] text-[13px] font-[600] flex items-center justify-center transition cursor-pointer"
            >
              + Add Another Link
            </button>
          </div>

          {/* Card 4: Career Preferences */}
          <div
            id="career-preferences"
            className="bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-[18px] font-[700] text-[#0B1F4B]">Career Preferences</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(editingSection === "career" ? null : "career")}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>{editingSection === "career" ? "Cancel" : "Edit"}</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {editingSection === "career" ? (
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Preferred Job Roles</label>
                  <input
                    type="text"
                    value={careerPrefForm.preferredRoles}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, preferredRoles: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Preferred Locations</label>
                  <input
                    type="text"
                    value={careerPrefForm.preferredLocations}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, preferredLocations: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Employment Type</label>
                  <input
                    type="text"
                    value={careerPrefForm.employmentType}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, employmentType: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Expected Salary</label>
                  <input
                    type="text"
                    value={careerPrefForm.expectedSalary}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, expectedSalary: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Joining Timeline</label>
                  <input
                    type="text"
                    value={careerPrefForm.joiningTimeline}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, joiningTimeline: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-3 py-1.5 border border-[#E3E8F0] text-xs font-semibold rounded-lg hover:bg-slate-50 text-[#6B7694]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCareerPref}
                    className="px-3.5 py-1.5 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#EEF1F7] text-[13px]">
                {/* 1. Preferred Job Roles */}
                <div className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Preferred Job Roles</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.preferredRoles || "Software Developer, Full Stack Developer"}
                  </span>
                </div>

                {/* 2. Preferred Locations */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Preferred Locations</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.preferredLocations || "Chennai, Bangalore, Remote"}
                  </span>
                </div>

                {/* 3. Employment Type */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Employment Type</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.employmentType || "Full Time"}
                  </span>
                </div>

                {/* 4. Expected Salary */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Expected Salary</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.expectedSalary || "Rs 4 - 7 LPA"}
                  </span>
                </div>

                {/* 5. Joining Timeline */}
                <div className="py-2.5 last:pb-0 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Joining Timeline</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.joiningTimeline || "Immediate / 1 Month"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PHOTO UPLOAD MODAL ================= */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0B1F4B]">Change Profile Photo</h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F4F9] text-[#6B7694] hover:text-[#0B1F4B] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1E5BE0]/20 shadow-md bg-slate-100 flex items-center justify-center">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-[#6B7694]" />
                )}
              </div>

              {/* Direct file picker button */}
              <div className="w-full">
                <input
                  type="file"
                  id="modal-photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        const result = uploadEvent.target?.result as string;
                        if (result) {
                          setPhotoPreview(result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="modal-photo-upload"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E8F0FF] text-[#1E5BE0] hover:bg-[#d8e6ff] text-xs font-bold rounded-xl cursor-pointer transition border border-[#D5E3FF]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Choose Image from Computer / Phone</span>
                </label>
              </div>

              <div className="w-full space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-[#6B7694]">Or enter Image URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoPreview}
                  onChange={(e) => setPhotoPreview(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E3E8F0] bg-[#F4F6FA] text-[#0B1F4B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEF1F7]">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#6B7694] hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const updated = { ...profile, photoUrl: photoPreview };
                  setProfile(updated);
                  setShowPhotoModal(false);
                  await studentService.updateProfile(updated);
                  showToast("Profile photo updated successfully!");
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E5BE0] hover:bg-[#1548b8] rounded-lg cursor-pointer"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
