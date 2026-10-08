import React from "react";
import { HRLayout } from "@/layouts/HRLayout";

export default function HRAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HRLayout>{children}</HRLayout>;
}
