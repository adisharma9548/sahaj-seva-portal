"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function OfficerWorkloadPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkload = () => {
    setLoading(true);
    fetch("/api/applications?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const pending = data.applications.filter(
            (a: any) =>
              a.status === "SUBMITTED" ||
              a.status === "IN_REVIEW" ||
              a.status === "ACTION_REQUIRED"
          );
          setApplications(pending);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWorkload();
  }, []);

  const now = Date.now();

  const getSlaRemainingHours = (estDate: string | Date | null) => {
    if (!estDate) return 72;
    const diff = new Date(estDate).getTime() - now;
    return Math.round(diff / (1000 * 60 * 60));
  };

  const nearBreachCount = applications.filter(
    (a) => getSlaRemainingHours(a.estimatedCompletionDate) <= 48
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">
            My Workload & SLA Timers
          </h1>
          <p className="text-xs text-gray-600">
            Monitor real-time compliance with statutory public service delivery guarantees.
          </p>
        </div>
        <button
          onClick={loadWorkload}
          className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Workload Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Pending Files</span>
          <div className="text-2xl sm:text-3xl font-black text-navy-900">{applications.length}</div>
          <span className="text-xs text-gray-500">Across 8 Tehsils & Zones</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-500">Near SLA Breach (&lt;48h)</span>
          <div className="text-2xl sm:text-3xl font-black text-red-600">{nearBreachCount}</div>
          <span className="text-xs text-red-600 font-semibold">Priority Action Required</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-600">Action Required (Citizen)</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {applications.filter((a) => a.status === "ACTION_REQUIRED").length}
          </div>
          <span className="text-xs text-gray-500">Defect notices issued</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-green-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-green-600">Pre-Checked (&gt;80%)</span>
          <div className="text-2xl sm:text-3xl font-black text-green-700">
            {applications.filter((a) => a.visitReadyScore >= 80).length}
          </div>
          <span className="text-xs text-green-700 font-medium">Ready for fast-track approval</span>
        </div>
      </div>

      {/* Table of Files with SLA Countdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-navy-900">
          Assigned Files & Live SLA Countdown
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No pending files assigned. All statutory deadlines met!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Applicant</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">SLA Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const remainingHours = getSlaRemainingHours(app.estimatedCompletionDate);
                  const isBreach = remainingHours <= 24;
                  const isNearBreach = remainingHours <= 48 && remainingHours > 24;

                  return (
                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-navy-900">
                        {app.trackingNumber}
                      </td>
                      <td className="py-3 font-bold text-gray-800">
                        {app.citizenName}
                      </td>
                      <td className="py-3 text-gray-600">
                        {app.service?.name}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.visitReadyScore >= 80
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.visitReadyScore}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isBreach
                              ? "bg-red-100 text-red-800 animate-pulse border border-red-300"
                              : isNearBreach
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          <Hourglass className="w-3 h-3" />
                          <span>
                            {remainingHours <= 0
                              ? "BREACHED"
                              : remainingHours < 24
                              ? `${remainingHours}h remaining`
                              : `${Math.round(remainingHours / 24)}d remaining`}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/officer/queue"
                          className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
