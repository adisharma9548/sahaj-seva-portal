"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useLanguage } from "@/components/providers/AppProviders";
import {
  ShieldCheck,
  CheckSquare,
  Clock,
  Layers,
  BarChart3,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const officerNav = [
    { href: "/officer/queue", label: "Verification Queue", icon: CheckSquare },
    { href: "/officer/counter", label: "2-Min Counter Mode", icon: Clock },
    { href: "/officer/workload", label: "My Workload & SLA", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Officer Top Bar */}
      <div className="bg-navy-900 text-white border-b border-navy-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-xs flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Citizen Portal</span>
            </Link>
            <span className="text-navy-700">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron-500"></span>
              <span className="font-extrabold text-sm tracking-tight">
                Officer Scrutiny & Counter Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-2.5 py-1 rounded-md bg-navy-800 text-gray-300 border border-navy-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-saffron-400" />
              <span>Officer: <strong>Anand Verma</strong> (Desk 3, Tehsil Sadar)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Strip */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 py-2 overflow-x-auto">
          {officerNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-navy-800 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-saffron-400" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
