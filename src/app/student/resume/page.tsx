"use client";

import React, { useState } from "react";
import { FileText, Upload, CheckCircle2, Download, Trash2, Eye, ShieldCheck, Sparkles } from "lucide-react";

export default function StudentResumePage() {
  const [fileName, setFileName] = useState("Vijayakumar_M_Resume_2026.pdf");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-5xl mx-auto w-full">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" /> Resume Builder & CV
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">
          Resume Management
        </h1>
        <p className="text-sm text-[#6B7694] mt-1">
          Keep your CV up to date. Corporate recruiters download this verified document when evaluating your applications.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 bg-[#E8F8F1] text-[#22B573] text-xs font-semibold rounded-[12px] border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> New resume uploaded and parsed successfully!
        </div>
      )}

      {/* Current Active Resume Card */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 sm:p-8 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B1F4B] text-sm">{fileName}</h3>
              <p className="text-xs text-[#6B7694]">PDF Document • 412 KB • Primary Active CV</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              type="button"
              className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-[#EEF1F7] hover:border-[#1E5BE0] transition-colors rounded-[14px] p-8 text-center bg-[#FDFDFE]">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUploadMock}
          />
          <label htmlFor="resume-upload" className="cursor-pointer block space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B1F4B]">Click to upload or drag & drop</p>
              <p className="text-xs text-[#6B7694] mt-0.5">Supports PDF, DOC, DOCX up to 5MB</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
