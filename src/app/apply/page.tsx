"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  FileCheck,
} from "lucide-react";

function ApplyPageContent() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [loading, setLoading] = useState(true);

  // Clean Form Inputs
  const [citizenName, setCitizenName] = useState(user?.name || "Ramesh Sharma");
  const [fatherName, setFatherName] = useState("Shri Ram Avtar Sharma");
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || "9999999999");
  const [aadhaarLast4, setAadhaarLast4] = useState("4819");
  const [selectedOfficeId, setSelectedOfficeId] = useState("OFF-TEH-SADAR");
  const [address, setAddress] = useState("House No. 42, Sector 14, Raj Nagar, Ghaziabad");

  // Uploaded Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, any>>({});
  const [precheckLoading, setPrecheckLoading] = useState(false);
  const [precheckSummary, setPrecheckSummary] = useState<any>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/slots").then((r) => r.json()),
    ]).then(([sData, slotData]) => {
      if (sData.success && sData.services?.length > 0) {
        setServices(sData.services);
        if (!selectedServiceId) {
          setSelectedServiceId(sData.services[0].id);
        }
      }
      if (slotData.success && slotData.offices) {
        setOffices(slotData.offices);
      }
      setLoading(false);
    });
  }, [selectedServiceId]);

  const activeService =
    services.find((s) => s.id === selectedServiceId) || services[0] || null;

  // Simulate document upload with rule pre-check
  const handleUploadDoc = (docCode: string, docName: string, isDefective = false) => {
    const fileName = isDefective
      ? `${docCode.toLowerCase()}_blurry_expired.jpg`
      : `${docCode.toLowerCase()}_clean.pdf`;

    const newDoc = {
      docCode,
      name: docName,
      fileName,
      fileSize: isDefective ? 4500000 : 1240000,
      fileType: isDefective ? "jpg" : "pdf",
      uploadedAt: new Date().toISOString(),
      isDefective,
    };

    const nextDocs = { ...uploadedDocs, [docCode]: newDoc };
    setUploadedDocs(nextDocs);

    // Call precheck API
    runPrecheck(nextDocs);
  };

  const runPrecheck = (docsMap: Record<string, any>) => {
    if (!activeService) return;
    setPrecheckLoading(true);

    const docItems = Object.values(docsMap).map((d) => ({
      docCode: d.docCode,
      fileName: d.fileName,
      fileSize: d.fileSize,
      fileType: d.fileType,
      isDefective: d.isDefective,
    }));

    fetch("/api/precheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: activeService.id,
        documents: docItems,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPrecheckSummary(data);
        }
      })
      .finally(() => setPrecheckLoading(false));
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!activeService) return;
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: activeService.id,
          citizenName,
          citizenPhone,
          citizenAadhaarLast4: aadhaarLast4,
          officeId: selectedOfficeId,
          visitReadyScore: precheckSummary?.overallScore || 95,
          documents: precheckSummary?.results || [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult(data);
        setStep(4);
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !activeService) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="h-40 bg-white rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* STEP PROGRESS INDICATOR */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, label: "1. आपकी जानकारी (Details)" },
            { num: 2, label: "2. दस्तावेज (Documents)" },
            { num: 3, label: "3. पुष्टि व जमा (Submit)" },
          ].map((s) => (
            <div
              key={s.num}
              className={`text-center py-2.5 rounded-xl text-xs font-black border transition-all ${
                step === s.num
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : step > s.num
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CITIZEN DETAILS                                       */}
        {/* ------------------------------------------------------------- */}
        {step === 1 && activeService && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">
                Step 1 of 3
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {lang === "hi" ? "आवेदक का विवरण (Applicant Details)" : "Applicant Details"}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Document / Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्रमाण पत्र / सेवा (Selected Document)
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === "hi" ? s.nameHi || s.name : s.name} (शुल्क: ₹{s.fee} • SLA: {s.slaDays} दिन)
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आवेदक का पूरा नाम (Full Name as per Aadhaar)
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="उदा. रमेश शर्मा"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-saffron-500"
                />
              </div>

              {/* Father / Husband Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पिता / पति का नाम (Father / Husband Name)
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="उदा. श्री राम अवतार शर्मा"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-saffron-500"
                />
              </div>

              {/* Mobile Number & Aadhaar (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    मोबाइल नंबर (SMS ट्रैकिंग हेतु)
                  </label>
                  <input
                    type="tel"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    maxLength={10}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आधार संख्या (अंतिम 4 अंक)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold text-xs bg-slate-100 px-3 py-3 rounded-xl border border-slate-200">
                      XXXX-XXXX-
                    </span>
                    <input
                      type="text"
                      maxLength={4}
                      value={aadhaarLast4}
                      onChange={(e) => setAadhaarLast4(e.target.value)}
                      className="w-20 p-3 rounded-xl border border-slate-300 text-sm font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Jurisdiction Office */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  तहसील / कार्यालय (Jurisdiction Office)
                </label>
                <select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white"
                >
                  {offices.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गाज़ियाबाद का स्थायी पता (Residential Address)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="मकान संख्या, वार्ड/मोहल्ला, तहसील..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-saffron-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>आगे बढ़ें: दस्तावेज अपलोड करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: DOCUMENT UPLOAD & AT-HOME PRE-CHECK                   */}
        {/* ------------------------------------------------------------- */}
        {step === 2 && activeService && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {lang === "hi"
                    ? `${activeService.nameHi || activeService.name} हेतु दस्तावेज`
                    : `Upload Documents for ${activeService.name}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:underline"
              >
                ← विवरण बदलें
              </button>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {activeService.documents?.map((doc: any, idx: number) => {
                const uploaded = uploadedDocs[doc.docCode];
                const dName = lang === "hi" ? doc.nameHi || doc.name : doc.name;

                return (
                  <div
                    key={doc.id || idx}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      uploaded
                        ? uploaded.isDefective
                          ? "border-red-300 bg-red-50/60"
                          : "border-emerald-300 bg-emerald-50/50"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">
                          {idx + 1}. {dName}
                        </span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {doc.isMandatory ? "अनिवार्य" : "वैकल्पिक"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        मान्य विकल्प: {doc.alternatives?.join(" या ")}
                      </div>

                      {/* Status indicator */}
                      {uploaded && (
                        <div className="pt-1">
                          {uploaded.isDefective ? (
                            <div className="text-xs font-bold text-red-700 flex items-center gap-1.5 bg-white p-2 rounded-lg border border-red-200">
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                              <span>दस्तावेज धुंधला / पुराना है! कृपया साफ फोटो अपलोड करें।</span>
                            </div>
                          ) : (
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-white p-2 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>सत्यापित फाइल अपलोड हो गई: {uploaded.fileName}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload action buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUploadDoc(doc.docCode, doc.name, false)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploaded ? "फाइल बदलें" : "फोटो/फाइल अपलोड"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUploadDoc(doc.docCode, doc.name, false)}
                          className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>कैमरा</span>
                        </button>

                        {/* Demo defect button */}
                        <button
                          type="button"
                          onClick={() => handleUploadDoc(doc.docCode, doc.name, true)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-[11px]"
                          title="Simulate blurry or expired document"
                        >
                          ⚡ टेस्ट खराब फाइल
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                ← वापस
              </button>

              <button
                type="button"
                onClick={() => {
                  // Ensure at least one doc is uploaded or auto-fill for convenience
                  if (Object.keys(uploadedDocs).length === 0 && activeService.documents) {
                    activeService.documents.forEach((d: any) =>
                      handleUploadDoc(d.docCode, d.name, false)
                    );
                  }
                  setStep(3);
                }}
                className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-sm flex items-center gap-2 shadow-md"
              >
                <span>जांचें और जमा करें →</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: REVIEW & INSTANT SUBMISSION                           */}
        {/* ------------------------------------------------------------- */}
        {step === 3 && activeService && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">
                Step 3 of 3
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {lang === "hi" ? "अंतिम जांच एवं आवेदन जमा" : "Review & Submit Application"}
              </h2>
            </div>

            {/* Visit Ready Score Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-black text-sm text-emerald-950">
                    Visit-Ready Score: 95% (घर बैठे पास)
                  </div>
                  <div className="text-xs text-emerald-800">
                    सभी दस्तावेज वैध हैं। दफ्तर जाने की कोई आवश्यकता नहीं होगी।
                  </div>
                </div>
              </div>
            </div>

            {/* Details Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-extrabold text-slate-900 uppercase text-[11px] border-b border-slate-200 pb-1.5">
                आवेदन सारांश (Summary)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">सेवा:</span>
                  <span className="font-bold text-slate-900">{activeService.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">आवेदक:</span>
                  <span className="font-bold text-slate-900">{citizenName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">मोबाइल:</span>
                  <span className="font-bold text-slate-900">{citizenPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">आधार:</span>
                  <span className="font-bold text-slate-900">XXXX-XXXX-{aadhaarLast4}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">पता:</span>
                  <span className="font-medium text-slate-900">{address}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                ← दस्तावेज बदलें
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitApplication}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>आवेदन जमा करें (Submit Now)</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: INSTANT CONFIRMATION & TRACKING ID                     */}
        {/* ------------------------------------------------------------- */}
        {step === 4 && submissionResult && (
          <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 text-center space-y-6 shadow-md animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                आवेदन सफलतापूर्वक जमा हुआ!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                आपका आवेदन सीधे संबंधित तहसील अधिकारी की मेज पर पहुंच चुका है। एसएमएस द्वारा आपको प्रगति की सूचना मिलती रहेगी।
              </p>
            </div>

            {/* Tracking ID Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 inline-block max-w-sm w-full">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                आपकी आवेदन संख्या (Tracking ID)
              </span>
              <span className="text-2xl font-black font-mono text-slate-900 block mt-1">
                {submissionResult.trackingNumber}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/track?id=${submissionResult.trackingNumber}`}
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-md"
              >
                लाइव स्थिति ट्रैक करें (Track Now) →
              </Link>

              <Link
                href="/"
                className="px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50"
              >
                मुख्य पृष्ठ पर जाएं
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="h-40 bg-white rounded-2xl animate-pulse"></div>
        </div>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}
