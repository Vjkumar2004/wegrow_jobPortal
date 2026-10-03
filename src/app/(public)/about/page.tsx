import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | WeGrow Skill Campus – IT Training & Placement in Sivakasi",
  description:
    "WeGrow Skill Campus bridges the gap between education and industry. Learn about our mission, courses, global partnerships, and placement support in Sivakasi & Srivilliputtur.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
