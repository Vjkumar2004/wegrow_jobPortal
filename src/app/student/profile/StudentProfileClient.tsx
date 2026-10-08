"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentProfile } from "@/types";
import { studentService } from "@/services/student.service";
import { getErrorMessage, API_BASE_URL } from "@/lib/api/client";
import { getNameInitials } from "@/lib/utils";
import { PageLoader } from "@/components/common/PageLoader";
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
  X,
  Building2,
  Code,
  Globe,
  Clock,
  DollarSign,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const DEFAULT_EMPTY_PROFILE: StudentProfile = {
  id: "",
  name: "",
  email: "",
  phone: "",
  headline: "",
  bio: "",
  location: "",
  completionPercentage: 0,
  checklist: [],
  education: [],
  skills: [],
  projects: [],
  internships: [],
  certifications: [],
};

interface StudentProfileClientProps {
  initialProfile?: StudentProfile;
}

export default function StudentProfileClient({ initialProfile = DEFAULT_EMPTY_PROFILE }: StudentProfileClientProps) {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState("Overview");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState<string | null>(null);

  const { data: profileQuery, isLoading: isProfileQueryLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => studentService.getProfile(),
    initialData: initialProfile?.id ? initialProfile : undefined,
    staleTime: 60_000,
  });

  useEffect(() => {
    setImageError(false);
  }, [profile.avatarUrl, profile.avatar, profile.photoUrl]);

  // Edit states for inline personal & bio sections
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [aboutForm, setAboutForm] = useState(profile.bio || "");
  const [personalForm, setPersonalForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    dateOfBirth: profile.dateOfBirth || "",
    gender: profile.gender || "",
    headline: profile.headline || "",
  });

  // Online links inline state
  const [linksForm, setLinksForm] = useState({
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    portfolio: profile.portfolio || "",
  });

  // Career Preferences form
  const [careerPrefForm, setCareerPrefForm] = useState({
    preferredRoles: profile.careerPreferences?.preferredRoles || "",
    preferredLocations: profile.careerPreferences?.preferredLocations || "",
    employmentType: profile.careerPreferences?.employmentType || "",
    expectedSalary: profile.careerPreferences?.expectedSalary || "",
    joiningTimeline: profile.careerPreferences?.joiningTimeline || "",
  });

  // Skill state
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);

  // Resume upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Modals for CRUD sub-resources
  // 1. Education Modal
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [eduModalMode, setEduModalMode] = useState<"add" | "edit">("add");
  const [selectedEduId, setSelectedEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    grade: "",
  });
  const [isSavingEdu, setIsSavingEdu] = useState(false);

  // 2. Experience Modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expModalMode, setExpModalMode] = useState<"add" | "edit">("add");
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });
  const [isSavingExp, setIsSavingExp] = useState(false);

  // 3. Project Modal
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [projModalMode, setProjModalMode] = useState<"add" | "edit">("add");
  const [selectedProjId, setSelectedProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    description: "",
    projectUrl: "",
    repoUrl: "",
    startDate: "",
    endDate: "",
    technologies: "",
  });
  const [isSavingProj, setIsSavingProj] = useState(false);

  // Animated progress ring state
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Toast notification helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Re-fetch entire student profile from backend and sync React Query cache
  const refreshProfileData = async () => {
    try {
      const refreshed = await studentService.getProfile();
      queryClient.setQueryData(["student-profile"], refreshed);
      setProfile(refreshed);
      setAboutForm(refreshed.bio || "");
      setPersonalForm({
        name: refreshed.name || "",
        email: refreshed.email || "",
        phone: refreshed.phone || "",
        location: refreshed.location || "",
        dateOfBirth: refreshed.dateOfBirth || "",
        gender: refreshed.gender || "",
        headline: refreshed.headline || "",
      });
      setLinksForm({
        linkedin: refreshed.linkedin || "",
        github: refreshed.github || "",
        portfolio: refreshed.portfolio || "",
      });
      setCareerPrefForm({
        preferredRoles: refreshed.careerPreferences?.preferredRoles || "",
        preferredLocations: refreshed.careerPreferences?.preferredLocations || "",
        employmentType: refreshed.careerPreferences?.employmentType || "",
        expectedSalary: refreshed.careerPreferences?.expectedSalary || "",
        joiningTimeline: refreshed.careerPreferences?.joiningTimeline || "",
      });
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  // Sync profile when React Query cache changes
  useEffect(() => {
    if (profileQuery && profileQuery.id) {
      setProfile(profileQuery);
      setAboutForm(profileQuery.bio || "");
      setPersonalForm({
        name: profileQuery.name || "",
        email: profileQuery.email || "",
        phone: profileQuery.phone || "",
        location: profileQuery.location || "",
        dateOfBirth: profileQuery.dateOfBirth || "",
        gender: profileQuery.gender || "",
        headline: profileQuery.headline || "",
      });
      setLinksForm({
        linkedin: profileQuery.linkedin || "",
        github: profileQuery.github || "",
        portfolio: profileQuery.portfolio || "",
      });
      setCareerPrefForm({
        preferredRoles: profileQuery.careerPreferences?.preferredRoles || "",
        preferredLocations: profileQuery.careerPreferences?.preferredLocations || "",
        employmentType: profileQuery.careerPreferences?.employmentType || "",
        expectedSalary: profileQuery.careerPreferences?.expectedSalary || "",
        joiningTimeline: profileQuery.careerPreferences?.joiningTimeline || "",
      });
    }
  }, [profileQuery]);

  // Update animated percentage when completion changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(profile.completionPercentage || 0);
    }, 150);
    return () => clearTimeout(timer);
  }, [profile.completionPercentage]);

  // Profile strength ring calculation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

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

  // ===================== SAVE ABOUT =====================
  const handleSaveAbout = async () => {
    try {
      setIsSavingSection("about");
      await studentService.updateProfile({ bio: aboutForm });
      setProfile((prev) => ({ ...prev, bio: aboutForm }));
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      showToast("About Me updated successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update About Me"), "error");
    } finally {
      setIsSavingSection(null);
    }
  };

  // ===================== SAVE PERSONAL INFO =====================
  const handleSavePersonal = async () => {
    try {
      setIsSavingSection("personal");
      await studentService.updateProfile({
        headline: personalForm.headline,
        bio: profile.bio,
        phone: personalForm.phone,
        currentLocation: personalForm.location,
        location: personalForm.location,
        dateOfBirth: personalForm.dateOfBirth || undefined,
        gender: personalForm.gender || undefined,
      });
      setProfile((prev) => ({
        ...prev,
        headline: personalForm.headline,
        phone: personalForm.phone,
        location: personalForm.location,
        dateOfBirth: personalForm.dateOfBirth,
        gender: personalForm.gender,
      }));
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      showToast("Personal Information updated successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update personal information"), "error");
    } finally {
      setIsSavingSection(null);
    }
  };

  // ===================== SAVE ONLINE LINKS =====================
  const handleSaveLinks = async () => {
    try {
      setIsSavingSection("links");
      await studentService.updateProfile({
        linkedinUrl: linksForm.linkedin,
        githubUrl: linksForm.github,
        portfolioUrl: linksForm.portfolio,
      });
      setProfile((prev) => ({
        ...prev,
        linkedin: linksForm.linkedin,
        github: linksForm.github,
        portfolio: linksForm.portfolio,
      }));
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      showToast("Online links updated successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update links"), "error");
    } finally {
      setIsSavingSection(null);
    }
  };

  // ===================== SAVE CAREER PREFERENCES =====================
  const handleSaveCareerPref = async () => {
    try {
      setIsSavingSection("career");
      await studentService.updateProfile({
        careerPreferences: careerPrefForm,
        expectedSalary: careerPrefForm.expectedSalary,
      });
      setProfile((prev) => ({
        ...prev,
        careerPreferences: careerPrefForm,
      }));
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      showToast("Career Preferences updated successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update career preferences"), "error");
    } finally {
      setIsSavingSection(null);
    }
  };

  // ===================== SKILLS HANDLERS =====================
  const handleAddSkill = async () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    try {
      setIsSubmittingSkill(true);
      await studentService.addSkill({
        name: trimmed,
        proficiencyLevel: newSkillLevel,
      });
      setNewSkillInput("");
      setShowAddSkillInput(false);
      await refreshProfileData();
      showToast(`Added skill "${trimmed}"`);
    } catch (err) {
      showToast(getErrorMessage(err, `Failed to add skill "${trimmed}"`), "error");
    } finally {
      setIsSubmittingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    try {
      // Find skill in backend list to get its ID, or fallback
      let deleted = false;
      try {
        const skills = await studentService.getSkills();
        const match = skills.find((s) => s.name.toLowerCase() === skillToRemove.toLowerCase());
        if (match && match.id) {
          await studentService.deleteSkill(match.id);
          deleted = true;
        }
      } catch {
        // Continue to fallback if direct skill endpoint returns differently
      }

      if (!deleted) {
        // Fallback to updateProfile if skills are handled as an array on profile
        const remaining = profile.skills.filter((s) => s !== skillToRemove);
        await studentService.updateProfile({ skills: remaining as any });
      }

      await refreshProfileData();
      showToast(`Removed skill "${skillToRemove}"`);
    } catch (err) {
      showToast(getErrorMessage(err, `Failed to remove skill "${skillToRemove}"`), "error");
    }
  };

  // ===================== RESUME HANDLERS =====================
  const handleResumeReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF document (max 5 MB).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("PDF file size must be less than 5 MB.", "error");
      return;
    }

    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev === null || prev >= 90 ? prev : prev + 25));
    }, 150);

    try {
      await studentService.uploadResumeFile(file);
      clearInterval(interval);
      setUploadProgress(100);
      await refreshProfileData();
      showToast("Resume uploaded to Cloudflare R2 successfully!");
    } catch (err) {
      clearInterval(interval);
      showToast(getErrorMessage(err, "Failed to upload resume to Cloudflare R2"), "error");
    } finally {
      setTimeout(() => setUploadProgress(null), 500);
    }
  };

  const handleViewResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (profile.resumeId) {
      try {
        const result = await studentService.getResumeDownloadUrl(profile.resumeId);
        if (result?.downloadUrl) {
          window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
          return;
        }
      } catch (err) {
        showToast(getErrorMessage(err, "Failed to fetch secure resume download link"), "error");
        return;
      }
    }
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
    } else {
      showToast("Please upload a resume first.", "error");
    }
  };

  // ===================== EDUCATION MODAL HANDLERS =====================
  const openAddEducationModal = () => {
    setEduModalMode("add");
    setSelectedEduId(null);
    setEduForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      grade: "",
    });
    setIsEduModalOpen(true);
  };

  const openEditEducationModal = (edu: any) => {
    setEduModalMode("edit");
    setSelectedEduId(edu.id);
    setEduForm({
      institution: edu.institution || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startYear ? `${edu.startYear}-01-01` : "",
      endDate: edu.endYear && edu.endYear !== "Present" ? `${edu.endYear}-01-01` : "",
      isCurrent: edu.endYear === "Present" || Boolean(edu.isCurrent),
      grade: edu.cgpa || edu.grade || "",
    });
    setIsEduModalOpen(true);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) {
      showToast("Institution and Degree are required.", "error");
      return;
    }

    try {
      setIsSavingEdu(true);
      if (eduModalMode === "add") {
        await studentService.addEducation({
          institution: eduForm.institution.trim(),
          degree: eduForm.degree.trim(),
          fieldOfStudy: eduForm.fieldOfStudy.trim() || undefined,
          startDate: eduForm.startDate || undefined,
          endDate: eduForm.isCurrent ? undefined : eduForm.endDate || undefined,
          isCurrent: eduForm.isCurrent,
          grade: eduForm.grade.trim() || undefined,
        });
        showToast("Education added successfully!");
      } else if (selectedEduId) {
        await studentService.updateEducation(selectedEduId, {
          institution: eduForm.institution.trim(),
          degree: eduForm.degree.trim(),
          fieldOfStudy: eduForm.fieldOfStudy.trim() || undefined,
          startDate: eduForm.startDate || undefined,
          endDate: eduForm.isCurrent ? undefined : eduForm.endDate || undefined,
          isCurrent: eduForm.isCurrent,
          grade: eduForm.grade.trim() || undefined,
        });
        showToast("Education updated successfully!");
      }
      setIsEduModalOpen(false);
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to save education"), "error");
    } finally {
      setIsSavingEdu(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await studentService.deleteEducation(id);
      showToast("Education removed successfully!");
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete education"), "error");
    }
  };

  // ===================== EXPERIENCE MODAL HANDLERS =====================
  const openAddExperienceModal = () => {
    setExpModalMode("add");
    setSelectedExpId(null);
    setExpForm({
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setIsExpModalOpen(true);
  };

  const openEditExperienceModal = (exp: any) => {
    setExpModalMode("edit");
    setSelectedExpId(exp.id);
    setExpForm({
      company: exp.company || "",
      title: exp.role || exp.title || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      isCurrent: Boolean(exp.isCurrent) || exp.duration?.toLowerCase().includes("present"),
      description: exp.description || (exp.bullets ? exp.bullets.join("\n") : ""),
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company.trim() || !expForm.title.trim()) {
      showToast("Company name and Title/Role are required.", "error");
      return;
    }

    try {
      setIsSavingExp(true);
      if (expModalMode === "add") {
        await studentService.addExperience({
          company: expForm.company.trim(),
          title: expForm.title.trim(),
          location: expForm.location.trim() || undefined,
          startDate: expForm.startDate || undefined,
          endDate: expForm.isCurrent ? undefined : expForm.endDate || undefined,
          isCurrent: expForm.isCurrent,
          description: expForm.description.trim() || undefined,
        });
        showToast("Experience record added successfully!");
      } else if (selectedExpId) {
        await studentService.updateExperience(selectedExpId, {
          company: expForm.company.trim(),
          title: expForm.title.trim(),
          location: expForm.location.trim() || undefined,
          startDate: expForm.startDate || undefined,
          endDate: expForm.isCurrent ? undefined : expForm.endDate || undefined,
          isCurrent: expForm.isCurrent,
          description: expForm.description.trim() || undefined,
        });
        showToast("Experience record updated successfully!");
      }
      setIsExpModalOpen(false);
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to save experience"), "error");
    } finally {
      setIsSavingExp(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await studentService.deleteExperience(id);
      showToast("Experience record deleted successfully!");
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete experience"), "error");
    }
  };

  // ===================== PROJECT MODAL HANDLERS =====================
  const openAddProjectModal = () => {
    setProjModalMode("add");
    setSelectedProjId(null);
    setProjForm({
      title: "",
      description: "",
      projectUrl: "",
      repoUrl: "",
      startDate: "",
      endDate: "",
      technologies: "",
    });
    setIsProjModalOpen(true);
  };

  const openEditProjectModal = (proj: any) => {
    setProjModalMode("edit");
    setSelectedProjId(proj.id);
    setProjForm({
      title: proj.title || "",
      description: proj.description || "",
      projectUrl: proj.link || proj.projectUrl || "",
      repoUrl: proj.repoUrl || "",
      startDate: proj.startDate || "",
      endDate: proj.endDate || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : "",
    });
    setIsProjModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title.trim()) {
      showToast("Project title is required.", "error");
      return;
    }

    try {
      setIsSavingProj(true);
      const techArray = projForm.technologies
        ? projForm.technologies.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      if (projModalMode === "add") {
        await studentService.addProject({
          title: projForm.title.trim(),
          description: projForm.description.trim(),
          projectUrl: projForm.projectUrl.trim() || undefined,
          repoUrl: projForm.repoUrl.trim() || undefined,
          startDate: projForm.startDate || undefined,
          endDate: projForm.endDate || undefined,
          technologies: techArray,
        });
        showToast("Project added successfully!");
      } else if (selectedProjId) {
        await studentService.updateProject(selectedProjId, {
          title: projForm.title.trim(),
          description: projForm.description.trim(),
          projectUrl: projForm.projectUrl.trim() || undefined,
          repoUrl: projForm.repoUrl.trim() || undefined,
          startDate: projForm.startDate || undefined,
          endDate: projForm.endDate || undefined,
          technologies: techArray,
        });
        showToast("Project updated successfully!");
      }
      setIsProjModalOpen(false);
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to save project"), "error");
    } finally {
      setIsSavingProj(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await studentService.deleteProject(id);
      showToast("Project deleted successfully!");
      await refreshProfileData();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete project"), "error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FD] p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1440px] mx-auto text-[#0B1F4B] font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-[13px] animate-in slide-in-from-top-3 border ${
            toast.type === "success"
              ? "bg-[#0B1F4B] border-white/10"
              : "bg-red-700 border-red-500/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-200" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Page Loading - Branded WeGrow Logo Spinner */}
      {isPageLoading && (
        <PageLoader fullScreen={true} />
      )}

      {/* ================= 1. PROFILE HEADER CARD ================= */}
      <section
        id="overview"
        className="bg-white rounded-[16px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          {/* Avatar Photo with file picker */}
          <div className="relative shrink-0">
            <input
              type="file"
              ref={photoFileInputRef}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // Validate format: JPEG, PNG, WebP
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                if (!allowedTypes.includes(file.type)) {
                  showToast("Please upload a valid image (JPEG, PNG, or WebP).", "error");
                  return;
                }

                // Validate max size: 2MB
                if (file.size > 2 * 1024 * 1024) {
                  showToast("Image size must be less than 2 MB.", "error");
                  return;
                }

                // Show local preview immediately before upload completes
                const localPreviewUrl = URL.createObjectURL(file);
                setProfile((prev) => ({
                  ...prev,
                  avatarUrl: localPreviewUrl,
                  avatar: localPreviewUrl,
                  photoUrl: localPreviewUrl,
                }));
                setImageError(false);
                window.dispatchEvent(
                  new CustomEvent("avatarUpdated", {
                    detail: { avatarUrl: localPreviewUrl, avatar: localPreviewUrl, photoUrl: localPreviewUrl },
                  })
                );

                try {
                  showToast("Uploading avatar to storage...");
                  const uploadResult = await studentService.uploadAvatar(file);
                  console.log("[Avatar] uploadAvatar result:", uploadResult);

                  // Extract avatarUrl or avatar according to backend response specs
                  const finalUrl = uploadResult?.avatarUrl || uploadResult?.avatar || localPreviewUrl;

                  // Update local profile state immediately
                  setProfile((prev) => ({
                    ...prev,
                    avatarUrl: finalUrl,
                    avatar: finalUrl,
                    photoUrl: finalUrl,
                  }));
                  setImageError(false);

                  // Update global auth user in localStorage & dispatch event to navbar/header
                  if (typeof window !== "undefined") {
                    try {
                      const userStr = localStorage.getItem("auth_user");
                      if (userStr) {
                        const userObj = JSON.parse(userStr);
                        userObj.avatarUrl = finalUrl;
                        userObj.avatar = finalUrl;
                        userObj.photoUrl = finalUrl;
                        if (userObj.studentProfile) {
                          userObj.studentProfile.avatarUrl = finalUrl;
                          userObj.studentProfile.avatar = finalUrl;
                          userObj.studentProfile.photoUrl = finalUrl;
                        }
                        localStorage.setItem("auth_user", JSON.stringify(userObj));
                      }
                    } catch (e) {
                      console.warn(e);
                    }
                  }

                  window.dispatchEvent(
                    new CustomEvent("avatarUpdated", {
                      detail: { avatarUrl: finalUrl, avatar: finalUrl, photoUrl: finalUrl },
                    })
                  );

                  showToast("Profile avatar uploaded successfully!");
                } catch (err) {
                  showToast(getErrorMessage(err, "Failed to upload avatar"), "error");
                } finally {
                  if (photoFileInputRef.current) photoFileInputRef.current.value = "";
                }
              }}
            />

            {/* Avatar Circle */}
            {(() => {
              const avatarSrc =
                profile.avatarUrl ||
                profile.avatar ||
                profile.photoUrl ||
                (profile.id ? `${API_BASE_URL}/media/avatar/${profile.id}` : "");
              const showImg = Boolean(profile.avatarUrl || profile.avatar || profile.photoUrl) && !imageError;

              return (
                <div
                  onClick={() => photoFileInputRef.current?.click()}
                  className="w-[136px] h-[136px] sm:w-[140px] sm:h-[140px] rounded-full border-4 border-white shadow-[0_8px_24px_rgba(11,31,75,0.12)] overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-[#3B82F6] flex items-center justify-center cursor-pointer group relative"
                  title="Click to upload profile photo from your device"
                >
                  {showImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt={profile.name || "Student Avatar"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const proxyUrl = profile.id ? `${API_BASE_URL}/media/avatar/${profile.id}` : "";
                        if (proxyUrl && e.currentTarget.src !== proxyUrl) {
                          e.currentTarget.src = proxyUrl;
                          return;
                        }
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#1E5BE0] to-[#3B82F6] text-white font-extrabold text-[38px] sm:text-[44px] flex items-center justify-center tracking-wider select-none shadow-inner">
                      {getNameInitials(profile.name)}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Blue camera button */}
            <button
              type="button"
              onClick={() => photoFileInputRef.current?.click()}
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
                {profile.name || "Student"}
              </h1>
              <span className="inline-flex items-center text-[#1E5BE0]" title="Verified Student Profile">
                <CheckCircle2 className="w-5 h-5 fill-[#1E5BE0] text-white" />
              </span>
            </div>

            {/* Tagline / Headline */}
            <p className="text-[15px] sm:text-[16px] text-[#6B7694] font-[500] mt-1 leading-snug">
              {profile.headline || "Job Seeker / Student"}
            </p>

            {/* Meta Row 1 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3 text-[13px] text-[#6B7694]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.location || "Location not specified"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.degreeName || profile.education?.[0]?.degree || "Candidate"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.experienceLevel || "Fresher"}</span>
              </span>
            </div>

            {/* Meta Row 2 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 text-[13px] text-[#6B7694]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.email || "No email available"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#1E5BE0]" />
                <span>{profile.phone || "No phone number added"}</span>
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
              {/* Circular SVG Progress Ring */}
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

              {/* Checklist */}
              <div className="space-y-1.5 text-[12px]">
                {(profile.checklist && profile.checklist.length > 0 ? profile.checklist : [
                  { label: "Personal Information", done: Boolean(profile.name && profile.phone) },
                  { label: "Education Details", done: Boolean(profile.education?.length) },
                  { label: "Skills", done: Boolean(profile.skills?.length) },
                  { label: "Add Projects", done: Boolean(profile.projects?.length) },
                  { label: "Upload Resume", done: Boolean(profile.resumeName) },
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.done ? (
                      <div className="w-4 h-4 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className={`font-medium ${item.done ? "text-[#0B1F4B]" : "text-[#6B7694]"}`}>
                      {item.label} {item.countText ? `(${item.countText})` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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

      {/* ================= 2. TABS ROW ================= */}
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

      {/* ================= 3. TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= MAIN COLUMN (lg:col-span-8) ================= */}
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
                  placeholder="Introduce yourself, key strengths, experience and interests..."
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
                    disabled={isSavingSection === "about"}
                    className="px-4 py-2 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8] disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingSection === "about" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingSection === "about" ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[14px] text-[#475569] leading-[1.7]">
                {profile.bio || "No summary provided. Click edit to describe your background and career goals."}
              </p>
            )}
          </div>

          {/* Card 2: Personal Information */}
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
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Headline / Tagline</label>
                    <input
                      type="text"
                      value={personalForm.headline}
                      onChange={(e) => setPersonalForm({ ...personalForm, headline: e.target.value })}
                      placeholder="e.g. Full Stack Developer | Final Year CS"
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
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
                      disabled
                      className="w-full bg-slate-100 text-sm text-[#6B7694] p-2.5 rounded-[10px] border border-[#E3E8F0] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Current Location</label>
                    <input
                      type="text"
                      value={personalForm.location}
                      onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={personalForm.dateOfBirth}
                      onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 focus:border-[#1E5BE0] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7694] block mb-1">Gender</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                      className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                    >
                      <option value="">Select Gender</option>
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
                    disabled={isSavingSection === "personal"}
                    className="px-4 py-2 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8] disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingSection === "personal" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingSection === "personal" ? "Saving..." : "Save Changes"}</span>
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
                      {profile.name || "Not provided"}
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
                      {profile.email || "Not provided"}
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
                      {profile.phone || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white border border-[#E9EDF5] rounded-[12px] p-3.5 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#6B7694] block leading-tight">Current Location</span>
                    <span className="text-[14px] font-[500] text-[#0B1F4B] truncate block mt-0.5">
                      {profile.location || "Not specified"}
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
                      {profile.dateOfBirth
                        ? isNaN(Date.parse(profile.dateOfBirth))
                          ? profile.dateOfBirth
                          : new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                        : "Not specified"}
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
                      {profile.gender || "Not specified"}
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
                onClick={openAddEducationModal}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Vertical timeline */}
            <div className="space-y-4">
              {profile.education.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#6B7694]">
                  No education records found in backend database. Click &ldquo;Add Education&rdquo; to add your degrees.
                </div>
              ) : (
                <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EEF1F7] space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="relative group">
                      <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1E5BE0] ring-4 ring-[#EAF1FF]" />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1 pr-4">
                          <h3 className="font-[600] text-[16px] text-[#0B1F4B] leading-snug">
                            {edu.degree}
                          </h3>
                          <p className="text-[14px] text-[#6B7694] mt-0.5">{edu.institution}</p>
                          <div className="mt-1.5 text-[13px] flex items-center gap-3">
                            <span className="text-[#6B7694]">Grade / CGPA: </span>
                            <span className="font-[700] text-[#0B1F4B]">{edu.cgpa || edu.grade || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="self-start sm:self-auto bg-[#F1F4F9] text-[#0B1F4B] text-[13px] font-medium px-3 py-1 rounded-[8px] shrink-0">
                            {edu.startYear} - {edu.endYear || "Present"}
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditEducationModal(edu)}
                            className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] hover:bg-blue-50 rounded-lg transition"
                            title="Edit Education"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="p-1.5 text-[#6B7694] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Education"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                onClick={openAddProjectModal}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* List of project rows */}
            <div className="divide-y divide-[#EEF1F7]">
              {profile.projects.length === 0 ? (
                <p className="text-xs text-[#6B7694] py-6 text-center">
                  No projects added yet. Click &ldquo;Add Project&rdquo; to showcase your works.
                </p>
              ) : (
                profile.projects.map((proj) => (
                  <div key={proj.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Project Meta Logo / Favicon Box */}
                      <div className="w-[84px] h-[72px] sm:w-[100px] sm:h-[72px] rounded-[10px] border border-[#EEF1F7] overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center p-2 relative group shadow-2xs">
                        {proj.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={proj.thumbnailUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : proj.link || proj.repoUrl ? (
                          (() => {
                            const targetUrl = proj.link || proj.repoUrl || "";
                            try {
                              const parsedDomain = new URL(targetUrl).hostname;
                              const faviconSrc = `https://www.google.com/s2/favicons?domain=${parsedDomain}&sz=128`;
                              return (
                                <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={faviconSrc}
                                    alt={`${proj.title} logo`}
                                    className="w-8 h-8 object-contain rounded-md drop-shadow-xs"
                                    onError={(e) => {
                                      // Fallback on load failure
                                      (e.currentTarget as HTMLElement).style.display = "none";
                                    }}
                                  />
                                  <span className="text-[10px] text-[#6B7694] font-medium truncate max-w-[80px]">
                                    {parsedDomain.replace("www.", "")}
                                  </span>
                                </div>
                              );
                            } catch {
                              return (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                  <Globe className="w-6 h-6 text-[#1E5BE0]" />
                                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Link</span>
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <Briefcase className="w-6 h-6 text-[#6B7694]" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Project</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-[600] text-[15px] text-[#0B1F4B] leading-snug">
                            {proj.title}
                          </h3>
                        </div>
                        <p className="text-[13px] text-[#6B7694] mt-1 leading-relaxed">
                          {proj.description}
                        </p>
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
                      <div className="flex items-center gap-1.5">
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[500] transition inline-flex items-center gap-1"
                          >
                            <span>Live ↗</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(proj)}
                          className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] hover:bg-blue-50 rounded-lg transition"
                          title="Edit Project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-[#6B7694] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {proj.dateText && (
                        <span className="text-[12px] text-[#6B7694]">{proj.dateText}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
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
                onClick={openAddExperienceModal}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Experience</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Experience items */}
            {profile.internships.length === 0 ? (
              <p className="text-xs text-[#6B7694] py-6 text-center">
                No internship or work experience records added yet. Click &ldquo;Add Experience&rdquo; to add your career history.
              </p>
            ) : (
              profile.internships.map((intern) => (
                <div key={intern.id} className="space-y-3 pb-3 border-b border-[#EEF1F7] last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#1E5BE0] shrink-0 overflow-hidden shadow-2xs">
                        {intern.companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={intern.companyLogo}
                            alt={intern.company}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{(intern.company || "C").slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-[700] text-[14px] text-[#0B1F4B]">{intern.company}</div>
                        <h3 className="font-[600] text-[15px] text-[#0B1F4B] leading-snug">
                          {intern.role}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#6B7694] font-medium">
                        {intern.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditExperienceModal(intern)}
                        className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] hover:bg-blue-50 rounded-lg transition"
                        title="Edit Experience"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(intern.id)}
                        className="p-1.5 text-[#6B7694] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {intern.bullets && intern.bullets.length > 1 ? (
                    <ul className="list-disc pl-5 text-[13px] text-[#475569] space-y-1.5">
                      {intern.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : intern.description ? (
                    <p className="text-[13px] text-[#475569] leading-relaxed whitespace-pre-line">
                      {intern.description}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (lg:col-span-4) ================= */}
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
                onClick={() => resumeFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Upload</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {/* Hidden file input */}
            <input
              type="file"
              ref={resumeFileInputRef}
              onChange={handleResumeReplace}
              accept="application/pdf"
              className="hidden"
            />

            {/* File Row */}
            <div className="bg-[#F7F9FC] rounded-[12px] p-3.5 flex items-center gap-3 border border-[#EEF1F7]">
              <div className="w-10 h-10 rounded-lg bg-[#FFEBEB] text-[#EF4444] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-[600] text-[14px] text-[#0B1F4B] truncate">
                  {profile.resumeName || "No resume uploaded yet"}
                </h4>
                <p className="text-[12px] text-[#6B7694] mt-0.5">
                  {profile.resumeUploadDate || "Upload your resume in PDF format (max 5MB)"}
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

            {/* Action buttons */}
            <div className="flex gap-3">
              {Boolean(profile.resumeId || profile.resumeUrl || profile.resumeName) ? (
                <>
                  <button
                    type="button"
                    onClick={handleViewResume}
                    className="flex-1 h-[44px] rounded-[10px] border-[1.5px] border-[#1E5BE0] font-[600] text-[13px] text-[#1E5BE0] hover:bg-blue-50 cursor-pointer flex items-center justify-center transition"
                  >
                    View Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => resumeFileInputRef.current?.click()}
                    className="flex-1 h-[44px] rounded-[10px] bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-[600] text-[13px] flex items-center justify-center transition shadow-xs cursor-pointer"
                  >
                    Replace
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeFileInputRef.current?.click()}
                  className="w-full h-[44px] rounded-[10px] bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-[600] text-[13px] flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload Resume (PDF)</span>
                </button>
              )}
            </div>

            {/* ATS notice - Only show when resume is actually uploaded */}
            {Boolean(profile.resumeId || profile.resumeUrl || profile.resumeName) ? (
              <div className="bg-[#E8F8EF] text-[#1E9E63] text-[13px] rounded-[10px] p-3 flex items-center gap-2.5 font-medium border border-[#22B573]/20">
                <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Your resume is indexed and searchable by recruiters</span>
              </div>
            ) : (
              <div className="bg-[#F8FAFC] text-[#64748B] text-[12px] rounded-[10px] p-3 flex items-center gap-2 border border-slate-200">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Upload a PDF resume to get discovered and apply to jobs</span>
              </div>
            )}
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
              <div className="space-y-2 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Skill name (e.g. Next.js, Node.js, SQL)..."
                    className="flex-1 bg-white text-xs text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:border-[#1E5BE0]"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="bg-white text-xs text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSkillInput(false)}
                    className="px-3 py-1.5 text-xs text-[#6B7694] hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingSkill}
                    onClick={handleAddSkill}
                    className="bg-[#1E5BE0] text-white text-xs px-3.5 py-1.5 rounded-[10px] font-semibold hover:bg-[#1548b8] flex items-center gap-1.5"
                  >
                    {isSubmittingSkill && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>Save Skill</span>
                  </button>
                </div>
              </div>
            )}

            {/* Skill tags */}
            {profile.skills.length === 0 ? (
              <p className="text-xs text-[#6B7694] py-3 text-center">No skills added yet.</p>
            ) : (
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
            )}

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
                onClick={() => setEditingSection(editingSection === "links" ? null : "links")}
                className="inline-flex items-center gap-1.5 border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-[8px] text-[12px] font-[600] transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>{editingSection === "links" ? "Cancel" : "Edit"}</span>
              </button>
            </div>
            <div className="h-[1px] bg-[#EEF1F7]" />

            {editingSection === "links" ? (
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linksForm.linkedin}
                    onChange={(e) => setLinksForm({ ...linksForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={linksForm.github}
                    onChange={(e) => setLinksForm({ ...linksForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={linksForm.portfolio}
                    onChange={(e) => setLinksForm({ ...linksForm, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
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
                    onClick={handleSaveLinks}
                    disabled={isSavingSection === "links"}
                    className="px-3.5 py-1.5 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8] disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingSection === "links" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingSection === "links" ? "Saving..." : "Save Links"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* LinkedIn Row */}
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin}
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
                          {profile.linkedin}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#1E5BE0] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <div className="text-xs text-[#6B7694] py-1">No LinkedIn profile linked.</div>
                )}

                {/* GitHub Row */}
                {profile.github && (
                  <a
                    href={profile.github}
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
                          {profile.github}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#1E5BE0] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}

                {/* Portfolio Row */}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#EEF1F7] hover:border-[#1E5BE0]/40 flex items-center justify-between gap-3 group transition bg-[#FBFDFF]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#1E5BE0] flex items-center justify-center font-bold text-xs shrink-0">
                        WEB
                      </div>
                      <div className="min-w-0">
                        <span className="font-[600] text-[14px] text-[#0B1F4B] block leading-tight group-hover:text-[#1E5BE0] transition-colors">
                          Portfolio Website
                        </span>
                        <span className="text-[12px] text-[#6B7694] truncate block mt-0.5">
                          {profile.portfolio}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#1E5BE0] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            )}
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
                    placeholder="e.g. Frontend Developer, Software Engineer"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Preferred Locations</label>
                  <input
                    type="text"
                    value={careerPrefForm.preferredLocations}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, preferredLocations: e.target.value })}
                    placeholder="e.g. Bangalore, Chennai, Remote"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Employment Type</label>
                  <input
                    type="text"
                    value={careerPrefForm.employmentType}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, employmentType: e.target.value })}
                    placeholder="e.g. Full-Time, Internship"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Expected Salary / CTC</label>
                  <input
                    type="text"
                    value={careerPrefForm.expectedSalary}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, expectedSalary: e.target.value })}
                    placeholder="e.g. ₹6,00,000 - ₹8,00,000 PA"
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Joining Timeline</label>
                  <input
                    type="text"
                    value={careerPrefForm.joiningTimeline}
                    onChange={(e) => setCareerPrefForm({ ...careerPrefForm, joiningTimeline: e.target.value })}
                    placeholder="e.g. Immediate / Within 30 days"
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
                    disabled={isSavingSection === "career"}
                    className="px-3.5 py-1.5 bg-[#1E5BE0] text-white text-xs font-semibold rounded-lg hover:bg-[#1548b8] disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingSection === "career" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingSection === "career" ? "Saving..." : "Save Changes"}</span>
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
                    {profile.careerPreferences?.preferredRoles || "Not specified"}
                  </span>
                </div>

                {/* 2. Preferred Locations */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Preferred Locations</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.preferredLocations || "Not specified"}
                  </span>
                </div>

                {/* 3. Employment Type */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Employment Type</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.employmentType || "Not specified"}
                  </span>
                </div>

                {/* 4. Expected Salary */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Expected Salary</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.expectedSalary || "Not specified"}
                  </span>
                </div>

                {/* 5. Joining Timeline */}
                <div className="py-2.5 last:pb-0 flex items-center justify-between gap-3">
                  <span className="font-[500] text-[#0B1F4B] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#6B7694]" />
                    <span>Joining Timeline</span>
                  </span>
                  <span className="text-[#475569] text-right font-medium">
                    {profile.careerPreferences?.joiningTimeline || "Not specified"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDUCATION MODAL ================= */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-[#EEF1F7]">
              <h3 className="font-bold text-lg text-[#0B1F4B]">
                {eduModalMode === "add" ? "Add Education" : "Edit Education"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEduModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F4F9] text-[#6B7694] hover:text-[#0B1F4B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Institution / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University or Anna University"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Degree / Course *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech / B.E."
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Field of Study / Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={eduForm.fieldOfStudy}
                    onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={eduForm.startDate}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={eduForm.isCurrent}
                    value={eduForm.endDate}
                    onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0] disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="eduCurrent"
                  checked={eduForm.isCurrent}
                  onChange={(e) => setEduForm({ ...eduForm, isCurrent: e.target.checked })}
                  className="rounded border-[#E3E8F0] text-[#1E5BE0] focus:ring-[#1E5BE0]"
                />
                <label htmlFor="eduCurrent" className="font-medium text-[#475569] cursor-pointer">
                  I am currently studying here
                </label>
              </div>

              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Grade / CGPA</label>
                <input
                  type="text"
                  placeholder="e.g. 8.75 CGPA or 85%"
                  value={eduForm.grade}
                  onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEF1F7]">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7694] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdu}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E5BE0] hover:bg-[#1548b8] rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingEdu && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{eduModalMode === "add" ? "Add Education" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EXPERIENCE MODAL ================= */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-[#EEF1F7]">
              <h3 className="font-bold text-lg text-[#0B1F4B]">
                {expModalMode === "add" ? "Add Work Experience" : "Edit Work Experience"}
              </h3>
              <button
                type="button"
                onClick={() => setIsExpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F4F9] text-[#6B7694] hover:text-[#0B1F4B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google or Zoho"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Intern"
                    value={expForm.title}
                    onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, India (or Remote)"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={expForm.startDate}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={expForm.isCurrent}
                    value={expForm.endDate}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0] disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCurrent"
                  checked={expForm.isCurrent}
                  onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                  className="rounded border-[#E3E8F0] text-[#1E5BE0] focus:ring-[#1E5BE0]"
                />
                <label htmlFor="expCurrent" className="font-medium text-[#475569] cursor-pointer">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Description / Key Responsibilities</label>
                <textarea
                  rows={3}
                  placeholder="Summarize your key achievements and responsibilities..."
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEF1F7]">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7694] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingExp}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E5BE0] hover:bg-[#1548b8] rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingExp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{expModalMode === "add" ? "Add Experience" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PROJECT MODAL ================= */}
      {isProjModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-[#EEF1F7]">
              <h3 className="font-bold text-lg text-[#0B1F4B]">
                {projModalMode === "add" ? "Add Project" : "Edit Project"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProjModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F4F9] text-[#6B7694] hover:text-[#0B1F4B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Career Matcher"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What does this project do and what problems does it solve?"
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">Live Demo / Project URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={projForm.projectUrl}
                    onChange={(e) => setProjForm({ ...projForm, projectUrl: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7694] block mb-1">GitHub / Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/myrepo"
                    value={projForm.repoUrl}
                    onChange={(e) => setProjForm({ ...projForm, repoUrl: e.target.value })}
                    className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#6B7694] block mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                  value={projForm.technologies}
                  onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                  className="w-full bg-[#F4F6FA] text-sm text-[#0B1F4B] p-2.5 rounded-[10px] border border-[#E3E8F0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEF1F7]">
                <button
                  type="button"
                  onClick={() => setIsProjModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7694] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProj}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E5BE0] hover:bg-[#1548b8] rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingProj && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{projModalMode === "add" ? "Add Project" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
