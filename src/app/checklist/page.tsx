"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  CheckSquare,
  Printer,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Share2,
} from "lucide-react";

function SmartChecklistContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [employmentType, setEmploymentType] = useState<string>("self-employed");
  const [residenceType, setResidenceType] = useState<string>("tenant");
  const [hasAadhaar, setHasAadhaar] = useState<string>("yes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services.length > 0) {
          setServices(data.services);
          if (!selectedServiceId) {
            setSelectedServiceId(data.services[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [selectedServiceId]);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="no-print space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Interactive Document Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.smartChecklist}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "3 त्वरित प्रश्नों के उत्तर दें और अपने अनुसार सटीक दस्तावेज सूची प्राप्त करें। इसे प्रिंट या सेव करें।"
            : "Answer 3 quick questions to receive a tailored document checklist with accepted alternatives. Printable for offline preparation."}
        </p>
      </div>

      {/* Questions Card */}
      <div className="no-print bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
          <span>{lang === "hi" ? "त्वरित व्यक्तिगत प्रश्न" : "Answer Quick Questions"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Question 1: Service */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              1. {lang === "hi" ? "आवश्यक सेवा चुनें" : "Select Required Service"}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === "hi" ? s.nameHi || s.name : s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2: Employment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              2. {lang === "hi" ? "रोजगार / आय का स्रोत" : "Employment / Income Nature"}
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="salaried">Salaried / Private / Govt Employee</option>
              <option value="self-employed">Self-Employed / Shopkeeper / Business</option>
              <option value="farmer">Farmer / Agriculture</option>
              <option value="daily-wage">Daily Wage / Informal Worker</option>
              <option value="student">Student / Unemployed</option>
            </select>
          </div>

          {/* Question 3: Residence */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              3. {lang === "hi" ? "निवास स्थिति" : "Housing / Residence Status"}
            </label>
            <select
              value={residenceType}
              onChange={(e) => setResidenceType(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="owner">Own House in Ghaziabad (Owner)</option>
              <option value="tenant">Rented Accommodation (Tenant)</option>
              <option value="ancestral">Ancestral Family House</option>
            </select>
          </div>

          {/* Question 4: Identity */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              4. {lang === "hi" ? "आधार कार्ड की उपलब्धता" : "Aadhaar Card with Mobile Link"}
            </label>
            <select
              value={hasAadhaar}
              onChange={(e) => setHasAadhaar(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="yes">Yes, Aadhaar is available and linked</option>
              <option value="voter">No Aadhaar, but have Voter ID Card</option>
              <option value="pan">Have PAN Card & Ration Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Checklist (Printable Section) */}
      {activeService && (
        <div className="bg-white rounded-2xl border-2 border-saffron-300 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">
                Personalized Document Dossier
              </div>
              <h2 className="text-xl font-black text-navy-900 mt-0.5">
                {lang === "hi" ? activeService.nameHi || activeService.name : activeService.name}
              </h2>
              <div className="text-xs text-gray-500 mt-1">
                Designated Office: {activeService.officeType} Ghaziabad • SLA: {activeService.slaDays} Days
              </div>
            </div>

            <div className="no-print flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.downloadChecklist}</span>
              </button>
            </div>
          </div>

          {/* Tailored Advice Banner */}
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
            <div className="font-bold">
              {lang === "hi" ? "आपके उत्तरों के अनुसार विशेष निर्देश:" : "Personalized Advice for Your Profile:"}
            </div>
            {employmentType === "salaried" && (
              <p>• Since you are salaried, provide your latest 3 months salary slip OR Form 16. No separate affidavit is mandatory if employer certificate is provided.</p>
            )}
            {employmentType === "self-employed" && (
              <p>• For self-employed individuals, a notarized self-declaration affidavit on ₹10 e-stamp is mandatory. Do not purchase ₹50/₹100 stamps.</p>
            )}
            {residenceType === "tenant" && (
              <p>• As a tenant, attach your registered rent agreement PLUS the electricity bill of the owner (dated within last 90 days).</p>
            )}
            {residenceType === "owner" && (
              <p>• As an owner, latest house tax receipt or electricity bill in applicant&apos;s name is sufficient.</p>
            )}
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider">
              {lang === "hi" ? "लाने / अपलोड करने हेतु आवश्यक कागजात:" : "Documents to Bring / Upload (Any 1 Alternative per item):"}
            </h3>

            <div className="space-y-3">
              {activeService.documents?.map((doc: any, idx: number) => {
                const docName = lang === "hi" ? doc.nameHi || doc.name : doc.name;
                return (
                  <div
                    key={doc.id || idx}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      id={`check-${idx}`}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-saffron-600 focus:ring-saffron-500 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <label htmlFor={`check-${idx}`} className="font-bold text-sm text-navy-900 cursor-pointer block">
                        {idx + 1}. {docName}
                        {doc.isMandatory && (
                          <span className="ml-2 text-[10px] text-red-600 font-semibold uppercase">
                            (Mandatory)
                          </span>
                        )}
                      </label>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium text-gray-700">Accepted alternatives: </span>
                        {doc.alternatives?.join(", ") || "Standard government certificate"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Common Mistakes Warning */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
            <div className="font-bold text-red-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{t.commonMistakes}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-red-900">
              {activeService.commonMistakes?.slice(0, 3).map((m: string, mIdx: number) => (
                <li key={mIdx}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Action CTA */}
          <div className="no-print pt-2 flex items-center justify-between">
            <button
              onClick={handlePrint}
              className="text-xs font-bold text-gray-600 hover:text-navy-900 flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>
            <Link
              href={`/apply?serviceId=${activeService.id}`}
              className="px-6 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <span>{t.startApplication}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartChecklistPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      }
    >
      <SmartChecklistContent />
    </Suspense>
  );
}
