"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  FileText,
  Search,
  CheckSquare,
  Send,
  Clock,
  Bell,
  HelpCircle,
  Download,
  ShieldCheck,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, loginAs, logout, isDemoMode, toggleDemoMode, setShowJourneyModal } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const citizenNav = [
    { href: "/", label: t.home, icon: FileText },
    { href: "/services", label: t.services, icon: Search },
    { href: "/checklist", label: t.smartChecklist, icon: CheckSquare },
    { href: "/apply", label: t.applyOnline, icon: Send },
    { href: "/track", label: t.trackApp, icon: Clock },
    { href: "/slots", label: t.bookSlot, icon: Layers },
    { href: "/downloads", label: t.downloads, icon: Download },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // If user is filling the form, show ultra-clean distraction-free header
  if (pathname.startsWith("/apply")) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>← मुख्य पृष्ठ (Exit)</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-saffron-500 text-white font-black text-xs flex items-center justify-center">
              सहज
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {lang === "hi" ? "ऑनलाइन आवेदन पत्र" : "Application Form"}
            </span>
          </div>

          <div className="inline-flex rounded-md border border-slate-300 overflow-hidden text-xs">
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-0.5 ${lang === "hi" ? "bg-saffron-500 text-white font-bold" : "bg-white text-slate-600"}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 ${lang === "en" ? "bg-saffron-500 text-white font-bold" : "bg-white text-slate-600"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Govt strip */}
      <div className="bg-navy-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron-500"></span>
            <span>{t.portalSubtitle}</span>
            <span className="hidden sm:inline text-navy-300">|</span>
            <span className="hidden sm:inline text-saffron-200">{t.taglineSub}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo Mode Toggle */}
            <button
              onClick={toggleDemoMode}
              title="Click to toggle demo mode flag"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                isDemoMode
                  ? "bg-saffron-500/20 text-saffron-300 border border-saffron-400/40"
                  : "bg-gray-700 text-gray-300 border border-gray-600"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? "bg-saffron-400 animate-pulse" : "bg-gray-400"}`}></span>
              {isDemoMode ? "DEMO MODE ON (Zero Keys)" : "LIVE MODE"}
            </button>

            {/* Language Switcher */}
            <div className="inline-flex rounded-md border border-navy-500 overflow-hidden text-xs">
              <button
                onClick={() => setLang("hi")}
                className={`px-2 py-0.5 transition-colors ${
                  lang === "hi"
                    ? "bg-saffron-500 text-white font-bold"
                    : "bg-navy-800 text-gray-300 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 transition-colors ${
                  lang === "en"
                    ? "bg-saffron-500 text-white font-bold"
                    : "bg-navy-800 text-gray-300 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-saffron-500/20 group-hover:scale-105 transition-transform">
            सहज
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-navy-800 text-xl tracking-tight leading-tight group-hover:text-saffron-600 transition-colors">
                {t.portalTitle}
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-saffron-100 text-saffron-800 border border-saffron-200">
                Ghaziabad 2026
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Center / Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Simulate Citizen Journey Button */}
          <button
            onClick={() => setShowJourneyModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all animate-pulse"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.simulateJourney}</span>
          </button>

          {/* Quick Staff Portals */}
          <Link
            href="/officer/queue"
            className="px-3 py-1.5 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold text-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-navy-600" />
            <span>{t.officerPortal}</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="px-3 py-1.5 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold text-xs flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-saffron-600" />
            <span>{t.adminDashboard}</span>
          </Link>

          {/* User / Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5 text-gray-600" />
              <span>{user ? user.name.split(" ")[0] : "Demo Login"}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white text-navy-700 font-bold border border-gray-300">
                {user ? user.role : "GUEST"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
                <div className="text-[11px] font-bold text-gray-400 uppercase px-2 py-1">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => {
                    loginAs("citizen");
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-orange-50 text-xs font-medium text-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">Citizen: Ramesh Sharma</div>
                    <div className="text-[10px] text-gray-500">9999999999 (OTP: 123456)</div>
                  </div>
                  {user?.role === "CITIZEN" && <span className="text-saffron-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs("officer");
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs font-medium text-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">Counter Officer: Desk 3</div>
                    <div className="text-[10px] text-gray-500">officer@seva.demo</div>
                  </div>
                  {user?.role === "OFFICER" && <span className="text-navy-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs("head");
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs font-medium text-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">SDM Sadar Ghaziabad</div>
                    <div className="text-[10px] text-gray-500">head@seva.demo</div>
                  </div>
                  {user?.role === "HEAD" && <span className="text-navy-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs("cdo");
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 text-xs font-medium text-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">District Admin (CDO)</div>
                    <div className="text-[10px] text-gray-500">cdo@seva.demo</div>
                  </div>
                  {user?.role === "CDO" && <span className="text-purple-600 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setShowJourneyModal(true)}
            className="p-2 rounded-lg bg-saffron-500 text-white font-bold text-xs"
            title="Simulate Journey"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Citizen Navigation bar */}
      <nav className="bg-navy-50/70 border-t border-navy-100/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {citizenNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-navy-700 text-white shadow-sm"
                      : "text-navy-800 hover:bg-navy-100/80 hover:text-navy-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-saffron-400" : "text-navy-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="h-4 w-px bg-navy-200 mx-1"></div>
            <Link
              href="/notifications"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                pathname === "/notifications"
                  ? "bg-navy-700 text-white"
                  : "text-navy-800 hover:bg-navy-100/80"
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-navy-500" />
              <span>{t.notifications}</span>
            </Link>
            <Link
              href="/grievance"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                pathname === "/grievance"
                  ? "bg-navy-700 text-white"
                  : "text-navy-800 hover:bg-navy-100/80"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-500" />
              <span>{t.grievance}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {citizenNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                    active ? "bg-navy-700 text-white" : "bg-gray-50 text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-saffron-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 text-xs font-semibold text-gray-800 bg-gray-50 rounded-lg"
            >
              <Bell className="w-4 h-4 text-navy-600" />
              <span>{t.notifications}</span>
            </Link>
            <Link
              href="/grievance"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 text-xs font-semibold text-red-700 bg-red-50 rounded-lg"
            >
              <HelpCircle className="w-4 h-4 text-red-600" />
              <span>{t.grievance}</span>
            </Link>
            <div className="flex gap-2 pt-2">
              <Link
                href="/officer/queue"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-navy-100 text-navy-800 text-xs font-bold rounded-lg"
              >
                {t.officerPortal}
              </Link>
              <Link
                href="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-navy-800 text-white text-xs font-bold rounded-lg"
              >
                {t.adminDashboard}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
