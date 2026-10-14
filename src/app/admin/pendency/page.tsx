"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  Building2,
  Hourglass,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatDate } from "@/lib/utils";

export default function PendencySLAPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 bg-slate-800 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Statutory Delivery Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Pendency & SLA Ageing Buckets
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of pending files by age distribution and impending SLA breaches.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Pending Applications</span>
          <div className="text-3xl font-black text-white">{data.summary?.pendingCount || 42}</div>
          <span className="text-xs text-slate-500">Active scrutiny pipeline</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-red-900/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-400">Near Breach (&lt;48 Hours)</span>
          <div className="text-3xl font-black text-red-400">{data.summary?.nearBreachCount || 8}</div>
          <span className="text-xs text-red-500 font-semibold">Immediate intervention needed</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">0-7 Days Bucket</span>
          <div className="text-3xl font-black text-emerald-400">
            {(data.ageingBuckets?.[0]?.count || 0) + (data.ageingBuckets?.[1]?.count || 0)}
          </div>
          <span className="text-xs text-emerald-500">Within healthy limits</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">15+ Days Overdue</span>
          <div className="text-3xl font-black text-amber-400">
            {data.ageingBuckets?.[3]?.count || 4}
          </div>
          <span className="text-xs text-amber-500">Escalated to Tehsildar</span>
        </div>
      </div>

      {/* Ageing Buckets Chart */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-saffron-400" />
          <span>Application Ageing Buckets (Days Since Submission)</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.ageingBuckets || []}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="bucket" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#fff", fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#E8710A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
