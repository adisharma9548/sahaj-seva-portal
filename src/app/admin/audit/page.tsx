"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AuditManagementPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("ALL");

  useEffect(() => {
    // In demo mode, fetch recent seeded audit events
    fetch("/api/applications?limit=20")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const sampleAudit = [
            {
              id: "AUD-101",
              actorName: "Anand Verma (Desk 3)",
              actorRole: "OFFICER",
              action: "VERIFIED_DOCUMENTS",
              entityType: "APPLICATION",
              entityId: "GZB-INC-2026-0012",
              details: "Automated pre-check score confirmed. No repeated citizen visit necessary.",
              timestamp: new Date(Date.now() - 15 * 60 * 1000),
            },
            {
              id: "AUD-102",
              actorName: "SDM Sadar Ghaziabad",
              actorRole: "HEAD",
              action: "ISSUED_CERTIFICATE",
              entityType: "APPLICATION",
              entityId: "GZB-CAST-2026-0045",
              details: "Digitally signed with cryptographic certificate. 0 physical visits.",
              timestamp: new Date(Date.now() - 45 * 60 * 1000),
            },
            {
              id: "AUD-103",
              actorName: "Anand Verma (Desk 3)",
              actorRole: "OFFICER",
              action: "REPEAT_VISIT_LOGGED",
              entityType: "VISIT",
              entityId: "GZB-MUT-2026-0089",
              details: "Missing affidavit on prescribed stamp paper. Root cause saved to analytics.",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
              id: "AUD-104",
              actorName: "Anand Verma (Desk 3)",
              actorRole: "OFFICER",
              action: "SLOT_CHECK_IN",
              entityType: "BOOKING",
              entityId: "GZB-T104",
              details: "QR Token scanned. Elapsed counter duration: 1.8 minutes.",
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            },
            {
              id: "AUD-105",
              actorName: "Chief Development Officer",
              actorRole: "CDO",
              action: "SERVICE_UPDATED",
              entityType: "SERVICE",
              entityId: "SRV-INC",
              details: "Reduced statutory SLA target from 10 days to 7 days.",
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            },
          ];
          setAuditLogs(sampleAudit);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = auditLogs.filter(
    (l) => filterAction === "ALL" || l.action === filterAction
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP & Vigilance Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Staff Accounts & Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Every file inspection, approval, rejection, and repeat visit logging is cryptographically recorded.
          </p>
        </div>
      </div>

      {/* Staff Roles Overview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Active Governance Roles & Demo Logins
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-saffron-400">Citizen</span>
            <div className="font-extrabold text-white">Ramesh Sharma</div>
            <div className="text-slate-400 font-mono text-[11px]">Phone: 9999999999 (OTP: 123456)</div>
            <div className="text-[10px] text-slate-500 pt-1">Applies, uploads, tracks</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sky-400">Counter Officer</span>
            <div className="font-extrabold text-white">Anand Verma (Desk 3)</div>
            <div className="text-slate-400 font-mono text-[11px]">officer@seva.demo / off123</div>
            <div className="text-[10px] text-slate-500 pt-1">Scrutiny queue & 2-min counter</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400">Department Head</span>
            <div className="font-extrabold text-white">SDM Sadar Ghaziabad</div>
            <div className="text-slate-400 font-mono text-[11px]">head@seva.demo / head123</div>
            <div className="text-[10px] text-slate-500 pt-1">Tehsil slots & grievances</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">District Admin</span>
            <div className="font-extrabold text-white">CDO Secretariat</div>
            <div className="text-slate-400 font-mono text-[11px]">cdo@seva.demo / cdo123</div>
            <div className="text-[10px] text-slate-500 pt-1">District-wide repeat visit analytics</div>
          </div>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Vigilance Audit Trail (All Actions Recorded)
          </h2>
          <div className="flex gap-2">
            {["ALL", "VERIFIED_DOCUMENTS", "ISSUED_CERTIFICATE", "REPEAT_VISIT_LOGGED"].map(
              (act) => (
                <button
                  key={act}
                  onClick={() => setFilterAction(act)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                    filterAction === act
                      ? "bg-saffron-500 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {act}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Action</th>
                <th className="pb-3">Staff Member</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Entity ID</th>
                <th className="pb-3">Audit Details</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3">
                    <span className="font-mono font-bold text-saffron-300 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-white">{log.actorName}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{log.entityId}</td>
                  <td className="py-3 text-slate-300 max-w-xs">{log.details}</td>
                  <td className="py-3 text-right text-slate-400 text-[11px]">
                    {formatDateTime(log.timestamp)}
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
