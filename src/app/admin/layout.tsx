"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  BarChart3,
  TrendingDown,
  Clock,
  Layers,
  MapPin,
  Sparkles,
  FileText,
  ShieldCheck,
  Printer,
  ArrowLeft,
  Menu,
  X,
  Users,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav = [
    { href: "/admin/analytics", label: "Repeat Visit Analytics", icon: TrendingDown },
    { href: "/admin/pendency", label: "Pendency & SLA Buckets", icon: Clock },
    { href: "/admin/slots", label: "Queue & Slot Capacity", icon: Layers },
    { href: "/admin/map", label: "District Map View", icon: MapPin },
    { href: "/admin/insights", label: "Auto-Insights & Reports", icon: Sparkles },
    { href: "/admin/services", label: "Service Manager", icon: FileText },
    { href: "/admin/audit", label: "User & Audit Logs", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-saffron-400" />
              <span className="hidden sm:inline">Citizen Portal</span>
            </Link>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron-500 animate-pulse"></span>
              <span className="font-extrabold text-sm tracking-tight text-white">
                Ghaziabad District Administration Dashboard (CDO)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="no-print hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron-500/20 hover:bg-saffron-500/30 text-saffron-300 border border-saffron-500/30 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-saffron-400" />
              <span>Export PDF Report</span>
            </button>

            <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-saffron-400">ROLE:</span>
              <span className="font-semibold">{user?.role || "CDO"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block w-64 bg-slate-950/80 border-r border-slate-800/80 p-4 shrink-0 space-y-1.5`}
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2">
            Governance Navigation
          </div>
          {adminNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800/80 px-3 space-y-2 text-[11px] text-slate-400">
            <div className="font-bold text-slate-300">Problem Statement 9 Target:</div>
            <p className="leading-relaxed">
              Reducing average citizen trips from 3.2 down to 1.1 visits. Data updated dynamically from front-desk tokens.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
