"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Printer,
  FileText,
  Lightbulb,
  Building2,
  RefreshCw,
} from "lucide-react";

export default function InsightsPage() {
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

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Administrative Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Plain-Language Insights & Weekly Executive Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic recommendations to eliminate procedural bottlenecks and prevent repeat citizen visits.
          </p>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-saffron-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Weekly Report PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Weekly Executive Report Header */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              District Administration Ghaziabad • CDO Secretariat
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              Weekly Service Delivery & Visit Minimization Audit
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              Audit Period: Last 7 Days • Baseline vs Target Benchmark (Problem Statement 9)
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Doc Ref: GZB/CDO/AUDIT/2026-W41</div>
            <div className="text-xs text-emerald-400 font-bold mt-1">Status: CERTIFIED</div>
          </div>
        </div>

        {/* 3 Core Auto-Insights Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Automated Root-Cause Insights & Action Directives
          </h3>

          <div className="space-y-4">
            {data.plainInsights?.map((ins: any, idx: number) => (
              <div
                key={ins.id || idx}
                className={`p-5 rounded-xl border-2 space-y-3 ${
                  ins.type === "CRITICAL"
                    ? "border-red-500/40 bg-red-950/20"
                    : ins.type === "WARNING"
                    ? "border-amber-500/40 bg-amber-950/20"
                    : "border-emerald-500/40 bg-emerald-950/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        ins.type === "CRITICAL"
                          ? "bg-red-500 text-white"
                          : ins.type === "WARNING"
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h4 className="font-extrabold text-sm text-white">{ins.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ins.type === "CRITICAL"
                        ? "bg-red-900 text-red-200"
                        : ins.type === "WARNING"
                        ? "bg-amber-900 text-amber-200"
                        : "bg-emerald-900 text-emerald-200"
                    }`}
                  >
                    {ins.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  {ins.description}
                </p>

                <div className="pl-8 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="font-bold text-saffron-300">Administrative Directive: </span>
                  <span className="text-slate-200">{ins.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Sign-off block for printable report */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <div>Report Generated by Sahaj Seva Portal Engine</div>
            <div className="text-[11px] text-slate-500">Autonomous Ghaziabad Seva First Analytics</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white">Chief Development Officer (CDO)</div>
            <div className="text-slate-500 text-[11px]">District Collectorate Ghaziabad</div>
          </div>
        </div>
      </div>
    </div>
  );
}
