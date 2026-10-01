import React from "react";
import { applicationsService } from "@/services/applications.service";
import StudentApplicationsClient from "./StudentApplicationsClient";

export const metadata = {
  title: "My Applications | WeGrow Skill Campus",
  description: "Track and manage your applied campus job applications, interview timelines, and hiring progress in one place.",
};

export default async function StudentApplicationsPage() {
  const initialData = await applicationsService.getStudentApplicationsPageData();

  return <StudentApplicationsClient initialData={initialData} />;
}

