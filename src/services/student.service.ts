import apiClient from "./api";
import { StudentProfile, Interview, Job, Application, ApplicationStatus, InterviewType, StudentNotificationItem } from "@/types";
import {
  BackendInterview,
  BackendEducation,
  BackendExperience,
  BackendProject,
  BackendSkill,
  BackendResume,
} from "@/types/api";
import { getCompanyLogoUrl } from "@/lib/utils";
import { mapBackendJobToFrontend } from "./jobs.service";

/**
 * Ensures date is returned as a valid ISO-8601 string or undefined/null.
 * Avoids invalid formats, empty strings "", or unparseable text.
 */
export function toIsoDate(val: unknown): string | undefined {
  if (!val) return undefined;
  if (typeof val !== "string" && !(val instanceof Date)) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;

  // Handle year-only like "2024"
  if (/^\d{4}$/.test(str)) {
    return new Date(`${str}-01-01T00:00:00.000Z`).toISOString();
  }

  // Handle year-month like "2024-05"
  if (/^\d{4}-\d{2}$/.test(str)) {
    return new Date(`${str}-01T00:00:00.000Z`).toISOString();
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export const studentService = {
  /**
   * GET /api/v1/students/me
   */
  async getProfile(): Promise<StudentProfile> {
    try {
      const response = await apiClient.get("/students/me");
      const data = response.data?.data?.student || response.data?.data?.profile || response.data?.data;
      if (data) {
        const rawEducations = data.educations || data.education || [];
        const eduList = rawEducations.map((e: any) => ({
          id: e.id || "",
          degree: e.degree || e.course || "Degree",
          institution: e.institution || e.college || "College",
          startYear: e.startYear ? String(e.startYear) : e.startDate ? String(new Date(e.startDate).getFullYear()) : "",
          endYear: e.endYear ? String(e.endYear) : e.endDate ? String(new Date(e.endDate).getFullYear()) : (e.isCurrent ? "Present" : ""),
          cgpa: e.cgpa ? String(e.cgpa) : e.grade || undefined,
          grade: e.grade || undefined,
        }));

        const rawProjects = data.projects || [];
        const projList = rawProjects.map((p: any) => ({
          id: p.id || "",
          title: p.title || "Project",
          subtitle: p.subtitle || undefined,
          description: p.description || "",
          link: p.projectUrl || p.link || undefined,
          repoUrl: p.githubUrl || p.repoUrl || undefined,
          dateText: p.dateText || (p.startDate ? `${new Date(p.startDate).getFullYear()}` : undefined),
          thumbnailUrl: p.thumbnailUrl || undefined,
          technologies: Array.isArray(p.technologies)
            ? p.technologies
            : typeof p.skills === "string"
            ? p.skills.split(",")
            : typeof p.technologies === "string"
            ? p.technologies.split(",")
            : [],
        }));

        const rawExperiences = data.experiences || data.experience || [];
        const expList = rawExperiences.map((exp: any) => ({
          id: exp.id || "",
          role: exp.title || exp.role || "Intern",
          company: exp.company || "Company",
          location: exp.location || "",
          companyLogo: exp.companyLogo || undefined,
          duration: exp.duration || (exp.startDate && exp.endDate ? `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}` : exp.isCurrent ? "Present" : "Completed"),
          bullets: exp.description ? exp.description.split("\n").filter(Boolean) : [],
          description: exp.description || "",
        }));

        const rawSkills = data.studentSkills || data.skills || [];
        const skillsList = rawSkills
          .map((s: any) => (typeof s === "string" ? s : s.name || s.skill?.name))
          .filter(Boolean);

        const validResumes = (Array.isArray(data.resumes) ? data.resumes : []).filter(
          (r: any) => r && r.fileName !== "Student_Resume_2026.pdf" && !r.fileUrl?.includes("example.com")
        );
        let activeResume = validResumes[0] || (data.resume && data.resume.fileName !== "Student_Resume_2026.pdf" && !data.resume.fileUrl?.includes("example.com") ? data.resume : null);

        const hasResume = Boolean(activeResume && (activeResume.id || activeResume.storageKey));
        const checklist = [
          { label: "Personal Information", done: Boolean(data.fullName && data.phone), countText: "" },
          { label: "Education Details", done: Boolean(eduList.length > 0), countText: "" },
          { label: "Skills", done: Boolean(skillsList.length > 0), countText: `${skillsList.length}/10` },
          { label: "Add Projects", done: Boolean(projList.length > 0), countText: `${projList.length}/2` },
          { label: "Upload Resume", done: hasResume, countText: "" },
        ];
        const doneCount = checklist.filter((c) => c.done).length;
        const completionPercentage = Math.round((doneCount / checklist.length) * 100);

        // Parse personal metadata saved in careerPreferences if present
        const prefObj = (typeof data.careerPreferences === "object" && data.careerPreferences) ? data.careerPreferences : {};
        const savedDob = prefObj.dateOfBirth || (data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "");
        const savedGender = prefObj.gender || data.gender || "";

        return {
          id: data.id || "",
          name: data.fullName || data.name || data.user?.name || "Student",
          email: data.user?.email || data.email || "",
          phone: data.phone || "",
          headline: data.headline || "",
          bio: data.bio || "",
          location: data.location || data.currentLocation || data.city || "",
          dateOfBirth: savedDob,
          gender: savedGender,
          degreeName: eduList[0]?.degree || data.degree || data.branch || "",
          experienceLevel: expList.length > 0 ? `${expList.length} Internships` : "Fresher",
          avatarUrl:
            data.avatarUrl ||
            data.avatar ||
            data.photoUrl ||
            (data.avatarStorageKey && data.id
              ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${data.id}`
              : undefined),
          avatar:
            data.avatarUrl ||
            data.avatar ||
            data.photoUrl ||
            (data.avatarStorageKey && data.id
              ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${data.id}`
              : undefined),
          photoUrl:
            data.avatarUrl ||
            data.avatar ||
            data.photoUrl ||
            (data.avatarStorageKey && data.id
              ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${data.id}`
              : undefined),
          completionPercentage,
          checklist,
          education: eduList,
          skills: skillsList,
          projects: projList,
          internships: expList,
          resumeId: hasResume ? activeResume?.id || undefined : undefined,
          resumeName: hasResume ? activeResume?.fileName || activeResume?.name || "" : "",
          resumeUrl: hasResume ? activeResume?.fileUrl || "" : "",
          resumeUploadDate: hasResume && activeResume?.createdAt ? `Uploaded on ${new Date(activeResume.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "",
          linkedin: data.linkedInUrl || data.linkedinUrl || data.linkedin || "",
          github: data.githubUrl || data.github || "",
          portfolio: data.portfolioUrl || data.portfolio || "",
          careerPreferences: data.careerPreferences || (data.expectedSalary ? {
            preferredRoles: "",
            preferredLocations: "",
            employmentType: "",
            expectedSalary: String(data.expectedSalary),
            joiningTimeline: "",
          } : undefined),
        };
      }
      return {
        id: "",
        name: "Student",
        email: "",
        phone: "",
        headline: "",
        bio: "",
        location: "",
        completionPercentage: 0,
        education: [],
        skills: [],
        projects: [],
        internships: [],
      };
    } catch {
      return {
        id: "",
        name: "Student",
        email: "",
        phone: "",
        headline: "",
        bio: "",
        location: "",
        completionPercentage: 0,
        education: [],
        skills: [],
        projects: [],
        internships: [],
      };
    }
  },

  /**
   * PATCH /api/v1/students/me
   */
  async updateProfile(profileData: Partial<StudentProfile> | Record<string, any>): Promise<any> {
    try {
      // Backend updateStudentProfileSchema is strict: only allows:
      // fullName, phone, headline, bio, location, currentCollege, degree, graduationYear, cgpa, linkedInUrl, githubUrl, portfolioUrl, careerPreferences
      const raw = profileData as Record<string, any>;
      const sanitized: Record<string, any> = {};

      if (raw.fullName !== undefined || raw.name !== undefined) {
        sanitized.fullName = raw.fullName || raw.name;
      }
      if (raw.phone !== undefined) sanitized.phone = raw.phone;
      if (raw.headline !== undefined) sanitized.headline = raw.headline;
      if (raw.bio !== undefined) sanitized.bio = raw.bio;
      if (raw.location !== undefined || raw.currentLocation !== undefined) {
        sanitized.location = raw.location ?? raw.currentLocation;
      }
      if (raw.currentCollege !== undefined) sanitized.currentCollege = raw.currentCollege;
      if (raw.degree !== undefined) sanitized.degree = raw.degree;
      if (raw.graduationYear !== undefined) {
        sanitized.graduationYear = raw.graduationYear ? Number(raw.graduationYear) : null;
      }
      if (raw.cgpa !== undefined) {
        sanitized.cgpa = raw.cgpa ? Number(raw.cgpa) : null;
      }
      if (raw.linkedInUrl !== undefined || raw.linkedin !== undefined || raw.linkedinUrl !== undefined) {
        const val = raw.linkedInUrl ?? raw.linkedinUrl ?? raw.linkedin;
        sanitized.linkedInUrl = val ? val : null;
      }
      if (raw.githubUrl !== undefined || raw.github !== undefined) {
        const val = raw.githubUrl ?? raw.github;
        sanitized.githubUrl = val ? val : null;
      }
      if (raw.portfolioUrl !== undefined || raw.portfolio !== undefined) {
        const val = raw.portfolioUrl ?? raw.portfolio;
        sanitized.portfolioUrl = val ? val : null;
      }

      // Preserve dateOfBirth, gender, and career preferences in careerPreferences Json column
      const existingPrefs = (typeof raw.careerPreferences === "object" && raw.careerPreferences) ? raw.careerPreferences : {};
      const mergedPrefs: Record<string, any> = { ...existingPrefs };

      if (raw.dateOfBirth !== undefined) {
        const isoDob = toIsoDate(raw.dateOfBirth);
        mergedPrefs.dateOfBirth = isoDob || (raw.dateOfBirth ? raw.dateOfBirth : null);
      }
      if (raw.gender !== undefined) {
        mergedPrefs.gender = raw.gender || null;
      }

      if (Object.keys(mergedPrefs).length > 0 || raw.careerPreferences !== undefined) {
        sanitized.careerPreferences = mergedPrefs;
      }

      const response = await apiClient.patch("/students/me", sanitized);
      return response.data?.data?.student || response.data?.data?.profile || response.data?.data;
    } catch (error) {
      throw error;
    }
  },

  // ===================== EDUCATION CRUD (/api/v1/students/me/education) =====================
  /**
   * GET /api/v1/students/me/education
   */
  async getEducation(): Promise<BackendEducation[]> {
    const response = await apiClient.get<{ success: boolean; data: { education?: BackendEducation[]; items?: BackendEducation[] } | BackendEducation[] }>("/students/me/education");
    const d = response.data?.data;
    if (Array.isArray(d)) return d;
    return d?.education || d?.items || [];
  },

  /**
   * POST /api/v1/students/me/education
   */
  async addEducation(payload: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    grade?: string;
  }): Promise<BackendEducation> {
    const formatted: Record<string, any> = {
      institution: payload.institution,
      degree: payload.degree,
      fieldOfStudy: payload.fieldOfStudy || undefined,
      grade: payload.grade || undefined,
      isCurrent: Boolean(payload.isCurrent),
    };
    const sDate = toIsoDate(payload.startDate);
    if (sDate) formatted.startDate = sDate;

    if (payload.isCurrent) {
      formatted.endDate = null;
    } else {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? null;
    }

    const response = await apiClient.post("/students/me/education", formatted);
    return response.data?.data?.education || response.data?.data;
  },

  /**
   * PATCH /api/v1/students/me/education/:id
   */
  async updateEducation(id: string, payload: Partial<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    grade?: string;
  }>): Promise<BackendEducation> {
    const formatted: Record<string, any> = { ...payload };
    if (payload.startDate !== undefined) {
      const sDate = toIsoDate(payload.startDate);
      if (sDate) formatted.startDate = sDate;
    }
    if (payload.isCurrent !== undefined) {
      if (payload.isCurrent) {
        formatted.endDate = null;
      } else if (payload.endDate !== undefined) {
        const eDate = toIsoDate(payload.endDate);
        formatted.endDate = eDate ?? null;
      }
    } else if (payload.endDate !== undefined) {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? null;
    }
    const response = await apiClient.patch(`/students/me/education/${id}`, formatted);
    return response.data?.data?.education || response.data?.data;
  },

  /**
   * DELETE /api/v1/students/me/education/:id
   */
  async deleteEducation(id: string): Promise<boolean> {
    await apiClient.delete(`/students/me/education/${id}`);
    return true;
  },

  // ===================== EXPERIENCE CRUD (/api/v1/students/me/experience) =====================
  /**
   * GET /api/v1/students/me/experience
   */
  async getExperience(): Promise<BackendExperience[]> {
    const response = await apiClient.get<{ success: boolean; data: { experiences?: BackendExperience[]; experience?: BackendExperience[]; items?: BackendExperience[] } | BackendExperience[] }>("/students/me/experience");
    const d = response.data?.data;
    if (Array.isArray(d)) return d;
    return d?.experiences || d?.experience || d?.items || [];
  },

  /**
   * POST /api/v1/students/me/experience
   */
  async addExperience(payload: {
    company: string;
    title: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }): Promise<BackendExperience> {
    const formatted: Record<string, any> = {
      company: payload.company,
      title: payload.title,
      location: payload.location || undefined,
      description: payload.description || undefined,
      isCurrent: Boolean(payload.isCurrent),
    };
    const sDate = toIsoDate(payload.startDate);
    if (sDate) formatted.startDate = sDate;

    if (payload.isCurrent) {
      formatted.endDate = null;
    } else {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? null;
    }

    const response = await apiClient.post("/students/me/experience", formatted);
    return response.data?.data?.experience || response.data?.data;
  },

  /**
   * PATCH /api/v1/students/me/experience/:id
   */
  async updateExperience(id: string, payload: Partial<{
    company: string;
    title: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }>): Promise<BackendExperience> {
    const formatted: Record<string, any> = { ...payload };
    if (payload.startDate !== undefined) {
      const sDate = toIsoDate(payload.startDate);
      if (sDate) formatted.startDate = sDate;
    }
    if (payload.isCurrent !== undefined) {
      if (payload.isCurrent) {
        formatted.endDate = null;
      } else if (payload.endDate !== undefined) {
        const eDate = toIsoDate(payload.endDate);
        formatted.endDate = eDate ?? null;
      }
    } else if (payload.endDate !== undefined) {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? null;
    }
    const response = await apiClient.patch(`/students/me/experience/${id}`, formatted);
    return response.data?.data?.experience || response.data?.data;
  },

  /**
   * DELETE /api/v1/students/me/experience/:id
   */
  async deleteExperience(id: string): Promise<boolean> {
    await apiClient.delete(`/students/me/experience/${id}`);
    return true;
  },

  // ===================== PROJECTS CRUD (/api/v1/students/me/projects) =====================
  /**
   * GET /api/v1/students/me/projects
   */
  async getProjects(): Promise<BackendProject[]> {
    const response = await apiClient.get<{ success: boolean; data: { projects?: BackendProject[]; items?: BackendProject[] } | BackendProject[] }>("/students/me/projects");
    const d = response.data?.data;
    if (Array.isArray(d)) return d;
    return d?.projects || d?.items || [];
  },

  /**
   * POST /api/v1/students/me/projects
   */
  async addProject(payload: {
    title: string;
    description: string;
    projectUrl?: string;
    repoUrl?: string;
    startDate?: string;
    endDate?: string;
    technologies?: string[] | string;
  }): Promise<BackendProject> {
    const formatted: Record<string, any> = { ...payload };
    if (payload.startDate) {
      const sDate = toIsoDate(payload.startDate);
      formatted.startDate = sDate ?? undefined;
    }
    if (payload.endDate) {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? undefined;
    }
    const response = await apiClient.post("/students/me/projects", formatted);
    return response.data?.data?.project || response.data?.data;
  },

  /**
   * PATCH /api/v1/students/me/projects/:id
   */
  async updateProject(id: string, payload: Partial<{
    title: string;
    description: string;
    projectUrl?: string;
    repoUrl?: string;
    startDate?: string;
    endDate?: string;
    technologies?: string[] | string;
  }>): Promise<BackendProject> {
    const formatted: Record<string, any> = { ...payload };
    if (payload.startDate !== undefined) {
      const sDate = toIsoDate(payload.startDate);
      formatted.startDate = sDate ?? null;
    }
    if (payload.endDate !== undefined) {
      const eDate = toIsoDate(payload.endDate);
      formatted.endDate = eDate ?? null;
    }
    const response = await apiClient.patch(`/students/me/projects/${id}`, formatted);
    return response.data?.data?.project || response.data?.data;
  },

  /**
   * DELETE /api/v1/students/me/projects/:id
   */
  async deleteProject(id: string): Promise<boolean> {
    await apiClient.delete(`/students/me/projects/${id}`);
    return true;
  },

  // ===================== SKILLS CRUD (/api/v1/students/me/skills) =====================
  /**
   * GET /api/v1/students/me/skills
   */
  async getSkills(): Promise<BackendSkill[]> {
    const response = await apiClient.get<{ success: boolean; data: { skills?: BackendSkill[]; items?: BackendSkill[] } | BackendSkill[] }>("/students/me/skills");
    const d = response.data?.data;
    if (Array.isArray(d)) return d;
    return d?.skills || d?.items || [];
  },

  /**
   * POST /api/v1/students/me/skills
   */
  async addSkill(payload: {
    name: string;
    proficiencyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  }): Promise<BackendSkill> {
    const response = await apiClient.post("/students/me/skills", payload);
    return response.data?.data?.skill || response.data?.data;
  },

  /**
   * PATCH /api/v1/students/me/skills/:id
   */
  async updateSkill(id: string, payload: {
    proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  }): Promise<BackendSkill> {
    const response = await apiClient.patch(`/students/me/skills/${id}`, payload);
    return response.data?.data?.skill || response.data?.data;
  },

  /**
   * DELETE /api/v1/students/me/skills/:id
   */
  async deleteSkill(id: string): Promise<boolean> {
    await apiClient.delete(`/students/me/skills/${id}`);
    return true;
  },

  // ===================== AVATAR MANAGEMENT (Cloudflare R2) =====================
  /**
   * POST /api/v1/students/me/avatar
   * Body: FormData with key 'file' (JPEG, PNG, WebP | Max: 2MB)
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string; avatar?: string; fileName?: string }> {
    const formData = new FormData();
    formData.append("file", file); // Must be "file"

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { avatarUrl: string; avatar?: string; fileName?: string };
    }>("/students/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const resData = response.data?.data;
    const finalUrl = resData?.avatarUrl || resData?.avatar;

    // Update stored user in localStorage if present
    if (typeof window !== "undefined" && finalUrl) {
      try {
        const userStr = localStorage.getItem("auth_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj) {
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
        }
      } catch (err) {
        console.warn("[uploadAvatar] Failed to update localStorage user:", err);
      }
    }

    return resData;
  },

  /**
   * GET /api/v1/students/me/avatar
   */
  async getAvatarUrl(): Promise<{ downloadUrl: string; expiresIn: number }> {
    const response = await apiClient.get<{
      success: boolean;
      data: { downloadUrl: string; expiresIn: number };
    }>("/students/me/avatar");
    return response.data.data;
  },

  /**
   * DELETE /api/v1/students/me/avatar
   */
  async deleteAvatar(): Promise<boolean> {
    await apiClient.delete("/students/me/avatar");
    return true;
  },

  // ===================== RESUMES CRUD & CLOUDFLARE R2 =====================
  /**
   * POST /api/v1/students/me/resumes/upload
   * Body: FormData with key 'file' (PDF only | Max: 5MB)
   */
  async uploadResumeFile(file: File): Promise<{
    id: string;
    studentId: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        id: string;
        studentId: string;
        fileName: string;
        fileSize: number;
        createdAt: string;
      };
    }>("/students/me/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * GET /api/v1/students/me/resumes/:resumeId/download
   */
  async getResumeDownloadUrl(resumeId: string): Promise<{
    downloadUrl: string;
    expiresIn: number;
    fileName: string;
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        downloadUrl: string;
        expiresIn: number;
        fileName: string;
      };
    }>(`/students/me/resumes/${resumeId}/download`);
    return response.data.data;
  },

  /**
   * GET /api/v1/students/me/resumes
   */
  async getResumes(): Promise<BackendResume[]> {
    const response = await apiClient.get<{ success: boolean; data: { resumes?: BackendResume[]; items?: BackendResume[] } | BackendResume[] }>("/students/me/resumes");
    const d = response.data?.data;
    if (Array.isArray(d)) return d;
    return d?.resumes || d?.items || [];
  },

  /**
   * POST /api/v1/students/me/resumes (legacy metadata creation)
   */
  async addResume(payload: {
    fileUrl: string;
    fileName: string;
    fileSize?: number | string;
    isPrimary?: boolean;
  }): Promise<BackendResume> {
    const response = await apiClient.post("/students/me/resumes", payload);
    return response.data?.data?.resume || response.data?.data;
  },

  /**
   * DELETE /api/v1/students/me/resumes/:id
   */
  async deleteResume(id: string): Promise<boolean> {
    await apiClient.delete(`/students/me/resumes/${id}`);
    return true;
  },

  /**
   * GET /api/v1/students/me/interviews
   */
  async getInterviews(): Promise<Interview[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { items?: BackendInterview[] } | BackendInterview[] }>("/students/me/interviews");
      const rawData = response.data?.data;
      const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);

      if (Array.isArray(items)) {
        return items.map((i: BackendInterview) => {
          const d = new Date(i.scheduledStartAt);
          const comp = (i as any).application?.job?.company || (i as any).company;
          const compId = comp?.id || (i as any).application?.job?.companyId;
          const companyLogo = getCompanyLogoUrl(comp, compId);

          return {
            id: i.id,
            applicationId: i.applicationId,
            jobTitle: i.application?.job?.title || i.title,
            companyName: comp?.name || "Hiring Partner",
            companyLogo: companyLogo || undefined,
            companyId: compId || undefined,
            candidateName: i.application?.student?.fullName || "Student",
            candidateEmail: i.application?.student?.user?.email || "",
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            type: i.type === "HR_DISCUSSION" ? "HR Discussion" : i.type === "MANAGERIAL" ? "Managerial" : i.type === "SCREENING" ? "Screening" : "Technical",
            meetingLink: i.meetingLink || undefined,
            status: (i.status === "SCHEDULED" ? "Upcoming" : i.status === "COMPLETED" ? "Completed" : "Cancelled") as "Upcoming" | "Completed" | "Cancelled",
            notes: i.feedback || undefined,
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/students/me/saved-jobs
   */
  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get("/students/me/saved-jobs");
      const items = response.data?.data?.items || response.data?.data;
      if (Array.isArray(items)) {
        return items.map((sj: any) => {
          const rawJob = sj.job || sj;
          return mapBackendJobToFrontend(rawJob);
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * POST /api/v1/students/me/saved-jobs/:jobId
   */
  async saveJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.post(`/students/me/saved-jobs/${jobId}`);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`saved_job_${jobId}`, "true");
        } catch {}
      }
      return true;
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // Already bookmarked in DB
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`saved_job_${jobId}`, "true");
          } catch {}
        }
        return true;
      }
      console.error("Failed to save job:", err);
      return false;
    }
  },

  /**
   * DELETE /api/v1/students/me/saved-jobs/:jobId
   */
  async removeSavedJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/students/me/saved-jobs/${jobId}`);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(`saved_job_${jobId}`);
        } catch {}
      }
      return true;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Already removed
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem(`saved_job_${jobId}`);
          } catch {}
        }
        return true;
      }
      console.error("Failed to remove saved job:", err);
      return false;
    }
  },

  /**
   * GET student reports
   */
  async getReports(): Promise<import("@/types").StudentReportsData> {
    try {
      const response = await apiClient.get("/students/me/reports");
      if (response.data?.data) {
        return response.data.data;
      }
    } catch {
      // Derive from existing student APIs
    }

    try {
      const [appsRes, interviewsRes, profileRes, jobsRes] = await Promise.all([
        apiClient.get<any>("/students/me/applications").catch(() => null),
        apiClient.get<any>("/students/me/interviews").catch(() => null),
        apiClient.get<any>("/students/me").catch(() => null),
        apiClient.get<any>("/jobs").catch(() => null),
      ]);

      const _appRaw: any = appsRes?.data?.data;
      const appItems: any[] =
        (Array.isArray(_appRaw?.items) ? _appRaw.items : null) ??
        (Array.isArray(_appRaw?.applications) ? _appRaw.applications : null) ??
        (Array.isArray(_appRaw) ? _appRaw : []);

      const _intRaw: any = interviewsRes?.data?.data;
      const interviewItems: any[] =
        (Array.isArray(_intRaw?.items) ? _intRaw.items : null) ??
        (Array.isArray(_intRaw) ? _intRaw : []);

      const profileData: any = profileRes?.data?.data?.profile || profileRes?.data?.data?.student || profileRes?.data?.data;
      const _jobRaw: any = jobsRes?.data?.data;
      const jobItems: any[] =
        (Array.isArray(_jobRaw?.items) ? _jobRaw.items : null) ??
        (Array.isArray(_jobRaw?.jobs) ? _jobRaw.jobs : null) ??
        (Array.isArray(_jobRaw) ? _jobRaw : []);

      const shortlistedCount = appItems.filter((a) =>
        ["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)
      ).length;
      const offersCount = appItems.filter((a) => ["SELECTED", "OFFERED"].includes(a.status)).length;
      const totalApps = appItems.length;
      const successRate = totalApps > 0 ? `${Math.round((shortlistedCount / totalApps) * 100)}%` : "0%";

      // 1. Compute dynamic monthly trends from REAL application and interview dates across 2026
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap = new Map<string, { applied: number; shortlisted: number; interviews: number }>();
      monthNames.forEach((m) => monthlyMap.set(m, { applied: 0, shortlisted: 0, interviews: 0 }));

      appItems.forEach((a) => {
        if (!a.appliedAt) return;
        const d = new Date(a.appliedAt);
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (monthlyMap.has(m)) {
          const entry = monthlyMap.get(m)!;
          entry.applied++;
          if (["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)) {
            entry.shortlisted++;
          }
        }
      });

      interviewItems.forEach((i: any) => {
        const dateStr = i.scheduledStartAt || i.createdAt;
        if (!dateStr) return;
        const d = new Date(dateStr);
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (monthlyMap.has(m)) {
          const entry = monthlyMap.get(m)!;
          entry.interviews++;
        }
      });

      const monthlyTrends = monthNames.map((month) => ({
        month,
        ...monthlyMap.get(month)!,
      }));

      // 2. Compute interview breakdown from REAL interviews
      const interviewCounts: Record<string, number> = {
        "Technical Round": 0,
        "HR Discussion": 0,
        "Coding Assessment": 0,
        "Managerial Round": 0,
      };

      interviewItems.forEach((i: any) => {
        const type = String(i.type || "").toUpperCase();
        if (type.includes("HR") || type === "HR_DISCUSSION") {
          interviewCounts["HR Discussion"]++;
        } else if (type.includes("ASSESS") || type === "ASSESSMENT") {
          interviewCounts["Coding Assessment"]++;
        } else if (type.includes("BEHAVIOR") || type.includes("MANAGE")) {
          interviewCounts["Managerial Round"]++;
        } else {
          interviewCounts["Technical Round"]++;
        }
      });

      const interviewBreakdown = [
        { type: "Technical Round", count: interviewCounts["Technical Round"], color: "#1E5BE0" },
        { type: "HR Discussion", count: interviewCounts["HR Discussion"], color: "#22B573" },
        { type: "Coding Assessment", count: interviewCounts["Coding Assessment"], color: "#FF6B00" },
        { type: "Managerial Round", count: interviewCounts["Managerial Round"], color: "#8B5CF6" },
      ];

      // 3. Compute recruitment funnel from REAL student applications
      const underReviewCount = appItems.filter((a) => ["APPLIED", "UNDER_REVIEW", "SCREENING"].includes(a.status)).length;
      const interviewCount = interviewItems.length || appItems.filter((a) => ["INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)).length;
      const calcPct = (cnt: number) => (totalApps > 0 ? Math.round((cnt / totalApps) * 100) : 0);

      const statusFunnel = [
        { stage: "Submitted", count: totalApps, percentage: totalApps > 0 ? 100 : 0, color: "#1E5BE0" },
        { stage: "Under Review", count: underReviewCount, percentage: calcPct(underReviewCount), color: "#6366F1" },
        { stage: "Shortlisted", count: shortlistedCount, percentage: calcPct(shortlistedCount), color: "#FF6B00" },
        { stage: "Interview Calls", count: interviewCount, percentage: calcPct(interviewCount), color: "#22B573" },
        { stage: "Final Offers", count: offersCount, percentage: calcPct(offersCount), color: "#8B5CF6" },
      ];

      // 4. Compute applied role conversion ONLY for roles actually applied to
      const domainMap = new Map<string, { applied: number; shortlisted: number }>();
      appItems.forEach((a) => {
        const roleTitle = (a.job?.title || a.jobTitle || "Role").trim();
        const current = domainMap.get(roleTitle) || { applied: 0, shortlisted: 0 };
        current.applied++;
        if (["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)) {
          current.shortlisted++;
        }
        domainMap.set(roleTitle, current);
      });

      const domainPerformance = Array.from(domainMap.entries()).map(([domain, val]) => ({
        domain,
        applications: val.applied,
        shortlisted: val.shortlisted,
        rate: val.applied > 0 ? `${Math.round((val.shortlisted / val.applied) * 100)}%` : "0%",
      }));

      // 5. In-demand skills calculated directly from active platform job posts
      const skillDemandMap = new Map<string, number>();
      const totalPublishedJobs = jobItems.length;
      jobItems.forEach((j: any) => {
        const jobSkills = [
          ...(Array.isArray(j.jobSkills) ? j.jobSkills.map((js: any) => js.skill?.name || js.name) : []),
          ...(Array.isArray(j.skills) ? j.skills : []),
        ].filter(Boolean);

        jobSkills.forEach((sk: string) => {
          skillDemandMap.set(sk, (skillDemandMap.get(sk) || 0) + 1);
        });
      });

      const topSkillsDemand = Array.from(skillDemandMap.entries())
        .map(([skill, matchCount]) => ({
          skill,
          matchCount,
          percentage: totalPublishedJobs > 0 ? Math.round((matchCount / totalPublishedJobs) * 100) : 0,
        }))
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 8);

      // 6. Real average turnaround calculation
      let totalDiffDays = 0;
      let matchedCount = 0;
      interviewItems.forEach((i: any) => {
        const app = appItems.find((a) => a.id === i.applicationId);
        if (app?.appliedAt && (i.createdAt || i.scheduledStartAt)) {
          const diffMs = Math.max(0, new Date(i.createdAt || i.scheduledStartAt).getTime() - new Date(app.appliedAt).getTime());
          const days = Math.max(0.1, +(diffMs / (1000 * 60 * 60 * 24)).toFixed(1));
          totalDiffDays += days;
          matchedCount++;
        }
      });
      const avgResponseDays = matchedCount > 0 ? +(totalDiffDays / matchedCount).toFixed(1) : 0;
      const profileViews = typeof profileData?.viewsCount === "number" ? profileData.viewsCount : 0;

      return {
        summary: {
          totalApplications: totalApps,
          shortlisted: shortlistedCount,
          interviews: interviewItems.length,
          offers: offersCount,
          successRate,
          profileViews,
          avgResponseDays,
        },
        monthlyTrends,
        statusFunnel,
        domainPerformance,
        interviewBreakdown,
        topSkillsDemand,
      };
    } catch {
      return {
        summary: {
          totalApplications: 0,
          shortlisted: 0,
          interviews: 0,
          offers: 0,
          successRate: "0%",
          profileViews: 0,
          avgResponseDays: 0,
        },
        monthlyTrends: [
          { month: "May", applied: 0, shortlisted: 0, interviews: 0 },
          { month: "Jun", applied: 0, shortlisted: 0, interviews: 0 },
          { month: "Jul", applied: 0, shortlisted: 0, interviews: 0 },
          { month: "Aug", applied: 0, shortlisted: 0, interviews: 0 },
          { month: "Sep", applied: 0, shortlisted: 0, interviews: 0 },
          { month: "Oct", applied: 0, shortlisted: 0, interviews: 0 },
        ],
        statusFunnel: [],
        domainPerformance: [],
        interviewBreakdown: [],
        topSkillsDemand: [],
      };
    }
  },

  /**
   * GET dashboard data - Computed purely from real backend endpoints.
   * Accepts an optional pre-fetched StudentProfile to avoid a duplicate GET /students/me
   * when the ["student-profile"] React Query cache is already populated.
   */
  async getDashboardData(cachedStudentProfile?: StudentProfile): Promise<import("@/types").StudentDashboardData> {
    try {
      const [profileRes, appsRes, interviewsRes, jobsRes] = await Promise.all([
        cachedStudentProfile
          ? Promise.resolve(null)
          : apiClient.get("/students/me").catch(() => null),
        apiClient.get<any>("/students/me/applications").catch(() => null),
        apiClient.get<any>("/students/me/interviews").catch(() => null),
        apiClient.get<any>("/jobs?limit=6").catch(() => null),
      ]);

      const stu = cachedStudentProfile
        ? {
            id: cachedStudentProfile.id,
            fullName: cachedStudentProfile.name,
            phone: cachedStudentProfile.phone,
            avatarUrl: cachedStudentProfile.avatarUrl || cachedStudentProfile.avatar,
            photoUrl: cachedStudentProfile.photoUrl,
            user: { email: cachedStudentProfile.email },
            educations: cachedStudentProfile.education?.map((e) => ({
              degree: e.degree,
              institution: e.institution,
            })) || [],
            studentSkills: cachedStudentProfile.skills?.map((s) => ({ name: s })) || [],
            resumes: cachedStudentProfile.resumeId ? [{ id: cachedStudentProfile.resumeId }] : [],
            projects: cachedStudentProfile.projects || [],
          }
        : profileRes?.data?.data?.profile || profileRes?.data?.data?.student || profileRes?.data?.data;
      const _appsRaw: any = appsRes?.data?.data;
      const apps: any[] =
        (Array.isArray(_appsRaw?.items) ? _appsRaw.items : null) ??
        (Array.isArray(_appsRaw?.applications) ? _appsRaw.applications : null) ??
        (Array.isArray(_appsRaw) ? _appsRaw : []);
      const _intRaw: any = interviewsRes?.data?.data;
      const interviews: any[] =
        (Array.isArray(_intRaw?.items) ? _intRaw.items : null) ??
        (Array.isArray(_intRaw) ? _intRaw : []);
      const _jobsRaw: any = jobsRes?.data?.data;
      const jobs: any[] =
        (Array.isArray(_jobsRaw?.items) ? _jobsRaw.items : null) ??
        (Array.isArray(_jobsRaw) ? _jobsRaw : []);

      const shortlistedCount = apps.filter((a) => a.status === "SHORTLISTED").length;
      const offersCount = apps.filter((a) => a.status === "SELECTED" || a.status === "OFFERED").length;
      const underReviewCount = apps.filter((a) => a.status === "UNDER_REVIEW" || a.status === "APPLIED").length;
      const rejectedCount = apps.filter((a) => a.status === "REJECTED").length;

      const checklist = [
        { label: "Personal Information", done: Boolean(stu?.fullName || stu?.phone) },
        { label: "Education Details", done: Boolean((stu?.educations || stu?.education)?.length) },
        { label: "Add Skills", done: Boolean((stu?.studentSkills || stu?.skills)?.length) },
        { label: "Upload Resume", done: Boolean(stu?.resumes?.length) },
        { label: "Add Projects", done: Boolean(stu?.projects?.length) },
      ];
      const completedSteps = checklist.filter((c) => c.done).length;
      const completionPercentage = Math.round((completedSteps / checklist.length) * 100);

      const recentApplications: Application[] = apps.slice(0, 5).map((app: any) => {
        const comp = app.job?.company;
        const compId = comp?.id || app.job?.companyId;
        const companyLogo = getCompanyLogoUrl(comp, compId);

        return {
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.job?.title || "Role",
          companyName: comp?.name || "Company",
          companyLogo: companyLogo || undefined,
          applicantId: stu?.id || app.studentId || "student",
          applicantName: stu?.fullName || "Student",
          applicantEmail: stu?.user?.email || "",
          appliedDate: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: (
            app.status === "SHORTLISTED" ? "Shortlisted" :
            app.status === "INTERVIEW" ? "Interview" :
            app.status === "SELECTED" || app.status === "OFFERED" ? "Selected" :
            app.status === "REJECTED" || app.status === "WITHDRAWN" ? "Rejected" :
            "Under Review"
          ) as ApplicationStatus,
        };
      });

      const upcomingInterviews: Interview[] = interviews.slice(0, 5).map((i: any) => {
        const d = new Date(i.scheduledStartAt);
        const comp = i.application?.job?.company || i.company;
        const compId = comp?.id || i.application?.job?.companyId;
        const companyLogo = getCompanyLogoUrl(comp, compId);
        const interviewType: InterviewType = i.type === "HR_DISCUSSION" ? "HR Discussion" : i.type === "MANAGERIAL" ? "Managerial" : i.type === "SCREENING" ? "Screening" : "Technical";
        return {
          id: i.id,
          applicationId: i.applicationId,
          jobTitle: i.application?.job?.title || i.title,
          companyName: comp?.name || "Partner",
          companyLogo: companyLogo || undefined,
          companyId: compId || undefined,
          candidateName: stu?.fullName || "Student",
          candidateEmail: stu?.user?.email || "",
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          type: interviewType,
          meetingLink: i.meetingLink || undefined,
          status: (i.status === "SCHEDULED" ? "Upcoming" : "Completed") as "Upcoming" | "Completed",
        };
      });

      const applicationStatus = [
        { name: "Under Review", value: underReviewCount, color: "#1E5BE0" },
        { name: "Shortlisted", value: shortlistedCount, color: "#FF6B00" },
        { name: "Interview", value: interviews.length, color: "#22B573" },
        { name: "Rejected", value: rejectedCount, color: "#8B5CF6" },
      ];

      // Build dynamic notifications from student's real applications & interviews & company jobs
      const notifications: StudentNotificationItem[] = [];

      for (const i of interviews.slice(0, 3)) {
        const comp = i.application?.job?.company || i.company;
        const compId = comp?.id || i.application?.job?.companyId;
        const compName = comp?.name || "Hiring Partner";
        const logo = getCompanyLogoUrl(comp, compId);
        const d = new Date(i.scheduledStartAt);
        notifications.push({
          id: `notif-int-${i.id}`,
          title: "Interview Scheduled 📅",
          subtitle: `${compName} • ${i.application?.job?.title || i.title || "Assessment"}`,
          message: `Your ${i.type === "HR_DISCUSSION" ? "HR Discussion" : "Technical"} round is set for ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}.`,
          timeAgo: "Upcoming",
          type: "blue",
          companyName: compName,
          companyLogo: logo || undefined,
          companyId: compId || undefined,
          read: false,
        });
      }

      for (const a of apps.slice(0, 4)) {
        const comp = a.job?.company;
        const compId = comp?.id || a.job?.companyId;
        const compName = comp?.name || "Company";
        const logo = getCompanyLogoUrl(comp, compId);
        const title = a.job?.title || "Role";

        if (a.status === "SHORTLISTED") {
          notifications.push({
            id: `notif-app-${a.id}`,
            title: "Application Shortlisted 🎉",
            subtitle: `${compName} • ${title}`,
            message: `Congratulations! ${compName} has shortlisted your profile for ${title}.`,
            timeAgo: "Recently",
            type: "green",
            companyName: compName,
            companyLogo: logo || undefined,
            companyId: compId || undefined,
            read: false,
          });
        } else if (a.status === "SELECTED" || a.status === "OFFERED") {
          notifications.push({
            id: `notif-app-${a.id}`,
            title: "Offer Received! 🌟",
            subtitle: `${compName} • ${title}`,
            message: `${compName} has extended a job offer for ${title}.`,
            timeAgo: "Recent",
            type: "green",
            companyName: compName,
            companyLogo: logo || undefined,
            companyId: compId || undefined,
            read: false,
          });
        } else if (a.status === "REJECTED") {
          notifications.push({
            id: `notif-app-${a.id}`,
            title: "Application Status Update",
            subtitle: `${compName} • ${title}`,
            message: `${compName} has updated the review status of your application.`,
            timeAgo: "Recent",
            type: "purple",
            companyName: compName,
            companyLogo: logo || undefined,
            companyId: compId || undefined,
            read: true,
          });
        } else {
          notifications.push({
            id: `notif-app-${a.id}`,
            title: "Application Under Review",
            subtitle: `${compName} • ${title}`,
            message: `Your application has been received and screening is in progress at ${compName}.`,
            timeAgo: "Recent",
            type: "purple",
            companyName: compName,
            companyLogo: logo || undefined,
            companyId: compId || undefined,
            read: true,
          });
        }
      }

      for (const j of jobs.slice(0, 2)) {
        const compId = j.company?.id || j.companyId;
        const compName = j.company?.name || "Hiring Partner";
        const logo = getCompanyLogoUrl(j.company, compId);
        notifications.push({
          id: `notif-job-${j.id}`,
          title: "New Job Match 🚀",
          subtitle: `${compName} • ${j.title}`,
          message: `${compName} is actively hiring for ${j.title} in ${j.location || "India"}.`,
          timeAgo: "New",
          type: "orange",
          companyName: compName,
          companyLogo: logo || undefined,
          companyId: compId || undefined,
          read: true,
        });
      }

      return {
        student: {
          id: stu?.id || "stu-1",
          name: stu?.fullName || "Student",
          email: stu?.user?.email || "",
          course: (stu?.educations || stu?.education)?.[0]?.degree || "Candidate",
          college: (stu?.educations || stu?.education)?.[0]?.institution || "WeGrow Skill Campus",
          avatarUrl: stu?.avatarUrl || stu?.photoUrl || undefined,
        },
        stats: {
          jobsApplied: apps.length,
          jobsAppliedTrend: `${apps.length} applied`,
          interviews: interviews.length,
          interviewsTrend: `${interviews.length} rounds`,
          shortlisted: shortlistedCount,
          shortlistedTrend: `${shortlistedCount} shortlisted`,
          offers: offersCount,
          offersTrend: `${offersCount} offers`,
        },
        profileCompletion: {
          percentage: completionPercentage,
          checklist,
        },
        applicationStatus,
        applicationTrends: (() => {
          const n = new Date();
          return Array.from({ length: 6 }, (_, i) => {
            const d = new Date(n.getFullYear(), n.getMonth() - (5 - i), 1);
            const label = d.toLocaleString("en-US", { month: "short" });
            const count = apps.filter((a: any) => {
              const ap = new Date(a.appliedAt);
              return ap.getFullYear() === d.getFullYear() && ap.getMonth() === d.getMonth();
            }).length;
            return { month: label, applications: count };
          });
        })(),
        recommendedJobs: jobs.map((j: any) => {
          const compId = j.company?.id || j.companyId;
          const logo = getCompanyLogoUrl(j.company, compId);
          return {
            id: j.id,
            title: j.title,
            company: {
              id: compId || "",
              name: j.company?.name || "Company",
              logo: logo || "",
              location: j.location || "India",
            },
            location: j.location || "India",
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            salaryCurrency: j.salaryCurrency || "INR",
            experience: `${j.minExperience || 0}+ Years`,
            jobType: j.employmentType === "FULL_TIME" ? "Full Time" : "Internship",
            workMode: j.workMode === "REMOTE" ? "Remote" : j.workMode === "HYBRID" ? "Hybrid" : "On-site",
            skills: j.skills?.map((s: any) => s.skill?.name || s.name).filter(Boolean) || [],
            description: j.description || "",
            responsibilities: typeof j.responsibilities === "string" ? j.responsibilities.split("\n") : [],
            requirements: typeof j.requirements === "string" ? j.requirements.split("\n") : [],
            postedDate: new Date(j.createdAt).toLocaleDateString(),
            status: "Published",
          };
        }),
        recentApplications,
        upcomingInterviews,
        notifications,
      };
    } catch {
      return {
        student: {
          id: "stu-1",
          name: "Student",
          email: "",
          course: "",
          college: "WeGrow Skill Campus",
        },
        stats: {
          jobsApplied: 0,
          jobsAppliedTrend: "0 applied",
          interviews: 0,
          interviewsTrend: "0 rounds",
          shortlisted: 0,
          shortlistedTrend: "0 shortlisted",
          offers: 0,
          offersTrend: "0 offers",
        },
        profileCompletion: {
          percentage: 0,
          checklist: [],
        },
        applicationStatus: [],
        applicationTrends: [],
        recommendedJobs: [],
        recentApplications: [],
        upcomingInterviews: [],
        notifications: [],
      };
    }
  },

  /**
   * GET /api/v1/students/me/notifications
   */
  async getNotifications(): Promise<StudentNotificationItem[]> {
    try {
      const res = await apiClient.get<any>("/students/me/notifications");
      const items = res.data?.data?.items || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        return items.map((n: any) => ({
          id: n.id || String(Math.random()),
          title: n.title || "Notification",
          subtitle: n.subtitle || n.companyName || "",
          message: n.message || n.body || "",
          timeAgo: n.timeAgo || "Recently",
          type: n.type || "blue",
          companyName: n.companyName || n.company?.name || undefined,
          companyLogo: getCompanyLogoUrl(n.company, n.companyId || n.company?.id) || undefined,
          companyId: n.companyId || n.company?.id || undefined,
          read: Boolean(n.read || n.isRead),
          linkUrl: n.linkUrl || undefined,
        }));
      }
    } catch {
      // Endpoint not available
    }

    return [];
  },

  /**
   * PATCH /api/v1/students/me/notifications/read-all
   */

  /**
   * GET /api/v1/students/me/notifications unread count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<any>("/students/me/notifications");
      if (typeof res.data?.data?.unreadCount === "number") {
        return res.data.data.unreadCount;
      }
      const items = res.data?.data?.items || res.data?.data;
      if (Array.isArray(items)) {
        return items.filter((n: any) => !n.read && !n.isRead).length;
      }
    } catch {
      // Fallback
    }
    return 0;
  },
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiClient.patch("/students/me/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  },

  /**
   * PATCH /api/v1/students/me/notifications/:id/read
   */
  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/students/me/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  },

};

export default studentService;
