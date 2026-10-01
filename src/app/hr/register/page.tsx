"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authService } from "@/services/auth.service";

export default function HRRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register({
        name,
        email,
        companyName,
        phone,
        password,
        role: "HR",
      });
      router.push("/hr/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#0756A8] flex items-center justify-center text-white shadow-md shadow-[#0756A8]/20">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            WeGrow <span className="text-[#F79400]">Skill Campus</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Employer Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Connect with 50,000+ top engineering & management students.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/90 sm:px-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Recruiter Name"
              required
              placeholder="e.g. Sneha Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Company Name"
              required
              placeholder="e.g. Infosys Technologies"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Corporate Email Address"
              type="email"
              required
              placeholder="sneha@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Contact Phone"
              required
              placeholder="+91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            />

            <Button type="submit" variant="secondary" size="md" className="w-full mt-2 font-bold" isLoading={isLoading}>
              Register Organization
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{" "}
              <Link href="/hr/login" className="font-bold text-[#0756A8] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
