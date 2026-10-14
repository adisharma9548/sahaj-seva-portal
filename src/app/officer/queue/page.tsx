"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  User,
  Clock,
  Send,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function VerificationQueuePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Correction form
  const [selectedDefect, setSelectedDefect] = useState<string>("Electricity bill is older than 90 days");
  const [officerNote, setOfficerNote] = useState<string>("");

  const loadQueue = () => {
    setLoading(true);
    fetch("/api/applications?limit=25")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const queue = data.applications.filter(
            (a: any) =>
              a.status === "SUBMITTED" ||
              a.status === "IN_REVIEW" ||
              a.status === "ACTION_REQUIRED"
          );
          setApplications(queue);
          if (queue.length > 0 && !selectedApp) {
            loadApplicationDetail(queue[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const loadApplicationDetail = (id: string) => {
    fetch(`/api/applications/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSelectedApp(data.application);
          setSelectedDocIndex(0);
        }
      });
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (status: "APPROVED" | "ACTION_REQUIRED" | "REJECTED") => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/officer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status,
          issues: status === "ACTION_REQUIRED" ? [selectedDefect] : [],
          officerNotes: officerNote || (status === "APPROVED" ? "All original documents pre-checked and verified." : selectedDefect),
          officerName: "Anand Verma (Desk 3)",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          status === "APPROVED"
            ? "Application APPROVED & Certificate Issued without physical visit!"
            : status === "ACTION_REQUIRED"
            ? "Correction request sent to citizen via SMS. File placed in pending correction."
            : "Application marked rejected."
        );
        setOfficerNote("");
        loadQueue();
        loadApplicationDetail(selectedApp.id);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving verification");
    } finally {
      setActionLoading(false);
    }
  };

  const currentDoc = selectedApp?.documents?.[selectedDocIndex] || selectedApp?.documents?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">
            Document Verification Queue (Scrutiny Desk)
          </h1>
          <p className="text-xs text-gray-600">
            Side-by-side document inspection and instant decisioning to prevent repeat citizen visits.
          </p>
        </div>
        <button
          onClick={loadQueue}
          className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue ({applications.length})</span>
        </button>
      </div>

      {/* Main 2-Column Scrutiny Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Applications List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3 max-h-[800px] overflow-y-auto">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
            Pending Files ({applications.length})
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">Queue is clear!</div>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => loadApplicationDetail(app.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all space-y-1 ${
                      isSelected
                        ? "border-saffron-500 bg-orange-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-navy-900">
                        {app.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.visitReadyScore >= 80
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.visitReadyScore}% Ready
                      </span>
                    </div>

                    <div className="font-bold text-xs text-gray-800 truncate">
                      {app.citizenName}
                    </div>

                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>{app.service?.name}</span>
                      <span>{formatDate(app.createdAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Side-by-Side Document Viewer & Decision Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApp ? (
            <>
              {/* Application Details Strip */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-navy-900 text-base">
                      {selectedApp.trackingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800">
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Applicant: <strong>{selectedApp.citizenName}</strong> • Phone: {selectedApp.citizenPhone} • Aadhaar: XXXX-XXXX-{selectedApp.citizenAadhaarLast4}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-gray-400">
                    Pre-Check Readiness
                  </div>
                  <div className="text-xl font-black text-green-700">
                    {selectedApp.visitReadyScore}% Score
                  </div>
                </div>
              </div>

              {/* Side-by-Side Viewer and Scrutiny Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Document Tabs & Document Viewer */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Uploaded Documents ({selectedApp.documents?.length || 0})
                  </div>

                  {/* Doc Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {selectedApp.documents?.map((d: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDocIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                          selectedDocIndex === idx
                            ? "bg-navy-800 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Doc {idx + 1}: {d.docName.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  {/* Document Simulated Canvas */}
                  {currentDoc && (
                    <div className="border border-gray-300 rounded-xl bg-gray-50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-900 truncate">
                          {currentDoc.docName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            currentDoc.status === "PASS"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {currentDoc.status}
                        </span>
                      </div>

                      {/* Mock Document Render */}
                      <div className="aspect-[4/3] bg-white border border-gray-200 rounded-lg p-4 shadow-inner flex flex-col justify-between text-[11px] font-serif text-gray-700">
                        <div className="text-center border-b pb-2">
                          <div className="font-bold uppercase tracking-widest text-gray-500 text-[10px]">
                            Official Document Scan
                          </div>
                          <div className="font-black text-navy-900 text-xs mt-0.5">
                            {currentDoc.docName}
                          </div>
                        </div>

                        <div className="space-y-1.5 my-auto text-xs font-mono text-gray-600">
                          <div>Record ID: {selectedApp.trackingNumber}</div>
                          <div>Subject: {selectedApp.citizenName}</div>
                          <div>Pre-check Heuristic Score: {currentDoc.simulatedAiScore}%</div>
                          <div>Seal Detection: VERIFIED / AUTHENTIC</div>
                        </div>

                        <div className="border-t pt-1 flex justify-between text-[10px] text-gray-400">
                          <span>File: {currentDoc.fileUrl.split("/").pop()}</span>
                          <span>Size: {currentDoc.fileSizeKb} KB</span>
                        </div>
                      </div>

                      {/* Document Issues if any */}
                      {currentDoc.issues?.length > 0 && (
                        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            <span>Flagged by Automated Pre-Check:</span>
                          </div>
                          {currentDoc.issues.map((iss: string, iIdx: number) => (
                            <div key={iIdx} className="text-[11px]">
                              • {iss}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Scrutiny Checklist & Actions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Officer Scrutiny & Actions
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                      <span>Applicant identity & photo matched against Aadhaar</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                      <span>Address jurisdiction lies in Tehsil Ghaziabad</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={selectedApp.visitReadyScore >= 80}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span>Supporting affidavit / income proof meets guidelines</span>
                    </label>
                  </div>

                  {/* Request Correction Box */}
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-orange-900">
                      Request Citizen Correction (Without Physical Visit)
                    </div>
                    <select
                      value={selectedDefect}
                      onChange={(e) => setSelectedDefect(e.target.value)}
                      className="w-full p-2 rounded-lg border border-orange-300 text-xs font-medium bg-white"
                    >
                      <option value="Electricity bill is older than 90 days. Please upload latest bill.">
                        Electricity bill is older than 90 days
                      </option>
                      <option value="Affidavit missing notary seal. Upload notarized ₹10 e-stamp.">
                        Affidavit missing notary seal
                      </option>
                      <option value="Photograph blurry. Please re-upload clear passport photo.">
                        Photograph is blurry
                      </option>
                      <option value="Spelling mismatch between Aadhaar and Ration card.">
                        Name spelling mismatch
                      </option>
                    </select>
                    <textarea
                      rows={2}
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      placeholder="Add specific officer note for SMS message..."
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>

                  {/* Decision Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction("APPROVED")}
                      className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Issue Certificate (0 Visits)</span>
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction("ACTION_REQUIRED")}
                      className="w-full py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Request Correction (Auto-SMS Citizen)</span>
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction("REJECTED")}
                      className="w-full py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs"
                    >
                      Reject with Reason
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
              Select an application from the queue to begin scrutiny.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
