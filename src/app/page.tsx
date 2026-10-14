"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  Search,
  CheckCircle2,
  Clock,
  Laptop,
  Calendar,
  Building2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"DOCS" | "TRACK">("DOCS");
  const [searchQuery, setSearchQuery] = useState("");
  const [trackQuery, setTrackQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processFilter, setProcessFilter] = useState<string>("ALL");
  const [expandedDocs, setExpandedDocs] = useState<{ [serviceId: string]: boolean }>({});

  const toggleDocs = (serviceId: string) => {
    setExpandedDocs((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackQuery.trim())}`);
    }
  };

  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const docNames = (s.documents || []).map((d: any) => d.name.toLowerCase()).join(" ");
    const docAlts = (s.documents || []).flatMap((d: any) => d.alternatives || []).join(" ").toLowerCase();

    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.nameHi && s.nameHi.includes(q)) ||
      s.category.toLowerCase().includes(q) ||
      docNames.includes(q) ||
      docAlts.includes(q);

    const sMode = s.processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE");
    const matchesProcess = processFilter === "ALL" || sMode === processFilter;

    return matchesSearch && matchesProcess;
  });

  const onlineCount = services.filter(
    (s) => (s.processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE")) === "ONLINE"
  ).length;
  const semiCount = services.filter(
    (s) => (s.processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE")) === "SEMI_ONLINE"
  ).length;
  const offlineCount = services.filter(
    (s) => (s.processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE")) === "OFFLINE"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOP BRANDING & TWO MAIN ACTIONS TABS */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-saffron-900 border border-saffron-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-saffron-600 animate-pulse"></span>
            <span>गाज़ियाबाद ज़िला प्रशासन • सहज सेवा पोर्टल</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {lang === "hi" ? "एक बार में काम, बार-बार का चक्कर खत्म" : "One-Time Work, Zero Repeat Office Visits"}
          </h1>
        </div>

        {/* TWO MAIN THINGS SWITCHER */}
        <div className="flex p-1.5 bg-slate-200/80 rounded-2xl max-w-xl mx-auto border border-slate-300 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("DOCS")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === "DOCS"
                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-saffron-600" />
            <span>{lang === "hi" ? "1. कौन सा दस्तावेज? (What Document)" : "1. What Document?"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TRACK")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === "TRACK"
                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{lang === "hi" ? "2. आवेदन ट्रैक करें (Track Status)" : "2. Track Status"}</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MAIN THING 1: WHAT DOCUMENT? (SEARCH, CHECK DOCS, FILL ONLINE) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "DOCS" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "hi"
                    ? "दस्तावेज या सेवा का नाम खोजें (उदा. आय प्रमाण पत्र, राशन कार्ड, ड्राइविंग लाइसेंस)..."
                    : "Search document (e.g. Income Certificate, Ration Card, Driving Licence)..."
                }
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-300 focus:border-saffron-500 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Simple Process Mode Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setProcessFilter("ALL")}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  processFilter === "ALL"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                सभी ({services.length})
              </button>

              <button
                type="button"
                onClick={() => setProcessFilter("ONLINE")}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  processFilter === "ONLINE"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>🟢 100% ऑनलाइन (0 चक्कर) • {onlineCount}</span>
              </button>

              <button
                type="button"
                onClick={() => setProcessFilter("SEMI_ONLINE")}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  processFilter === "SEMI_ONLINE"
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>🟡 1 स्लॉट विजिट • {semiCount}</span>
              </button>

              <button
                type="button"
                onClick={() => setProcessFilter("OFFLINE")}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  processFilter === "OFFLINE"
                    ? "bg-blue-800 text-white shadow-sm"
                    : "bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>🔵 ऑफलाइन केंद्र • {offlineCount}</span>
              </button>
            </div>

            {/* Document Cards List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                कोई दस्तावेज नहीं मिला। कृपया अलग नाम से खोजें।
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => {
                  const displayName = lang === "hi" ? service.nameHi || service.name : service.name;
                  const sMode = service.processType || (service.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE");
                  const isExpanded = !!expandedDocs[service.id];
                  const docsList: any[] = service.documents || [];
                  const carryDocs: string[] = service.carryDocs || [];

                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-saffron-400 p-5 shadow-sm space-y-3 transition-all"
                    >
                      {/* Card Header: Title & Process Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900">
                              {displayName}
                            </h3>
                            <span className="text-xs text-slate-500 font-bold">
                              ({service.officeType})
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            शुल्क: {service.fee === 0 ? "निःशुल्क (₹0)" : `₹${service.fee}`} • समय: {service.slaDays} दिन
                          </div>
                        </div>

                        {/* Clear Process Badge */}
                        <div>
                          {sMode === "ONLINE" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                              <span>🟢 100% घर बैठे ऑनलाइन (0 चक्कर)</span>
                            </span>
                          ) : sMode === "SEMI_ONLINE" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                              <span>🟡 1 तय स्लॉट (मूल दस्तावेज सत्यापन)</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                              <span>🔵 ऑफलाइन केंद्र जाना होगा</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Document Checklist Accordion */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-saffron-600" />
                            <span>कुल {docsList.length} ज़रूरी दस्तावेज</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleDocs(service.id)}
                            className="text-xs font-bold text-saffron-700 hover:text-saffron-900 flex items-center gap-1"
                          >
                            <span>{isExpanded ? "छिपाएं (Hide)" : "दस्तावेज व विकल्प देखें"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Collapsed Preview */}
                        {!isExpanded && (
                          <div className="text-[11px] text-slate-600 truncate">
                            {docsList.map((d: any) => lang === "hi" ? d.nameHi || d.name : d.name).join(" • ")}
                          </div>
                        )}

                        {/* Expanded Checklist with Alternatives */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-slate-200 space-y-2 animate-fadeIn">
                            {docsList.map((doc: any, dIdx: number) => {
                              const dName = lang === "hi" ? doc.nameHi || doc.name : doc.name;
                              const alts: string[] = doc.alternatives || [];
                              return (
                                <div key={doc.id || dIdx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                                  <div className="flex items-center justify-between font-bold text-slate-900">
                                    <span>{dIdx + 1}. {dName}</span>
                                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                      {doc.isMandatory ? "अनिवार्य" : "वैकल्पिक"}
                                    </span>
                                  </div>
                                  {alts.length > 0 && (
                                    <div className="text-[11px] text-slate-600">
                                      <span className="font-semibold text-slate-800">मान्य विकल्प: </span>
                                      {alts.join(" या ")}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* If Semi-Online: Warning on what originals to carry */}
                      {sMode === "SEMI_ONLINE" && carryDocs.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium">
                          <strong>⚠️ 1 बार दफ्तर जाते समय साथ ले जाने वाले मूल दस्तावेज:</strong>{" "}
                          {carryDocs.join(" • ")}
                        </div>
                      )}

                      {/* If Offline: Warning on what files to take */}
                      {sMode === "OFFLINE" && carryDocs.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-xs text-blue-950 font-medium">
                          <strong>🏛️ काउंटर पर ले जाने हेतु फाइल में तैयार रखें:</strong>{" "}
                          {carryDocs.join(" • ")}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center justify-end gap-2">
                        {sMode === "ONLINE" ? (
                          <Link
                            href={`/apply?serviceId=${service.id}`}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Laptop className="w-3.5 h-3.5" />
                            <span>यहाँ ऑनलाइन फॉर्म भरें</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : sMode === "SEMI_ONLINE" ? (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/apply?serviceId=${service.id}`}
                              className="px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                            >
                              <Laptop className="w-3.5 h-3.5" />
                              <span>फॉर्म भरें व प्री-चेक</span>
                            </Link>
                            <Link
                              href="/slots"
                              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
                            >
                              स्लॉट बुक करें
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/services/${service.id}`}
                            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>पूरी चेकलिस्ट व दफ्तर विवरण</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MAIN THING 2: TRACK APPLICATION (ENTER ID & LIVE STATUS)       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "TRACK" && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">
                {lang === "hi" ? "आवेदन की स्थिति ट्रैक करें" : "Track Your Application Status"}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "hi"
                  ? "आवेदन संख्या दर्ज करें और जानें कि आपकी फाइल किस अधिकारी की मेज पर है।"
                  : "Enter your tracking ID to see which officer desk your file is currently at."}
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="उदा. GZB-INC-2026-0001 या GZB-CAST-2026-0002"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setTrackQuery("GZB-INC-2026-0001")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  डेमो नंबर आज़माएं: GZB-INC-2026-0001
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-all"
                >
                  ट्रैक करें (Track Status)
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
