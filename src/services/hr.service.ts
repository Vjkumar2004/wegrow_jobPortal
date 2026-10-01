import apiClient from "./api";
import { Job, Application, Interview } from "@/types";
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_INTERVIEWS } from "@/constants/mockData";

export const hrService = {
  async getMyJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get("/hr/jobs");
      return response.data?.data || response.data;
    } catch {
      return MOCK_JOBS;
    }
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await apiClient.post("/hr/jobs", jobData);
      return response.data?.data || response.data;
    } catch {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: jobData.title || "Software Engineer",
        company: {
          id: "comp-1",
          name: "WeGrow Partner Corp",
          location: jobData.location || "Bengaluru",
          logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&auto=format&fit=crop&q=80"
        },
        location: jobData.location || "Bengaluru",
        salaryMin: jobData.salaryMin || 600000,
        salaryMax: jobData.salaryMax || 1000000,
        salaryCurrency: "₹",
        experience: jobData.experience || "1 - 3 yrs",
        jobType: jobData.jobType || "Full Time",
        workMode: jobData.workMode || "Hybrid",
        skills: jobData.skills || ["React", "Node.js"],
        description: jobData.description || "Exciting opportunity to join our expanding tech team.",
        responsibilities: jobData.responsibilities || ["Design modular components", "Write automated tests"],
        requirements: jobData.requirements || ["Degree in computer science or equivalent"],
        postedDate: new Date().toISOString().split("T")[0],
        status: "Published",
        applicantsCount: 0
      };
      return newJob;
    }
  },

  async getApplicants(): Promise<Application[]> {
    try {
      const response = await apiClient.get("/hr/applicants");
      return response.data?.data || response.data;
    } catch {
      return MOCK_APPLICATIONS;
    }
  },

  async getInterviews(): Promise<Interview[]> {
    try {
      const response = await apiClient.get("/hr/interviews");
      return response.data?.data || response.data;
    } catch {
      return MOCK_INTERVIEWS;
    }
  },

  async scheduleInterview(interviewData: Partial<Interview>): Promise<Interview> {
    try {
      const response = await apiClient.post("/hr/interviews", interviewData);
      return response.data?.data || response.data;
    } catch {
      return {
        id: `int-${Date.now()}`,
        applicationId: interviewData.applicationId || "app-1",
        jobTitle: interviewData.jobTitle || "Software Engineer",
        companyName: "WeGrow Partner Corp",
        candidateName: interviewData.candidateName || "Candidate",
        candidateEmail: interviewData.candidateEmail || "candidate@example.com",
        date: interviewData.date || "2024-04-10",
        time: interviewData.time || "11:00 AM",
        type: interviewData.type || "Technical",
        meetingLink: interviewData.meetingLink || "https://meet.google.com/test-room",
        status: "Upcoming",
        notes: interviewData.notes
      };
    }
  },

  async getCompanyProfile() {
    try {
      const response = await apiClient.get("/hr/company");
      return response.data?.data || response.data;
    } catch {
      return {
        name: "Infosys Technologies",
        tagline: "Navigate Your Next",
        industry: "Information Technology & Services",
        website: "https://infosys.com",
        location: "Electronics City, Bengaluru, Karnataka 560100",
        size: "100,000+ employees",
        founded: "1981",
        description: "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 56 countries to navigate their digital transformation."
      };
    }
  },

  async getReports(): Promise<{
    jobsPosted: number;
    totalApplicants: number;
    shortlisted: number;
    interviews: number;
    selectedCandidates: number;
    funnel: Array<{
      stage: string;
      count: number;
    }>;
  }> {
    try {
      const response = await apiClient.get("/hr/reports");
      return response.data?.data || response.data;
    } catch {
      return {
        jobsPosted: 8,
        totalApplicants: 421,
        shortlisted: 54,
        interviews: 22,
        selectedCandidates: 7,
        funnel: [
          { stage: "Applied", count: 421 },
          { stage: "Screened", count: 180 },
          { stage: "Shortlisted", count: 54 },
          { stage: "Interview", count: 22 },
          { stage: "Hired", count: 7 }
        ]
      };
    }
  }
};
