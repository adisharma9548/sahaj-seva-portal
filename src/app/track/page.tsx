"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Building2,
  Calendar,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  QrCode,
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { formatDate, formatDateTime, maskAadhaar } from "@/lib/utils";

function TrackPageContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [trackingInput, setTrackingInput] = useState(initialId);
  const [currentApp, setCurrentApp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  const searchApplication = (trackingNum: string) => {
    if (!trackingNum.trim()) return;
    setLoading(true);
    setErrorMsg("");

    fetch(`/api/applications/${encodeURIComponent(trackingNum.trim())}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.application) {
          setCurrentApp(data.application);
        } else {
          setErrorMsg(
            lang === "hi"
              ? "आवेदन नहीं मिला। कृपया ट्रैकिंग नंबर की जांच करें (उदा. GZB-INC-2026-0001)।"
              : "Application not found. Please verify tracking number (e.g. GZB-INC-2026-0001)."
          );
          setCurrentApp(null);
        }
      })
      .catch((e) => {
        console.error(e);
        setErrorMsg(
          lang === "hi"
            ? "स्थिति जांच में त्रुटि हुई। कृपया नेटवर्क जांचें।"
            : "Error querying status. Please check your network."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialId) {
      searchApplication(initialId);
    } else {
      // Default to the first seeded or latest application
      fetch("/api/applications?limit=1")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.applications?.length > 0) {
            const first = data.applications[0];
            setTrackingInput(first.trackingNumber);
            searchApplication(first.trackingNumber);
          }
        });
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchApplication(trackingInput);
  };

  // Demo action to advance status
  const handleSimulateStatus = async (
    newStatus: string,
    notes: string,
    issues: string[] = []
  ) => {
    if (!currentApp) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/officer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: currentApp.id,
          status: newStatus,
          officerNotes: notes,
          issues,
          officerName: "Anand Verma (Desk 3)",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessBanner(
          lang === "hi"
            ? `आवेदन स्थिति सफलतापूर्वक अपडेट की गई: ${newStatus}`
            : `Application status updated successfully: ${newStatus}`
        );
        setTimeout(() => setSuccessBanner(""), 5000);
        // Refresh application
        searchApplication(currentApp.trackingNumber);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // 4 Standard Courier-Style Timeline Stages
  const standardStages = [
    {
      key: "SUBMITTED",
      stepNum: 1,
      title: "Submitted & Pre-Checked",
      titleHi: "आवेदन जमा व पूर्व-जाँच",
      activeText: "Submitted & Pre-Checked",
      activeTextHi: "आवेदन जमा व पूर्व-जाँच पूर्ण",
      completedText: "Submitted & Pre-Checked",
      completedTextHi: "आवेदन जमा व पूर्व-जाँच पूर्ण",
    },
    {
      key: "DOCS_VERIFIED",
      stepNum: 2,
      title: "Document Scrutiny",
      titleHi: "दस्तावेज जांच (डेस्क 3)",
      activeText: "Under Scrutiny at Desk 3",
      activeTextHi: "दस्तावेज जांच जारी (डेस्क 3)",
      completedText: "Documents Verified",
      completedTextHi: "दस्तावेज सत्यापित",
    },
    {
      key: "IN_REVIEW",
      stepNum: 3,
      title: "Field Officer Verification",
      titleHi: "लेखपाल / क्षेत्रीय जांच",
      activeText: "With Field Officer (Lekhpal)",
      activeTextHi: "लेखपाल / क्षेत्रीय जांच प्रगति पर",
      completedText: "Field Verification Passed",
      completedTextHi: "क्षेत्रीय जांच स्वीकृत",
    },
    {
      key: "APPROVED",
      stepNum: 4,
      title: "Approval & Issuance",
      titleHi: "स्वीकृति एवं डिजिटल जारी",
      activeText: "Final Digital Sign-off",
      activeTextHi: "अंतिम डिजिटल हस्ताक्षर प्रगति पर",
      completedText: "Approved & Issued with QR",
      completedTextHi: "स्वीकृत एवं डिजिटल QR जारी",
    },
  ];

  const getStageStatus = (stageKey: string) => {
    if (!currentApp) return "pending";
    const status = currentApp.status;

    if (status === "REJECTED") return "rejected";
    if (status === "ACTION_REQUIRED" && stageKey === "DOCS_VERIFIED") return "stuck";

    if (stageKey === "SUBMITTED") return "completed";

    if (stageKey === "DOCS_VERIFIED") {
      if (["DOCS_VERIFIED", "IN_REVIEW", "VISIT_SCHEDULED", "VISIT_COMPLETED", "APPROVED"].includes(status)) {
        return "completed";
      }
      return status === "SUBMITTED" ? "current" : "pending";
    }

    if (stageKey === "IN_REVIEW") {
      if (["IN_REVIEW", "VISIT_SCHEDULED", "VISIT_COMPLETED", "APPROVED"].includes(status)) {
        return "completed";
      }
      return status === "DOCS_VERIFIED" ? "current" : "pending";
    }

    if (stageKey === "APPROVED") {
      if (["APPROVED", "VISIT_COMPLETED"].includes(status)) {
        return "completed";
      }
      return ["IN_REVIEW", "VISIT_SCHEDULED"].includes(status) ? "current" : "pending";
    }

    return "pending";
  };

  // Compute progress bar percentage for connected courier timeline
  const getProgressPercentage = () => {
    if (!currentApp) return 0;
    const status = currentApp.status;
    if (status === "APPROVED" || status === "VISIT_COMPLETED") return 100;
    if (status === "IN_REVIEW" || status === "VISIT_SCHEDULED") return 75;
    if (status === "DOCS_VERIFIED") return 50;
    if (status === "SUBMITTED") return 25;
    if (status === "ACTION_REQUIRED") return 35;
    return 10;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>Live Courier-Style Application Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.trackApp}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "कूरियर जैसा लाइव ट्रैकर: जानिए आपका आवेदन किस अधिकारी की मेज पर है, अपेक्षित पूर्णता तिथि, और कोई अटकाव होने पर घर बैठे समाधान।"
            : "Courier-style live tracking with officer desk transparency, SLA target countdown, and instant at-home defect resolution."}
        </p>

        {/* Input box */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter Application Tracking ID (e.g. GZB-INC-2026-0001)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {successBanner && (
          <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs rounded-xl font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}
      </div>

      {/* Main Application Status Card */}
      {currentApp && (
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Info Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {lang === "hi" ? "आवेदन ट्रैकिंग संख्या" : "Tracking Number"}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-navy-900 flex items-center gap-2">
                <span>{currentApp.trackingNumber}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-navy-50 text-navy-800 border border-navy-200 font-sans">
                  {currentApp.service?.code}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <span className="font-bold text-navy-900">
                  {lang === "hi" ? currentApp.service?.nameHi || currentApp.service?.name : currentApp.service?.name}
                </span>
                {" • "}
                <span>Applied by {currentApp.citizenName} on {formatDate(currentApp.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  currentApp.status === "APPROVED" || currentApp.status === "VISIT_COMPLETED"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm"
                    : currentApp.status === "ACTION_REQUIRED"
                    ? "bg-red-100 text-red-900 border border-red-300 animate-pulse"
                    : "bg-blue-100 text-blue-900 border border-blue-200"
                }`}
              >
                {currentApp.currentStage}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Visit-Ready Score:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentApp.visitReadyScore}% Pre-Checked
                </span>
              </div>
            </div>
          </div>

          {/* CRITICAL ACTION REQUIRED CALLOUT (IF STUCK) */}
          {currentApp.status === "ACTION_REQUIRED" && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base">
                  {lang === "hi"
                    ? "नागरिक द्वारा सुधार आवश्यक — दफ्तर का अनावश्यक चक्कर न लगाएं!"
                    : "Action Required by Citizen — Do NOT Make Unnecessary Office Visits!"}
                </h3>
              </div>
              <p className="text-xs text-red-950 leading-relaxed font-medium">
                <strong>{lang === "hi" ? "अटकने का सटीक कारण:" : "Reason:"}</strong>{" "}
                {currentApp.stuckReasonHi || currentApp.stuckReason || "दस्तावेज जांच में त्रुटि पाई गई।"}
              </p>
              <div className="p-3 bg-white rounded-xl border border-red-200 text-xs text-gray-800">
                <strong>{lang === "hi" ? "घर बैठे कैसे ठीक करें:" : "How to Fix at Home:"}</strong>{" "}
                {currentApp.actionRequiredDetails || "पोर्टल पर नया प्रमाणित दस्तावेज अपलोड करें।"}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/apply?serviceId=${currentApp.serviceId}`}
                  className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-sm"
                >
                  {lang === "hi" ? "सही दस्तावेज अपलोड करें →" : "Upload Correct Document Now →"}
                </Link>
                <Link
                  href={`/grievance?trackingNumber=${currentApp.trackingNumber}`}
                  className="px-4 py-2.5 rounded-xl border border-red-300 text-red-800 hover:bg-red-100 font-bold text-xs"
                >
                  {lang === "hi" ? "एसडीएम को शिकायत दर्ज करें" : "Escalate to SDM / Office Head"}
                </Link>
              </div>
            </div>
          )}

          {/* APPROVED CELEBRATION HERO BANNER */}
          {(currentApp.status === "APPROVED" || currentApp.status === "VISIT_COMPLETED") && (
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-black text-sm sm:text-base">
                      {lang === "hi"
                        ? "🎉 प्रमाण पत्र स्वीकृत एवं डिजिटल जारी हो चुका है!"
                        : "🎉 Certificate Digitally Approved & Ready for Instant Download!"}
                    </h3>
                    <p className="text-xs text-emerald-800">
                      {lang === "hi"
                        ? "0 दफ्तर चक्कर — डिजिटल हस्ताक्षर एवं क्यूआर कोड सत्यापन युक्त।"
                        : "Zero office visits made. Verified with digital signature and public QR verification."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/downloads`}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === "hi" ? "प्रमाण पत्र डाउनलोड (PDF)" : "Download Certificate (PDF)"}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* COURIER-STYLE PROGRESS TIMELINE (WITH CONNECTED HORIZONTAL PROGRESS BAR) */}
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-saffron-600" />
                <span>
                  {lang === "hi" ? "कूरियर जैसा लाइव प्रगति ट्रैकर" : "Courier-Style Progress Timeline"}
                </span>
              </h3>
              <span className="text-[11px] font-bold text-gray-500">
                {currentApp.currentStage}
              </span>
            </div>

            {/* Visual Connected Timeline Bar */}
            <div className="relative pt-2 pb-4">
              {/* Horizontal Connecting Track Behind Nodes */}
              <div className="hidden sm:block absolute top-7 left-8 right-8 h-1.5 bg-gray-200 rounded-full z-0">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* 4 Connected Milestone Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                {standardStages.map((stg) => {
                  const stageStatus = getStageStatus(stg.key);
                  const isCurrent = stageStatus === "current";
                  const isCompleted = stageStatus === "completed";
                  const isStuck = stageStatus === "stuck";

                  return (
                    <div
                      key={stg.key}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                        isCompleted
                          ? "border-emerald-300 bg-emerald-50/70 shadow-sm"
                          : isCurrent
                          ? "border-saffron-400 bg-orange-50/90 shadow-md ring-2 ring-saffron-200"
                          : isStuck
                          ? "border-red-400 bg-red-50/80 shadow-md ring-2 ring-red-200"
                          : "border-gray-200 bg-white opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : isCurrent
                              ? "bg-saffron-100 text-saffron-900"
                              : isStuck
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Step {stg.stepNum}
                        </span>

                        {/* Status Icon */}
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative flex items-center justify-center">
                            <span className="w-5 h-5 rounded-full bg-saffron-500 animate-ping absolute opacity-50"></span>
                            <span className="w-4 h-4 rounded-full bg-saffron-500 relative shadow-sm"></span>
                          </div>
                        ) : isStuck ? (
                          <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-gray-300"></span>
                        )}
                      </div>

                      {/* Descriptive Label depending on whether completed or in-progress */}
                      <div>
                        <div className="font-extrabold text-xs text-navy-900 leading-snug">
                          {isCompleted
                            ? lang === "hi"
                              ? stg.completedTextHi
                              : stg.completedText
                            : isCurrent
                            ? lang === "hi"
                              ? stg.activeTextHi
                              : stg.activeText
                            : lang === "hi"
                            ? stg.titleHi
                            : stg.title}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {isCompleted
                            ? "✓ Completed"
                            : isCurrent
                            ? "⚡ In Progress"
                            : isStuck
                            ? "⚠️ Action Needed"
                            : "○ Pending"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Officer Desk & SLA Transparency Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 text-xs">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-navy-600" />
                <span>Currently Handled By</span>
              </span>
              <div className="font-extrabold text-navy-900 text-sm">
                {currentApp.assignedOfficerName || "Desk 3 - Scrutiny Officer"}
              </div>
              <div className="text-gray-500 text-[11px]">{currentApp.office?.name}</div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-saffron-600" />
                <span>SLA Target Date</span>
              </span>
              <div className="font-extrabold text-navy-900 text-sm">
                {formatDate(currentApp.estimatedCompletionDate)}
              </div>
              <div className="text-emerald-700 text-[11px] font-bold">Under Statutory SLA Time</div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Physical Visits Count</span>
              </span>
              <div className="font-extrabold text-emerald-700 text-sm">
                {currentApp.status === "VISIT_COMPLETED" ? "1 Visit (Completed)" : "0 Visits (Current)"}
              </div>
              <div className="text-gray-500 text-[11px]">Target: Zero repeat rounds</div>
            </div>
          </div>

          {/* Application Events Log */}
          {currentApp.events?.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Official Event Timeline
              </h3>
              <div className="space-y-2.5">
                {currentApp.events.map((evt: any) => (
                  <div key={evt.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-navy-900">
                        {lang === "hi" ? evt.titleHi || evt.title : evt.title}
                      </span>
                      <span className="text-[11px] text-gray-500">{formatDateTime(evt.timestamp)}</span>
                    </div>
                    <p className="text-gray-600">
                      {lang === "hi" ? evt.descriptionHi || evt.description : evt.description}
                    </p>
                    <div className="text-[10px] text-gray-400">
                      Logged by: {evt.actorName} ({evt.deskInfo})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEMO FAST-FORWARD / OFFICER SIMULATOR TOOLBAR */}
          <div className="p-4 bg-orange-50/80 rounded-2xl border-2 border-orange-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-navy-900">
                <Zap className="w-4 h-4 text-saffron-600" />
                <span>
                  {lang === "hi"
                    ? "डेमो अधिकारी सिमुलेटर (Demo Fast-Forward Actions):"
                    : "Demo Officer Simulator (Test Live Tracker Updates):"}
                </span>
              </div>
              <Link
                href="/officer/queue"
                className="text-xs font-bold text-saffron-700 hover:text-saffron-800 hover:underline flex items-center gap-1"
              >
                <span>{lang === "hi" ? "अधिकारी डेस्क खोलें →" : "Open Officer Scrutiny Desk →"}</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleSimulateStatus(
                    "DOCS_VERIFIED",
                    "Documents verified by Desk 3 officer Anand Verma. Passed to Field Lekhpal for record verification."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
              >
                <span>⚡ Step 2: Mark Docs Verified</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleSimulateStatus(
                    "IN_REVIEW",
                    "Lekhpal completed field boundary verification. Submitted report to Nayab Tehsildar."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
              >
                <span>⚡ Step 3: Field Inspection Pass</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleSimulateStatus(
                    "APPROVED",
                    "Final digital signature affixed by Tehsildar. Certificate published with QR validation."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
              >
                <span>🎉 Step 4: Approve & Issue Certificate</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleSimulateStatus(
                    "ACTION_REQUIRED",
                    "Electricity bill attached is older than 90 days. Please upload latest bill copy.",
                    ["Electricity bill expired", "Missing notary stamp"]
                  )
                }
                className="px-3 py-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-700 font-bold text-xs transition-all"
              >
                <span>⚠️ Simulate Defect Flagged</span>
              </button>
            </div>
          </div>

          {/* Quick Help & Escalation */}
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/grievance?trackingNumber=${currentApp.trackingNumber}`}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Application Stuck? Raise Escalation to SDM</span>
            </Link>

            {(currentApp.status === "APPROVED" || currentApp.status === "VISIT_COMPLETED") && (
              <Link
                href="/downloads"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Approved Certificate</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
