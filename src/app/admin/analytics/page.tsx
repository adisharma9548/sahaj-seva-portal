"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingDown,
  Clock,
  Building2,
  AlertTriangle,
  Award,
  RefreshCw,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function RepeatVisitAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = () => {
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
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 bg-slate-800 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const COLORS = ["#E8710A", "#FB923C", "#FDBA74", "#38BDF8", "#34D399"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Problem Statement 9 Core Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Repeat Visit Analytics & Before/After Impact
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry showing office efficiency and root cause breakdown of repeated citizen trips.
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* BEFORE / AFTER HERO COMPARISON PANEL (Required pitch feature) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-extrabold text-white">
            District-Wide Visit Reduction Benchmark
          </h2>
          <span className="text-[11px] text-saffron-300 bg-saffron-950/80 px-2.5 py-1 rounded-full border border-saffron-800/60 font-semibold">
            * Labeled as ILLUSTRATIVE sample data for pitch evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Baseline Without Portal */}
          <div className="bg-slate-900/90 border border-red-500/30 rounded-xl p-4 space-y-1 relative">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
              Without Portal (Baseline)
            </span>
            <div className="text-3xl font-black text-red-400">
              3.2 <span className="text-xs font-normal text-slate-400">Visits Avg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Citizens returned 2-3 times for missing affidavits, unverified bills, and wrong counters.
            </p>
          </div>

          {/* With Sahaj Seva Portal */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 space-y-1 relative">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              With Sahaj Portal (Current)
            </span>
            <div className="text-3xl font-black text-emerald-400">
              1.1 <span className="text-xs font-normal text-slate-400">Visits Avg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Documents pre-checked at home. In-person visits scheduled only when physically required.
            </p>
          </div>

          {/* Repeat Visit Rate */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 space-y-1 relative">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Repeat Visit Rate
            </span>
            <div className="text-3xl font-black text-amber-400">
              {data.summary?.repeatVisitRatePercent || 18}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Down from 68% in legacy unverified queues.
            </p>
          </div>

          {/* Avg Counter Time */}
          <div className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-4 space-y-1 relative">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              Avg Counter Processing
            </span>
            <div className="text-3xl font-black text-sky-400">
              {data.summary?.averageCounterMinutes || 1.8} <span className="text-xs font-normal text-slate-400">Minutes</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              High-speed barcode/token processing at front desks.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Top Reasons for Repeat Visits */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-saffron-400" />
              <span>Top Drivers of Citizen Repeat Visits</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Root causes logged by front-desk counter officers during in-person visits.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topRepeatReasons?.slice(0, 5) || []}
                layout="vertical"
                margin={{ left: 10, right: 20, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="reason"
                  stroke="#94A3B8"
                  fontSize={10}
                  width={140}
                  tickFormatter={(val) => (val.length > 20 ? `${val.slice(0, 20)}...` : val)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#fff", fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#E8710A" radius={[0, 6, 6, 0]}>
                  {data.topRepeatReasons?.slice(0, 5).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Services with Highest Rework */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Repeat Visit Rate by Public Service (%)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies which application categories produce the most friction.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.reworkByService?.slice(0, 5) || []}
                margin={{ left: -10, right: 10, top: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="service"
                  stroke="#94A3B8"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickFormatter={(val) => (val.length > 12 ? `${val.slice(0, 12)}...` : val)}
                />
                <YAxis stroke="#94A3B8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#fff", fontSize: 12 }}
                />
                <Bar dataKey="repeatRate" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Offices Ranked by Efficiency Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-saffron-400" />
              <span>Ghaziabad District Offices Ranked by Efficiency</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked from lowest repeat visit rate to highest rework.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Rank & Office</th>
                <th className="pb-3">Zone / Tehsil</th>
                <th className="pb-3">Total Visits</th>
                <th className="pb-3">Repeat Visits</th>
                <th className="pb-3">Repeat Rate</th>
                <th className="pb-3 text-right">Efficiency Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {data.officePerformance?.map((off: any, idx: number) => (
                <tr key={off.officeId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{off.name}</span>
                  </td>
                  <td className="py-3 text-slate-400">{off.zone}</td>
                  <td className="py-3 font-semibold text-slate-300">{off.totalVisits}</td>
                  <td className="py-3 font-semibold text-amber-400">{off.repeatVisits}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        off.repeatRate <= 15
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : off.repeatRate <= 25
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-red-950 text-red-300 border border-red-800"
                      }`}
                    >
                      {off.repeatRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-mono font-bold text-emerald-400">
                      {off.efficiencyScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
