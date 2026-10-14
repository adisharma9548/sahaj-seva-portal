"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Layers,
  Laptop,
  Calendar,
  Building2,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";

export default function ServicesPage() {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProcessMode, setSelectedProcessMode] = useState("ALL");
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
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const docNames = (s.documents || []).map((d: any) => d.name.toLowerCase()).join(" ");
    const docAlts = (s.documents || []).flatMap((d: any) => d.alternatives || []).join(" ").toLowerCase();

    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      (s.nameHi && s.nameHi.includes(q)) ||
      s.description.toLowerCase().includes(q) ||
      docNames.includes(q) ||
      docAlts.includes(q);

    const sMode = s.processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE");
    const matchesMode = selectedProcessMode === "ALL" || sMode === selectedProcessMode;

    return matchesSearch && matchesMode;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>Ghaziabad Citizen Service Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {lang === "hi" ? "सेवा एवं दस्तावेज मार्गदर्शिका" : "Services & Document Directory"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {lang === "hi"
            ? "दफ्तर के चक्करों से बचने के लिए स्पष्ट वर्गीकरण: कौन सा फॉर्म 100% घर बैठे भरा जा सकता है, किसमें 1 बार तय 15 मिनट स्लॉट पर जाना है, और किसमें दफ्तर जाने से पहले क्या मूल कागज साथ ले जाने हैं।"
            : "Clear categorization: what can be filled 100% online from home, what requires 1 scheduled 15-minute slot visit, and what mandatory documents to carry for offline counters."}
        </p>

        {/* E-District Alternative Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm">
          <span className="text-xl">⚡</span>
          <span>
            {lang === "hi"
              ? "7 सेवाएं यहाँ सीधे ऑनलाइन भरी जा सकती हैं (0 चक्कर) • 3 सेमी-ऑनलाइन सेवाएं (1 तय स्लॉट) • 3 ऑफलाइन केंद्र सेवाएं (कागज़ात जांचें)"
              : "7 Services completely online (0 visits) • 3 Semi-online (1 scheduled slot) • 3 Offline counters (check documents first)"}
          </span>
        </div>
      </div>

      {/* Filters Bar: Search & 4 Process Mode Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === "hi"
                ? "सेवा या दस्तावेज का नाम खोजें (उदा. आधार, बिजली बिल)..."
                : "Search service or document name (e.g. Aadhaar, Ration)..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 font-medium"
          />
        </div>

        {/* Process Mode Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedProcessMode("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedProcessMode === "ALL"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            📋 {lang === "hi" ? `सभी (${services.length})` : `All (${services.length})`}
          </button>

          <button
            onClick={() => setSelectedProcessMode("ONLINE")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedProcessMode === "ONLINE"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>🟢 {lang === "hi" ? `100% ऑनलाइन (${onlineCount})` : `100% Online (${onlineCount})`}</span>
          </button>

          <button
            onClick={() => setSelectedProcessMode("SEMI_ONLINE")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedProcessMode === "SEMI_ONLINE"
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>🟡 {lang === "hi" ? `सेमी-ऑनलाइन (${semiCount})` : `Semi-Online (${semiCount})`}</span>
          </button>

          <button
            onClick={() => setSelectedProcessMode("OFFLINE")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedProcessMode === "OFFLINE"
                ? "bg-blue-800 text-white shadow-sm"
                : "bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>🔵 {lang === "hi" ? `ऑफलाइन केंद्र (${offlineCount})` : `Offline Only (${offlineCount})`}</span>
          </button>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
          <p className="text-gray-500 text-sm font-medium">
            {lang === "hi" ? "कोई सेवा नहीं मिली। कृपया पुनः खोजें।" : "No services found matching your criteria."}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedProcessMode("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-saffron-500 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((service) => {
            const displayName = lang === "hi" ? service.nameHi || service.name : service.name;
            const displayDesc =
              lang === "hi" ? service.descriptionHi || service.description : service.description;
            const sMode =
              service.processType || (service.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE");
            const isExpanded = !!expandedDocs[service.id];
            const docsList: any[] = service.documents || [];
            const carryDocs: string[] = service.carryDocs || [];

            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-lg p-6 relative overflow-hidden ${
                  sMode === "ONLINE"
                    ? "border-emerald-300"
                    : sMode === "SEMI_ONLINE"
                    ? "border-amber-300"
                    : "border-blue-300"
                }`}
              >
                {/* Top strip */}
                <div
                  className={`w-full h-1.5 absolute top-0 left-0 ${
                    sMode === "ONLINE"
                      ? "bg-emerald-500"
                      : sMode === "SEMI_ONLINE"
                      ? "bg-amber-500"
                      : "bg-blue-600"
                  }`}
                ></div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-50 text-navy-800 border border-navy-100">
                      {service.category} • {service.officeType}
                    </span>

                    {sMode === "ONLINE" ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>🟢 100% घर बैठे (0 चक्कर)</span>
                      </span>
                    ) : sMode === "SEMI_ONLINE" ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        <span>🟡 1 तय स्लॉट (मूल दस्तावेज)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>🔵 ऑफलाइन केंद्र अनिवार्य</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-navy-900 leading-snug">
                      {displayName}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        {t.fee}
                      </span>
                      <span className="font-extrabold text-gray-900">
                        {service.fee === 0 ? "Free (₹0)" : `₹${service.fee}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        {t.timeRequired}
                      </span>
                      <span className="font-extrabold text-gray-900">
                        {service.slaDays} {lang === "hi" ? "दिन" : "Days SLA"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        {t.office}
                      </span>
                      <span className="font-extrabold text-gray-900 truncate block">
                        {service.officeType}
                      </span>
                    </div>
                  </div>

                  {/* DOCUMENT ACCORDION */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-navy-900 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-saffron-600" />
                        <span>
                          {lang === "hi"
                            ? `📋 कुल ${docsList.length} ज़रूरी दस्तावेज`
                            : `📋 ${docsList.length} Required Documents`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDocs(service.id)}
                        className="text-xs font-bold text-saffron-700 hover:text-saffron-800 hover:underline flex items-center gap-1"
                      >
                        <span>{isExpanded ? "छिपाएं (Hide)" : "दस्तावेज व विकल्प देखें"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {!isExpanded && docsList.length > 0 && (
                      <div className="text-[11px] text-gray-500 truncate">
                        {docsList.map((d: any) => lang === "hi" ? d.nameHi || d.name : d.name).join(" • ")}
                      </div>
                    )}

                    {isExpanded && (
                      <div className="pt-2 border-t border-gray-200 space-y-2 animate-fadeIn">
                        {docsList.map((doc: any, dIdx: number) => {
                          const dName = lang === "hi" ? doc.nameHi || doc.name : doc.name;
                          const alts: string[] = doc.alternatives || [];
                          return (
                            <div
                              key={doc.id || dIdx}
                              className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900">
                                  {dIdx + 1}. {dName}
                                </span>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                  {doc.isMandatory ? "अनिवार्य" : "वैकल्पिक"}
                                </span>
                              </div>
                              {alts.length > 0 && (
                                <div className="text-[11px] text-gray-600">
                                  <span className="font-semibold text-navy-800">मान्य विकल्प: </span>
                                  {alts.join(" या ")}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CARRY ORIGINALS ALERT FOR SEMI-ONLINE */}
                  {sMode === "SEMI_ONLINE" && carryDocs.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>दफ्तर में सत्यापन हेतु मूल दस्तावेज साथ ले जाएं:</span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] text-amber-950 font-medium">
                        {carryDocs.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CARRY ORIGINALS ALERT FOR OFFLINE */}
                  {sMode === "OFFLINE" && carryDocs.length > 0 && (
                    <div className="p-3 rounded-xl bg-blue-50 border-2 border-blue-300 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900">
                        <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                        <span>काउंटर पर यह फाइल तैयार रखें:</span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] text-blue-950 font-medium">
                        {carryDocs.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors shrink-0"
                  >
                    {lang === "hi" ? "विस्तृत नियम →" : "Plain Guide →"}
                  </Link>

                  {sMode === "ONLINE" ? (
                    <Link
                      href={`/apply?serviceId=${service.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "100% ऑनलाइन भरें" : "Apply 100% Online"}</span>
                    </Link>
                  ) : sMode === "SEMI_ONLINE" ? (
                    <Link
                      href={`/apply?serviceId=${service.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "फॉर्म भरें व प्री-चेक" : "Apply & Pre-Check"}</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/services/${service.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "पूरी चेकलिस्ट देखें" : "View Checklist"}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
