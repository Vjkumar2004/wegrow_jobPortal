import React from "react";
import { Settings, Shield, Bell, Lock, KeyRound } from "lucide-react";

export const metadata = {
  title: "Account Settings | WeGrow Student",
};

export default function StudentSettingsPage() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#0B1F4B] tracking-tight">Account Settings</h1>
        <p className="text-xs text-[#6B7694] mt-1">
          Manage your student profile preferences, password credentials, and notifications.
        </p>
      </div>

      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EEF1F7]">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1F4B]">Security & Login</h3>
            <p className="text-xs text-[#6B7694]">Update your registered password and active sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">Registered Email</label>
            <input
              type="email"
              disabled
              defaultValue="vijayakumar.m@example.com"
              className="w-full bg-[#F1F4F9] text-xs text-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">Current Degree Program</label>
            <input
              type="text"
              disabled
              defaultValue="B.E Computer Science"
              className="w-full bg-[#F1F4F9] text-xs text-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
