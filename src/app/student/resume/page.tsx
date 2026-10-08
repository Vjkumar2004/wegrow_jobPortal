"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Loader2,
  Sparkles,
} from "lucide-react";
import { studentService } from "@/services/student.service";

interface ResumeItem {
  id?: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  createdAt?: string;
}

async function fetchResumeData(): Promise<ResumeItem | null> {
  const list = await studentService.getResumes();
  if (Array.isArray(list) && list.length > 0) {
    const top = list[0];
    return {
      id: top.id,
      fileName: top.fileName || "Resume.pdf",
      fileSize: top.fileSize ? `${(Number(top.fileSize) / (1024 * 1024)).toFixed(2)} MB` : undefined,
      fileUrl: top.fileUrl,
      createdAt: top.createdAt,
    };
  }
  const profile = await studentService.getProfile();
  if (profile.resumeName || profile.resumeUrl || profile.resumeId) {
    return {
      id: profile.resumeId,
      fileName: profile.resumeName || "Resume.pdf",
      fileUrl: profile.resumeUrl,
    };
  }
  return null;
}

export default function StudentResumePage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data: activeResume = null, isLoading } = useQuery<ResumeItem | null>({
    queryKey: ["student-resumes"],
    queryFn: fetchResumeData,
    staleTime: 60_000,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-selected if needed
    e.target.value = "";

    // Client-side validation: PDF only, max 5MB
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF document (max 5 MB).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must not exceed 5 MB.", "error");
      return;
    }

    setIsUploading(true);
    try {
      const res = await studentService.uploadResumeFile(file);
      showToast(res.fileName ? `"${res.fileName}" uploaded to Cloudflare R2 successfully!` : "Resume uploaded successfully!");
      await queryClient.invalidateQueries({ queryKey: ["student-resumes"] });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to upload resume to Cloudflare R2";
      showToast(msg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewOrDownload = async (action: "preview" | "download") => {
    if (!activeResume) {
      showToast("No resume uploaded yet.", "error");
      return;
    }

    setIsDownloading(true);
    try {
      let downloadUrl = activeResume.fileUrl;

      if (activeResume.id) {
        const signRes = await studentService.getResumeDownloadUrl(activeResume.id);
        if (signRes?.downloadUrl) {
          downloadUrl = signRes.downloadUrl;
        }
      }

      if (!downloadUrl) {
        throw new Error("Could not retrieve secure download link.");
      }

      if (action === "preview") {
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.download = activeResume.fileName || "Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch secure resume download URL";
      showToast(msg, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-5xl mx-auto w-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === "success"
              ? "bg-[#0B1F4B] text-white border-blue-400/20"
              : "bg-rose-600 text-white border-rose-300/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" /> Resume Management & CV
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">
          Resume Management
        </h1>
        <p className="text-sm text-[#6B7694] mt-1">
          Keep your CV up to date. Corporate recruiters download this verified Cloudflare R2 document when evaluating your applications.
        </p>
      </div>

      {/* Main Resume Card */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 sm:p-8 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-6">
        {isLoading ? (
          <div className="p-8 text-center text-[#6B7694] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#1E5BE0]" />
            <span>Loading resume details...</span>
          </div>
        ) : activeResume ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#0B1F4B] text-sm truncate">{activeResume.fileName}</h3>
                <p className="text-xs text-[#6B7694]">
                  PDF Document {activeResume.fileSize ? `• ${activeResume.fileSize}` : ""} • Primary Active CV
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleViewOrDownload("preview")}
                disabled={isDownloading}
                className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewOrDownload("download")}
                disabled={isDownloading}
                className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-[#F7F9FD] border border-dashed border-[#EEF1F7]">
            <p className="text-sm font-semibold text-[#0B1F4B]">No resume uploaded yet</p>
            <p className="text-xs text-[#6B7694] mt-1">Upload your primary CV in PDF format (up to 5MB) below.</p>
          </div>
        )}

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-[#EEF1F7] hover:border-[#1E5BE0] transition-colors rounded-[14px] p-8 text-center bg-[#FDFDFE]">
          <input
            type="file"
            id="resume-upload"
            accept="application/pdf"
            disabled={isUploading}
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="resume-upload"
            className={`block space-y-3 ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="w-12 h-12 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B1F4B]">
                {isUploading ? "Uploading to Cloudflare R2..." : "Click to upload or replace resume"}
              </p>
              <p className="text-xs text-[#6B7694] mt-0.5">Strictly PDF only • Maximum 5 MB</p>
            </div>
          </label>
        </div>

        {/* ATS Info Pill */}
        <div className="bg-[#E8F8EF] text-[#1E9E63] text-xs rounded-[10px] p-3 flex items-center gap-2.5 font-medium border border-[#22B573]/20">
          <Sparkles className="w-4 h-4 text-[#22B573] shrink-0" />
          <span>Uploaded resumes are automatically secured in Cloudflare R2 and matched by AI with recruiter job requirements.</span>
        </div>
      </div>
    </div>
  );
}
