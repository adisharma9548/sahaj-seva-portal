"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  FileText,
  Clock,
  IndianRupee,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Printer,
  ShieldAlert,
  ListOrdered,
  FileCheck,
  Laptop,
} from "lucide-react";

export default function ServiceDetailPage() {
  const { lang, t } = useLanguage();
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;
    fetch(`/api/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setService(data.service);
        }
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Service Not Found</h2>
        <Link href="/services" className="text-saffron-600 font-bold mt-2 inline-block">
          ← Back to Services
        </Link>
      </div>
    );
  }

  const displayName = lang === "hi" ? service.nameHi || service.name : service.name;
  const displayDesc =
    lang === "hi" ? service.descriptionHi || service.description : service.description;
  const commonMistakes =
    lang === "hi" ? service.commonMistakesHi || service.commonMistakes : service.commonMistakes;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-navy-900">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-navy-900">{t.services}</Link>
        <span>/</span>
        <span className="font-semibold text-navy-900 truncate">{displayName}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-100">
            {service.category} Category • {service.officeType}
          </span>
          {service.processType === "ONLINE" || (!service.physicalVisitRequired && service.processType !== "OFFLINE") ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>🟢 100% घर बैठे ऑनलाइन (0 चक्कर)</span>
            </span>
          ) : service.processType === "SEMI_ONLINE" || service.physicalVisitRequired ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>🟡 सेमी-ऑनलाइन (1 बार 15 मिनट स्लॉट)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>🔵 ऑफलाइन केंद्र अनिवार्य</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
          {displayName}
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed">
          {displayDesc}
        </p>

        {/* Process Mode Explanation Banner */}
        {service.processType === "ONLINE" || (!service.physicalVisitRequired && service.processType !== "OFFLINE") ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {lang === "hi"
                ? "यह सेवा 100% ऑनलाइन है। आपको किसी सरकारी दफ्तर नहीं जाना पड़ेगा। प्रमाण पत्र सीधे घर बैठे डाउनलोड होगा।"
                : "This service is 100% online. Zero office visits required. Digitally signed certificate will be issued online."}
            </span>
          </div>
        ) : service.processType === "SEMI_ONLINE" ? (
          <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              {lang === "hi"
                ? "यह सेवा सेमी-ऑनलाइन है। फॉर्म व दस्तावेज यहीं अपलोड होंगे। केवल 1 बार 15 मिनट के तय स्लॉट पर मूल दस्तावेज दिखाने जाना होगा।"
                : "This service is Semi-Online. Upload & pre-check online, attend 1 scheduled 15-min slot with originals for verification."}
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-blue-50 border-2 border-blue-300 text-blue-950 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700 shrink-0" />
            <span>
              {lang === "hi"
                ? "इस सेवा हेतु भौतिक उपस्थिति अनिवार्य है। जाने से पहले नीचे दी गई चेकलिस्ट के अनुसार सभी दस्तावेज तैयार कर लें।"
                : "In-person counter visit mandatory for this service. Check the complete document checklist below before visiting."}
            </span>
          </div>
        )}

        {/* CARRY ORIGINALS WARNING BOX */}
        {service.carryDocs && service.carryDocs.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-black text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {lang === "hi"
                  ? "दफ्तर में सत्यापन हेतु साथ ले जाने वाले अनिवार्य मूल दस्तावेज (Originals):"
                  : "Mandatory Original Documents to Carry to Office for Verification:"}
              </span>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-amber-900 font-medium">
              {service.carryDocs.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">{t.fee}</span>
            <span className="text-base font-extrabold text-navy-900">
              {service.fee === 0 ? "Free (₹0)" : `₹${service.fee}`}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">{t.timeRequired}</span>
            <span className="text-base font-extrabold text-navy-900">
              {service.slaDays} {lang === "hi" ? "कार्य दिवस" : "Working Days"}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">{t.office}</span>
            <span className="text-base font-extrabold text-navy-900 truncate block">
              {service.officeType} Ghaziabad
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">{t.visitsRequired}</span>
            <span className="text-base font-extrabold text-green-700">
              {service.processType === "ONLINE"
                ? "0 Visits (100% Online)"
                : service.processType === "SEMI_ONLINE"
                ? "1 Scheduled Slot Visit"
                : "1 Physical Visit"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          {service.processType !== "OFFLINE" ? (
            <Link
              href={`/apply?serviceId=${service.id}`}
              className="px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-saffron-500/20"
            >
              <Laptop className="w-4 h-4" />
              <span>{t.startApplication}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/checklist"
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 shadow-md"
            >
              <FileCheck className="w-4 h-4" />
              <span>{lang === "hi" ? "चेकलिस्ट तैयार करें" : "Prepare Document Bundle"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {service.processType === "SEMI_ONLINE" && (
            <Link
              href="/slots"
              className="px-5 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{lang === "hi" ? "15-मिनट स्लॉट बुक करें" : "Book 15-Min Slot"}</span>
            </Link>
          )}

          <Link
            href={`/checklist?serviceId=${service.id}`}
            className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-saffron-600" />
            <span>Generate Personalized Checklist</span>
          </Link>
        </div>
      </div>

      {/* Required Documents & Alternatives */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-navy-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-saffron-600" />
            <span>{t.documentsRequired}</span>
          </h2>
          <span className="text-xs text-gray-500">
            {lang === "hi" ? "कोई भी 1 मान्य विकल्प स्वीकार्य है" : "Any 1 accepted alternative is valid"}
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {service.documents?.map((doc: any, idx: number) => {
            const docName = lang === "hi" ? doc.nameHi || doc.name : doc.name;
            return (
              <div
                key={doc.id || idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-sm text-navy-900">
                      {docName}
                    </h3>
                  </div>
                  {doc.isMandatory ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      Mandatory
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700">
                      Optional
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-700 pl-8">
                  <span className="font-semibold text-gray-900">
                    {lang === "hi" ? "मान्य विकल्प:" : "Accepted Alternatives:"}{" "}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {doc.alternatives?.map((alt: string, aIdx: number) => (
                      <span
                        key={aIdx}
                        className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-800 font-medium text-xs"
                      >
                        ✓ {alt}
                      </span>
                    ))}
                  </div>
                </div>

                {doc.criteria && (
                  <div className="text-[11px] text-gray-500 pl-8 flex gap-3">
                    <span>Max Size: {doc.criteria.maxSizeMb || 2} MB</span>
                    <span>•</span>
                    <span>Formats: {(doc.criteria.allowedTypes || ["pdf", "jpg"]).join(", ").toUpperCase()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Mistakes That Cause Rejection (Problem Statement 9 Core) */}
      <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <h2 className="text-lg font-black text-red-950">
            {t.commonMistakes}
          </h2>
        </div>
        <p className="text-xs text-red-900">
          {lang === "hi"
            ? "तहसील और नगर निगम में 80% नागरिकों को इन छोटी गलतियों के कारण दोबारा लौटना पड़ता है। आवेदन करने से पहले इनकी जांच अवश्य करें:"
            : "In Ghaziabad offices, over 80% of repeat visits are caused by these simple errors. Check before submitting:"}
        </p>

        <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-red-950">
          {commonMistakes?.map((mistake: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">⚠️</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-black text-navy-900 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-saffron-600" />
          <span>{lang === "hi" ? "कार्य प्रवाह (Workflow Stages)" : "Step-by-Step Process"}</span>
        </h2>

        <div className="space-y-3">
          {service.steps?.map((stepStr: string, sIdx: number) => (
            <div key={sIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-full bg-saffron-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {sIdx + 1}
              </div>
              <span className="font-semibold text-gray-800">{stepStr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
