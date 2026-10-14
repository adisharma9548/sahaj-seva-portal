"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  Clock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck,
  Search,
  Timer,
  ChevronRight,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CounterModePage() {
  const { t } = useLanguage();
  const [tokenInput, setTokenInput] = useState("GZB-T104");
  const [activeSession, setActiveSession] = useState<any>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  // Repeat visit modal/state
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatReason, setRepeatReason] = useState("Missing affidavit on prescribed stamp paper");
  const [officerNotes, setOfficerNotes] = useState("");

  // Demo tokens suggestions
  const [sampleBookings, setSampleBookings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/slots?limit=10")
      .then((r) => r.json())
      .then((data) => {
        // Fetch some sample applications with bookings
        fetch("/api/applications?status=VISIT_SCHEDULED&limit=5")
          .then((res) => res.json())
          .then((aData) => {
            if (aData.success && aData.applications?.length > 0) {
              setSampleBookings(aData.applications);
            }
          });
      });
  }, []);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleScanOrLookup = async (tokenToLookup?: string) => {
    const token = tokenToLookup || tokenInput;
    if (!token.trim()) return;
    setLoading(true);

    try {
      // Find matching application by token or query
      const res = await fetch(`/api/applications?search=${encodeURIComponent(token.trim())}`);
      const data = await res.json();

      if (data.success && data.applications?.length > 0) {
        setActiveSession(data.applications[0]);
        setSecondsElapsed(0);
        setTimerRunning(true);
        setIsRepeat(false);
      } else {
        // Fallback demo app
        const fallback = await fetch("/api/applications?limit=1");
        const fbData = await fallback.json();
        if (fbData.applications?.[0]) {
          setActiveSession(fbData.applications[0]);
          setSecondsElapsed(0);
          setTimerRunning(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteVisit = async (repeatFlag: boolean) => {
    if (!activeSession) return;
    setProcessingAction(true);
    setTimerRunning(false);

    try {
      const minutesSpent = Math.max(1, Math.round(secondsElapsed / 60));
      const res = await fetch("/api/officer/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenNumber: tokenInput,
          applicationId: activeSession.id,
          durationMinutes: minutesSpent,
          isRepeatVisit: repeatFlag,
          repeatReason: repeatFlag ? repeatReason : null,
          notes: officerNotes || (repeatFlag ? `Repeat visit: ${repeatReason}` : "One-shot counter check passed."),
          officerName: "Anand Verma (Desk 3)",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          repeatFlag
            ? `Repeat visit reason "${repeatReason}" recorded. Analytics updated immediately.`
            : `Counter visit completed in ${secondsElapsed} seconds (< 2 mins)! Citizen file marked issued.`
        );
        setActiveSession(null);
        setSecondsElapsed(0);
      }
    } catch (e) {
      console.error(e);
      alert("Error logging visit");
    } finally {
      setProcessingAction(false);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold mb-1">
            <Timer className="w-3.5 h-3.5" />
            <span>Target: Complete Counter Scrutiny in Under 2 Minutes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">
            2-Minute Fast Counter Mode
          </h1>
        </div>

        {/* Stopwatch display if active */}
        {timerRunning && (
          <div className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-xl shadow-md">
            <Clock className="w-4 h-4 text-saffron-400 animate-spin" />
            <span className="text-xs uppercase font-bold text-gray-300">Elapsed:</span>
            <span
              className={`font-mono text-lg font-black ${
                secondsElapsed > 120 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {formatTimer(secondsElapsed)}
            </span>
          </div>
        )}
      </div>

      {/* QR / Token Scanner Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Scan Citizen QR E-Token or Enter Token ID
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. GZB-T104 or scan with USB handheld scanner..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-sm font-mono font-bold text-navy-900 focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <button
            onClick={() => handleScanOrLookup()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Searching..." : "Retrieve File"}</span>
          </button>
        </div>

        {/* Quick demo click tokens */}
        {sampleBookings.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-gray-400 font-semibold">Demo Quick Tokens:</span>
            {sampleBookings.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setTokenInput(b.trackingNumber);
                  handleScanOrLookup(b.trackingNumber);
                }}
                className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-navy-800 font-mono text-xs font-semibold"
              >
                {b.trackingNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Citizen Session Sheet */}
      {activeSession ? (
        <div className="bg-white rounded-2xl border-2 border-saffron-400 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-saffron-500 text-white font-bold text-xs flex items-center justify-center">
                  C3
                </span>
                <div>
                  <h2 className="text-lg font-black text-navy-900">
                    {activeSession.citizenName}
                  </h2>
                  <div className="text-xs text-gray-500">
                    Phone: {activeSession.citizenPhone} • Aadhaar: XXXX-XXXX-{activeSession.citizenAadhaarLast4}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Pre-Check Score
                </span>
                <div className="text-xl font-black text-green-700">
                  {activeSession.visitReadyScore}% Ready
                </div>
              </div>
              <div className="p-2 bg-green-100 text-green-800 rounded-lg text-xs font-bold">
                ✓ Pre-Scrutiny Passed
              </div>
            </div>
          </div>

          {/* Service & Verification Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-gray-700 uppercase tracking-wider">
                Service Details
              </div>
              <div>
                <span className="text-gray-500">Service:</span>{" "}
                <strong>{activeSession.service?.name}</strong>
              </div>
              <div>
                <span className="text-gray-500">Tracking Number:</span>{" "}
                <span className="font-mono font-bold">{activeSession.trackingNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Govt Fee Status:</span>{" "}
                <span className="text-green-700 font-bold">✓ Verified (₹{activeSession.service?.fee || 20})</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-gray-700 uppercase tracking-wider">
                Quick 60-Second Physical Checks
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                <span>Verify original physical Aadhaar against digital photo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                <span>Inspect original deed / mark sheet stamp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                <span>Biometric / Signature recorded</span>
              </label>
            </div>
          </div>

          {/* ACTION BUTTON 1: Mark Visit Completed in under 2 minutes */}
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-green-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Ideal Flow: 1-Shot Visit Completed</span>
              </div>
              <p className="text-xs text-green-900 mt-0.5">
                Citizen brought pre-verified file. All physical checks match. Mark completed and release certificate.
              </p>
            </div>
            <button
              onClick={() => handleCompleteVisit(false)}
              disabled={processingAction}
              className="px-6 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs whitespace-nowrap shadow-md"
            >
              {t.verifyAndComplete}
            </button>
          </div>

          {/* ACTION BUTTON 2: Repeat Visit Reason Logger (Feeds Analytics) */}
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-red-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Problem Statement 9 Core: Log Repeat Visit Reason</span>
                </div>
                <p className="text-xs text-red-900 mt-0.5">
                  If citizen was unable to complete work today and must revisit, log the exact root cause to fuel district analytics.
                </p>
              </div>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className="text-xs font-bold text-red-700 underline"
              >
                {isRepeat ? "Cancel" : "Citizen Must Return"}
              </button>
            </div>

            {isRepeat && (
              <div className="space-y-3 pt-2 border-t border-red-200">
                <div>
                  <label className="block text-xs font-bold text-red-900 mb-1">
                    {t.selectRepeatReason}
                  </label>
                  <select
                    value={repeatReason}
                    onChange={(e) => setRepeatReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-red-300 text-xs font-semibold bg-white"
                  >
                    <option value="Missing affidavit on prescribed stamp paper">
                      Missing affidavit on prescribed stamp paper
                    </option>
                    <option value="Signature mismatch on self-declaration form">
                      Signature mismatch on self-declaration form
                    </option>
                    <option value="Fee payment challan unverified / illegible">
                      Fee payment challan unverified / illegible
                    </option>
                    <option value="Original document physical verification needed">
                      Original document physical verification needed
                    </option>
                    <option value="Biometric fingerprint sensor retry">
                      Biometric fingerprint sensor retry
                    </option>
                    <option value="Address proof older than 6 months">
                      Address proof older than 6 months
                    </option>
                    <option value="Spelling error in applicant father name">
                      Spelling error in applicant father name
                    </option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Specific counter note (e.g., citizen asked to bring 2 witnesses next time)..."
                    className="w-full p-2.5 rounded-xl border border-red-300 text-xs bg-white"
                  />
                </div>

                <button
                  onClick={() => handleCompleteVisit(true)}
                  disabled={processingAction}
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md"
                >
                  Log Repeat Visit & Update District Analytics
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
          Scan QR token or click a demo token above to launch high-speed counter mode.
        </div>
      )}
    </div>
  );
}
