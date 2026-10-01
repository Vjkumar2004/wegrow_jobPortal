import apiClient from "./api";
import { StudentProfile, Interview, Job } from "@/types";
import { MOCK_STUDENT_PROFILE, MOCK_INTERVIEWS, MOCK_JOBS } from "@/constants/mockData";

export const studentService = {
  async getProfile(): Promise<StudentProfile> {
    try {
      const response = await apiClient.get("/student/profile");
      return response.data?.data || response.data;
    } catch {
      return MOCK_STUDENT_PROFILE;
    }
  },

  async updateProfile(profileData: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      const response = await apiClient.put("/student/profile", profileData);
      return response.data?.data || response.data;
    } catch {
      return { ...MOCK_STUDENT_PROFILE, ...profileData };
    }
  },

  async getInterviews(): Promise<Interview[]> {
    try {
      const response = await apiClient.get("/student/interviews");
      return response.data?.data || response.data;
    } catch {
      return MOCK_INTERVIEWS;
    }
  },

  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get("/student/saved-jobs");
      return response.data?.data || response.data;
    } catch {
      return [MOCK_JOBS[0], MOCK_JOBS[1]];
    }
  },

  async getReports(): Promise<import("@/types").StudentReportsData> {
    try {
      const response = await apiClient.get("/student/reports");
      return response.data?.data || response.data;
    } catch {
      return {
        summary: {
          totalApplications: 24,
          shortlisted: 9,
          interviews: 6,
          offers: 2,
          successRate: "37.5%",
          profileViews: 148,
          avgResponseDays: 4.2,
        },
        monthlyTrends: [
          { month: "Nov 2025", applied: 3, shortlisted: 1, interviews: 0 },
          { month: "Dec 2025", applied: 5, shortlisted: 2, interviews: 1 },
          { month: "Jan 2026", applied: 7, shortlisted: 3, interviews: 2 },
          { month: "Feb 2026", applied: 6, shortlisted: 2, interviews: 1 },
          { month: "Mar 2026", applied: 8, shortlisted: 4, interviews: 3 },
          { month: "Apr 2026", applied: 4, shortlisted: 2, interviews: 2 },
        ],
        statusFunnel: [
          { stage: "Submitted", count: 24, percentage: 100, color: "#1E5BE0" },
          { stage: "Under Review", count: 18, percentage: 75, color: "#6366F1" },
          { stage: "Shortlisted", count: 9, percentage: 37.5, color: "#FF6B00" },
          { stage: "Interview Calls", count: 6, percentage: 25, color: "#22B573" },
          { stage: "Final Offers", count: 2, percentage: 8.3, color: "#8B5CF6" },
        ],
        domainPerformance: [
          { domain: "Full Stack Web", applications: 11, shortlisted: 5, rate: "45.4%" },
          { domain: "Frontend / React", applications: 7, shortlisted: 3, rate: "42.8%" },
          { domain: "Backend / Node.js", applications: 4, shortlisted: 1, rate: "25.0%" },
          { domain: "Cloud & DevOps", applications: 2, shortlisted: 0, rate: "0.0%" },
        ],
        interviewBreakdown: [
          { type: "Technical Coding", count: 4, color: "#1E5BE0" },
          { type: "System Architecture", count: 2, color: "#FF6B00" },
          { type: "HR & Cultural", count: 3, color: "#22B573" },
          { type: "Managerial Round", count: 2, color: "#8B5CF6" },
        ],
        topSkillsDemand: [
          { skill: "React.js", matchCount: 16, percentage: 67 },
          { skill: "Node.js & Express", matchCount: 14, percentage: 58 },
          { skill: "TypeScript", matchCount: 12, percentage: 50 },
          { skill: "MongoDB / SQL", matchCount: 11, percentage: 46 },
          { skill: "Tailwind CSS", matchCount: 9, percentage: 38 },
        ],
      };
    }
  },

  async getDashboardData(): Promise<import("@/types").StudentDashboardData> {
    try {
      const response = await apiClient.get("/student/dashboard");
      if (response.data?.data) {
        return response.data.data;
      }
      if (response.data) {
        return response.data;
      }
    } catch {
      // Graceful fallback to verified mock structure when backend is not running
    }

    return {
      student: {
        id: "stu-1",
        name: "Vijayakumar M",
        email: "vijayakumar.m@example.com",
        course: "B.E Computer Science",
        college: "WeGrow Skill Campus",
      },
      stats: {
        jobsApplied: 24,
        jobsAppliedTrend: "+4 this month",
        interviews: 8,
        interviewsTrend: "+2 this month",
        shortlisted: 5,
        shortlistedTrend: "+3 this month",
        offers: 1,
        offersTrend: "+1 this month",
      },
      profileCompletion: {
        percentage: 75,
        checklist: [
          { label: "Personal Information", done: true },
          { label: "Education Details", done: true },
          { label: "Add Skills", done: true },
          { label: "Upload Resume", done: true },
          { label: "Add Projects", done: false },
        ],
      },
      applicationStatus: [
        { name: "Under Review", value: 10, color: "#1E5BE0" },
        { name: "Shortlisted", value: 5, color: "#FF6B00" },
        { name: "Interview", value: 8, color: "#22B573" },
        { name: "Rejected", value: 1, color: "#8B5CF6" },
      ],
      applicationTrends: [
        { month: "Apr", applications: 4 },
        { month: "May", applications: 8 },
        { month: "Jun", applications: 7 },
        { month: "Jul", applications: 10 },
        { month: "Aug", applications: 15 },
        { month: "Sep", applications: 19 },
      ],
      recommendedJobs: [
        {
          id: "rec-1",
          title: "Frontend Developer",
          company: {
            id: "comp-zoho",
            name: "Zoho Corporation",
            logo: "",
            location: "Chennai",
          },
          location: "Chennai",
          salaryMin: 400000,
          salaryMax: 700000,
          salaryCurrency: "INR",
          experience: "0-2 Years",
          jobType: "Full Time",
          workMode: "On-site",
          skills: ["React", "JavaScript", "Frontend"],
          description: "Build user-centric web applications with React.",
          responsibilities: ["Develop UI components", "Optimize web performance"],
          requirements: ["0-2 years of experience", "Strong JS/React fundamentals"],
          postedDate: "2026-09-28",
          status: "Published",
        },
        {
          id: "rec-2",
          title: "Software Engineer",
          company: {
            id: "comp-tcs",
            name: "Tata Consultancy Services",
            logo: "",
            location: "Bangalore",
          },
          location: "Bangalore",
          salaryMin: 400000,
          salaryMax: 800000,
          salaryCurrency: "INR",
          experience: "0-2 Years",
          jobType: "Full Time",
          workMode: "Hybrid",
          skills: ["Java", "Spring Boot", "MySQL"],
          description: "Enterprise software development for tier-1 clients.",
          responsibilities: ["Backend services", "Database management"],
          requirements: ["Java knowledge", "Object oriented concepts"],
          postedDate: "2026-09-28",
          status: "Published",
        },
        {
          id: "rec-3",
          title: "UI/UX Designer",
          company: {
            id: "comp-infosys",
            name: "Infosys Limited",
            logo: "",
            location: "Remote",
          },
          location: "Remote",
          salaryMin: 500000,
          salaryMax: 900000,
          salaryCurrency: "INR",
          experience: "1-3 Years",
          jobType: "Full Time",
          workMode: "Remote",
          skills: ["Figma", "UI/UX", "Design"],
          description: "Design sleek, accessible modern interfaces.",
          responsibilities: ["Figma design systems", "User testing"],
          requirements: ["Strong portfolio", "Figma mastery"],
          postedDate: "2026-09-28",
          status: "Published",
        },
      ],
      recentApplications: [
        {
          id: "app-1",
          jobId: "rec-1",
          jobTitle: "Frontend Developer",
          companyName: "Zoho",
          applicantId: "stu-1",
          applicantName: "Vijayakumar M",
          applicantEmail: "vijayakumar.m@example.com",
          appliedDate: "Sep 15, 2026",
          status: "Under Review",
        },
        {
          id: "app-2",
          jobId: "rec-2",
          jobTitle: "Software Engineer",
          companyName: "TCS",
          applicantId: "stu-1",
          applicantName: "Vijayakumar M",
          applicantEmail: "vijayakumar.m@example.com",
          appliedDate: "Sep 12, 2026",
          status: "Shortlisted",
        },
        {
          id: "app-3",
          jobId: "rec-infosys",
          jobTitle: "React Developer",
          companyName: "Infosys",
          applicantId: "stu-1",
          applicantName: "Vijayakumar M",
          applicantEmail: "vijayakumar.m@example.com",
          appliedDate: "Sep 10, 2026",
          status: "Interview",
        },
        {
          id: "app-4",
          jobId: "rec-amazon",
          jobTitle: "Software Development Intern",
          companyName: "Amazon",
          applicantId: "stu-1",
          applicantName: "Vijayakumar M",
          applicantEmail: "vijayakumar.m@example.com",
          appliedDate: "Sep 05, 2026",
          status: "Rejected",
        },
      ],
      upcomingInterviews: [
        {
          id: "int-1",
          applicationId: "app-2",
          jobTitle: "Software Engineer",
          companyName: "TCS",
          candidateName: "Vijayakumar M",
          candidateEmail: "vijayakumar.m@example.com",
          date: "Sep 25, 2026",
          time: "10:00 AM",
          type: "Technical",
          status: "Upcoming",
        },
        {
          id: "int-2",
          applicationId: "app-1",
          jobTitle: "Frontend Developer",
          companyName: "Zoho",
          candidateName: "Vijayakumar M",
          candidateEmail: "vijayakumar.m@example.com",
          date: "Sep 28, 2026",
          time: "02:00 PM",
          type: "Screening",
          status: "Upcoming",
        },
      ],
      notifications: [
        {
          id: "notif-1",
          title: "Your application is shortlisted",
          subtitle: "Zoho - Software Engineer",
          timeAgo: "2h ago",
          type: "green",
        },
        {
          id: "notif-2",
          title: "Interview scheduled",
          subtitle: "TCS - Software Engineer",
          timeAgo: "1d ago",
          type: "blue",
        },
        {
          id: "notif-3",
          title: "New job matches available",
          subtitle: "10 new jobs match your profile",
          timeAgo: "2d ago",
          type: "orange",
        },
        {
          id: "notif-4",
          title: "Your application is under review",
          subtitle: "Infosys - React Developer",
          timeAgo: "3d ago",
          type: "purple",
        },
      ],
    };
  },
};
