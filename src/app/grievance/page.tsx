"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  Ticket,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function GrievancePageContent() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const trackingNumberParam = searchParams.get("trackingNumber") || "";

  const [trackingNumber, setTrackingNumber] = useState(trackingNumberParam);
  const [citizenName, setCitizenName] = useState(user?.name || "Ramesh Sharma");
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || "9999999999");
  const [issueCategory, setIssueCategory] = useState("Application stuck beyond statutory SLA");
  const [description, setDescription] = useState(
    "My application has been pending beyond the promised SLA days without a clear status change. Requesting intervention by Sub-Divisional Magistrate."
  );
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  const [existingGrievances, setExistingGrievances] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/grievances")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setExistingGrievances(data.grievances);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber,
          citizenName,
          citizenPhone,
          issueCategory,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedTicket(data.grievance);
        // Refresh list
        fetch("/api/grievances")
          .then((r) => r.json())
          .then((d) => d.success && setExistingGrievances(d.grievances));
      }
    } catch (e) {
      console.error(e);
      alert("Error lodging grievance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SDM Direct Escalation Channel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.grievance}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "यदि आपका आवेदन बिना कारण रुका हुआ है या अधिकारी द्वारा अनावश्यक बुलाया जा रहा है, तो सीधे एसडीएम / विभागाध्यक्ष को शिकायत दर्ज करें।"
            : "If your file is delayed beyond SLA or you were unnecessarily asked to revisit the office, file a direct escalation ticket here. Office heads are mandated to resolve within 48 hours."}
        </p>
      </div>

      {/* Main Form or Ticket Result */}
      {!createdTicket ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <h2 className="text-base font-extrabold text-navy-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-600" />
            <span>Lodge Direct Escalation to SDM / Office Head</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Application Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. GZB-INC-2026-0001"
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Issue Category
              </label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold"
              >
                <option value="Application stuck beyond statutory SLA">
                  Application stuck beyond statutory SLA
                </option>
                <option value="Document rejected without clear reason">
                  Document rejected without clear reason
                </option>
                <option value="Counter delay or unwarranted repeat visit request">
                  Counter delay or unwarranted repeat visit request
                </option>
                <option value="Demanded unofficial paperwork / unnecessary affidavit">
                  Demanded unofficial paperwork / unnecessary affidavit
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Citizen Full Name
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Detailed Grievance Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium"
                placeholder="Explain what happened at the office or why your file is stuck..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Lodging Ticket..." : "Submit Escalation Ticket"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Ticket Lodged Screen */
        <div className="bg-white rounded-2xl border-2 border-red-300 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-xl font-black">
            ✓
          </div>

          <div>
            <div className="text-xs uppercase font-bold text-red-600 tracking-wider">
              Escalation Lodged with Office Head
            </div>
            <h2 className="text-2xl font-black text-navy-900 mt-1">
              Ticket ID: <span className="text-red-700">{createdTicket.ticketNumber}</span>
            </h2>
            <div className="text-xs text-gray-600 mt-1">
              A copy has been routed directly to the Sub-Divisional Magistrate dashboard. Mandatory response within 48 hours.
            </div>
          </div>

          <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-xl text-left text-xs space-y-2 border border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-500">Applicant:</span>
              <span className="font-bold text-navy-900">{createdTicket.citizenName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Subject:</span>
              <span className="font-bold text-red-800">{createdTicket.issueCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-bold text-amber-700 uppercase">{createdTicket.status}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCreatedTicket(null)}
              className="px-5 py-2.5 rounded-xl bg-navy-800 text-white font-bold text-xs"
            >
              Lodge Another Ticket
            </button>
            <Link
              href="/track"
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-800 font-bold text-xs hover:bg-gray-50"
            >
              Back to Tracker
            </Link>
          </div>
        </div>
      )}

      {/* Public Escalation Transparency Log */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">
          Recent District Escalations & Resolutions
        </h3>

        <div className="space-y-2.5">
          {existingGrievances.slice(0, 5).map((grv) => (
            <div
              key={grv.id}
              className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-navy-900">{grv.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      grv.status === "RESOLVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {grv.status}
                  </span>
                </div>
                <div className="text-gray-700 font-medium">{grv.issueCategory}</div>
                {grv.resolutionNotes && (
                  <div className="text-green-700 text-[11px] font-bold">
                    Resolution: {grv.resolutionNotes}
                  </div>
                )}
              </div>

              <div className="text-gray-400 text-[11px] shrink-0">
                {formatDate(grv.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GrievancePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      }
    >
      <GrievancePageContent />
    </Suspense>
  );
}
