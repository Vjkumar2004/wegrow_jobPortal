import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/services/jobs.service";
import JobDetailsClient from "./JobDetailsClient";

interface JobDetailsProps {
  params: Promise<{
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailsProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    return {
      title: "Job Opening Not Found",
      description: "The requested job opening could not be found or may have expired.",
    };
  }

  const title = `${job.title} at ${job.company.name}`;
  const salaryText =
    job.salaryMin && job.salaryMax
      ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
      : job.salaryMin
      ? `From ₹${job.salaryMin.toLocaleString()}`
      : "";
  const description = `${job.title} vacancy at ${job.company.name} in ${job.location}. ${
    salaryText ? `Salary: ${salaryText}. ` : ""
  }Experience: ${job.experience || "Freshers / Any"}. Apply now on WeGrow Jobz.`;
  const canonicalUrl = `https://www.wegrowjobz.com/jobs/${job.id}`;
  const companyLogo = job.company.logo || "https://www.wegrowjobz.com/og-image.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "WeGrow Jobz",
      title: `${title} | WeGrow Jobz`,
      description,
      images: [
        {
          url: companyLogo,
          alt: `${job.company.name} - ${job.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | WeGrow Jobz`,
      description,
      images: [companyLogo],
    },
  };
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    notFound();
  }

  // Google for Jobs structured data
  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job.id,
    },
    datePosted: new Date().toISOString(),
    validThrough: job.deadline ? new Date(job.deadline).toISOString() : undefined,
    employmentType:
      job.jobType?.toUpperCase().includes("FULL")
        ? "FULL_TIME"
        : job.jobType?.toUpperCase().includes("PART")
        ? "PART_TIME"
        : job.jobType?.toUpperCase().includes("INTERN")
        ? "INTERN"
        : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: "https://www.wegrowjobz.com",
      logo: job.company.logo || "https://www.wegrowjobz.com/favicon/web-app-manifest-512x512.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    jobLocationType: job.workMode?.toLowerCase().includes("remote") ? "TELECOMMUTE" : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <JobDetailsClient job={job} />
    </>
  );
}
