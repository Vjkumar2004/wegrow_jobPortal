import React from "react";
import StudentApplicationsClient from "./StudentApplicationsClient";

export const metadata = {
  title: "My Applications | WeGrow Skill Campus",
  description: "Track and manage your applied campus job applications, interview timelines, and hiring progress in one place.",
};

export default function StudentApplicationsPage() {
  return <StudentApplicationsClient />;
}
