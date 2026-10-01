import React from "react";
import { StudentLayout } from "@/layouts/StudentLayout";
import { studentService } from "@/services/student.service";
import StudentProfileClient from "./StudentProfileClient";

export const metadata = {
  title: "My Profile | WeGrow Student",
};

export default async function StudentProfilePage() {
  const profile = await studentService.getProfile();

  return (
    <StudentLayout>
      <StudentProfileClient initialProfile={profile} />
    </StudentLayout>
  );
}
