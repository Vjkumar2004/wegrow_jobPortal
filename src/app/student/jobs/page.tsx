import React from "react";
import StudentBrowseJobsClient from "./StudentBrowseJobsClient";
import type { StudentBrowseJobsPageData } from "@/types";

export const metadata = {
  title: "Browse Jobs | WeGrow Skill Campus",
  description: "Explore 512+ verified campus opportunities, tech roles, and internships with top recruiters.",
};

const EMPTY_DATA: StudentBrowseJobsPageData = {
  totalJobsCount: 0,
  jobs: [],
  topCompanies: [],
  latestJobs: [],
  profileCompletion: { percentage: 0, checklist: [] },
};

// Jobs data is fetched client-side via useQuery (auth token available in browser).
// Server-side fetch is skipped because the apiClient cannot attach the JWT on the server.
export default function StudentJobsPage() {
  return <StudentBrowseJobsClient initialData={EMPTY_DATA} />;
}
