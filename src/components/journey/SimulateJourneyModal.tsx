"use client";

import React, { useState } from "react";
import { useAuth, useLanguage } from "@/components/providers/AppProviders";
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  FileCheck,
  FileWarning,
} from "lucide-react";

export function SimulateJourneyModal() {
  const { showJourneyModal, setShowJourneyModal } = useAuth();
  const { lang, t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [fixedBadDoc, setFixedBadDoc] = useState<boolean>(false);
  const [trackingNumber, setTrackingNumber] = useState<string>("GZB-INC-2026-9099");

  if (!showJourneyModal) return null;

  const resetAndClose = () => {
    setShowJourneyModal(false);
    setTimeout(() => {
      setStep(1);
      setFixedBadDoc(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-500/20 border border-saffron-400 flex items-center justify-center text-saffron-300">
              <Sparkles className="w-5 h-5 text-saffron-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>{lang === "hi" ? "नागरिक यात्रा सिमुलेशन" : "Simulate Citizen Journey"}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-saffron-500/30 text-saffron-300 font-medium">
                  End-to-End Walkthrough
                </span>
              </h3>
              <p className="text-xs text-navy-200">
                {lang === "hi"
                  ? "देखें कैसे यह पोर्टल त्रुटियों को पहले पकड़ता है और बार-बार चक्कर खत्म करता है"
                  : "See how pre-check catches defective docs before visit, slashing repeated office trips"}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Journey Step Progress */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] text-xs font-semibold text-gray-500">
            <span className={step >= 1 ? "text-saffron-600 font-bold" : ""}>1. Service</span>
            <span>→</span>
            <span className={step >= 2 ? "text-saffron-600 font-bold" : ""}>2. Smart Checklist</span>
            <span>→</span>
            <span className={step >= 3 ? "text-saffron-600 font-bold" : ""}>3. Pre-Check Alert</span>
            <span>→</span>
            <span className={step >= 4 ? "text-saffron-600 font-bold" : ""}>4. Fix & Ready</span>
            <span>→</span>
            <span className={step >= 5 ? "text-saffron-600 font-bold" : ""}>5. Officer Approval</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-3">
                <Search className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Step 1: Citizen Selects Service</div>
                  <p className="mt-0.5 text-gray-700">
                    A citizen in Raj Nagar needs an <strong>Income Certificate (आय प्रमाण पत्र)</strong> for their daughter's scholarship. They don't know what docs are valid or which office to visit.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-xl hover:border-saffron-500 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 text-sm">Income Certificate (आय प्रमाण पत्र)</div>
                  <div className="text-xs text-gray-500 mt-0.5">Tehsil Ghaziabad (Sadar) • SLA: 7 Days • Govt Fee: ₹20 • Target: 0 Visits</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                  Target: 0 In-Person Visits
                </span>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center gap-2 ml-auto shadow-md"
                >
                  <span>Continue to Smart Checklist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Smart Checklist */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <div className="font-bold text-sm">Step 2: Personalized 3-Question Checklist</div>
                <p className="mt-0.5 text-gray-700">
                  Instead of a vague 10-page gazette list, the portal asks 3 simple questions and generates an exact tailored checklist with accepted alternatives.
                </p>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <div className="font-semibold text-gray-800">1. Employment Type: <span className="text-saffron-600">Private Sector / Self-Employed</span></div>
                <div className="font-semibold text-gray-800">2. Residence Status: <span className="text-saffron-600">Rented (Tenant) in Ghaziabad</span></div>
                <div className="font-semibold text-gray-800">3. Purpose: <span className="text-saffron-600">Higher Education Scholarship</span></div>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-gray-900">Personalized Checklist Generated:</div>
                <ul className="space-y-1.5 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Aadhaar Card (or Voter ID / Passport)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Recent Electricity Bill or Rent Agreement with Landlord Utility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Self-Declaration Affidavit on ₹10 e-stamp (Notarized)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Passport Size Photograph (Plain background)</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-gray-800 font-semibold">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Upload & Run Pre-Check Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload with Defective Document */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950">
                <div className="font-bold text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Step 3: Document Pre-Check Catches Flawed Document At Home!</span>
                </div>
                <p className="mt-1 text-red-900">
                  Citizen uploaded their electricity bill, but it was from <strong>6 months ago</strong>. Under conventional systems, they would wait in a 2-hour queue at Tehsil Sadar only to be sent back. Here, the pre-check catches it instantly!
                </p>
              </div>

              {/* Score Indicator */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/60 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-red-600 tracking-wider">Visit-Ready Score</div>
                  <div className="text-3xl font-black text-red-600">42%</div>
                  <div className="text-xs text-red-700 font-semibold mt-0.5">
                    Critical Issues Detected • Submission Paused
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-red-500 flex items-center justify-center font-bold text-red-600 text-sm">
                  42%
                </div>
              </div>

              {/* Doc item status */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-green-200 bg-green-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-950">Aadhaar_Card_Front_Back.pdf</span>
                  </div>
                  <span className="text-green-700 font-bold">PASS (Score: 98%)</span>
                </div>

                <div className="p-3 rounded-lg border-2 border-red-300 bg-red-50 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <FileWarning className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="font-bold text-red-950">Old_Electricity_Bill_April.pdf</span>
                      <div className="text-[11px] text-red-700 font-semibold">
                        ❌ Defect: Bill is older than 90 days. Tehsil rule requires current address proof within 3 months.
                      </div>
                    </div>
                  </div>
                  <span className="text-red-700 font-bold">REJECTED</span>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center gap-2 ml-auto shadow-md"
                >
                  <RefreshCw className="w-4 h-4 text-saffron-400" />
                  <span>Simulate: Citizen Replaces with Latest Bill</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Fix and Score climbs to 98% */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-950">
                <div className="font-bold text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Step 4: Issue Resolved! Visit-Ready Score Jumps to 98%</span>
                </div>
                <p className="mt-1 text-green-900">
                  Citizen uploaded <strong>Latest_Electricity_Bill_Sept2026.pdf</strong> (dated 12 days ago). Pre-check passes with flying colors! No round to Tehsil needed.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-green-200 bg-green-50/70 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-green-700 tracking-wider">Visit-Ready Score</div>
                  <div className="text-3xl font-black text-green-700">98%</div>
                  <div className="text-xs text-green-800 font-semibold mt-0.5">
                    Ready to Submit • 0 Physical Visits Projected
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-green-600 flex items-center justify-center font-bold text-green-700 text-sm">
                  98%
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <div className="font-bold text-gray-800">Generated Application Reference:</div>
                <div className="font-mono text-saffron-700 font-bold text-sm">{trackingNumber}</div>
                <div className="text-gray-500">Sent automated SMS confirmation to applicant phone 9999999999.</div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setStep(5)}
                  className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center gap-2 ml-auto shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Forward to Officer Desk (Simulate Approval)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Officer Desk Fast-Track & Certificate Issued */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-50 border border-navy-200 text-xs text-navy-900">
                <div className="font-bold text-sm text-navy-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-saffron-600" />
                  <span>Step 5: Front-Desk Scrutiny in 90 Seconds — Issued in 1-Shot!</span>
                </div>
                <p className="mt-1 text-navy-800">
                  Because documents were pre-checked at 98% readiness, Officer Anand Verma (Desk 3) approves the file immediately without issuing an objection notice. Certificate is generated with verifiable QR!
                </p>
              </div>

              {/* Certificate Mock Card */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gradient-to-b from-white to-orange-50/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-saffron-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                  UP
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">District Administration Ghaziabad</div>
                  <h4 className="text-base font-extrabold text-navy-900 mt-0.5">आय प्रमाण पत्र (Income Certificate)</h4>
                  <div className="text-xs font-mono text-gray-600 mt-1">Certificate No: GZB/INC/2026/8841</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left bg-white p-3 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500">Applicant:</span>
                    <div className="font-bold text-gray-900">Ramesh Sharma</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual Income:</span>
                    <div className="font-bold text-green-700">₹84,000 / Year</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Visits Incurred:</span>
                    <div className="font-bold text-saffron-700">0 In-Person Visits</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Issued On:</span>
                    <div className="font-bold text-gray-900">Today (Digitally Signed)</div>
                  </div>
                </div>

                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  ✓ Digitally Verified by Nayab Tehsildar Sadar
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-saffron-600 font-bold hover:underline"
                >
                  ↻ Re-run Simulation
                </button>
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md"
                >
                  Finish Simulation & Explore Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
