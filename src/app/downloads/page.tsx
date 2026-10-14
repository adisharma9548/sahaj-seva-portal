"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  Download,
  FileCheck,
  Printer,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Search,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DownloadsPage() {
  const { lang, t } = useLanguage();
  const [approvedApps, setApprovedApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    fetch("/api/applications?status=APPROVED&limit=15")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setApprovedApps(data.applications || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrintCert = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="no-print space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Digitally Signed Certificate Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.downloads}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "स्वीकृत प्रमाण पत्र और रसीदें डाउनलोड करें। सभी दस्तावेजों में सार्वजनिक सत्यापन हेतु आधिकारिक क्यूआर कोड संलग्न है।"
            : "Download digitally signed government certificates and official receipts. All documents include tamper-evident QR verification codes."}
        </p>
      </div>

      {/* Certificate Viewer Modal / Card if clicked */}
      {selectedCert && (
        <div className="bg-white rounded-2xl border-4 border-navy-800 p-8 shadow-2xl space-y-6 relative print-only">
          <div className="no-print flex justify-end gap-2">
            <button
              onClick={handlePrintCert}
              className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setSelectedCert(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Official Certificate Form */}
          <div className="border-4 border-double border-amber-700/80 p-8 text-center space-y-6 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20 rounded-xl relative">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-saffron-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                UP
              </div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mt-2">
                Government of Uttar Pradesh • District Administration Ghaziabad
              </h2>
              <h3 className="text-xl sm:text-2xl font-black text-navy-900">
                {selectedCert.service?.nameHi || selectedCert.service?.name}
              </h3>
              <div className="text-xs font-mono text-gray-600">
                Certificate Ref: {selectedCert.trackingNumber}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="max-w-xl mx-auto bg-white/80 p-5 rounded-xl border border-amber-200/80 text-left text-xs sm:text-sm space-y-3">
              <p className="leading-relaxed text-gray-800">
                This is to certify that <strong>{selectedCert.citizenName}</strong>, resident of{" "}
                <strong>{selectedCert.office?.name || "Tehsil Sadar, Ghaziabad"}</strong>, has been duly verified under official district records.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 text-xs">
                <div>
                  <span className="text-gray-500 block">Service:</span>
                  <span className="font-bold text-gray-900">{selectedCert.service?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Aadhaar Last 4:</span>
                  <span className="font-bold text-gray-900">XXXX-XXXX-{selectedCert.citizenAadhaarLast4}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Issue Date:</span>
                  <span className="font-bold text-gray-900">{formatDate(selectedCert.updatedAt)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Visits Incurred:</span>
                  <span className="font-bold text-green-700">0 In-Person Visits</span>
                </div>
              </div>
            </div>

            {/* Footer with QR and Seal */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-300 max-w-xl mx-auto text-xs">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-white border border-gray-300 p-1 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-navy-900" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Scan to Verify</span>
                  <Link
                    href={`/verify/${selectedCert.trackingNumber}`}
                    className="text-xs font-bold text-saffron-700 hover:underline flex items-center gap-1"
                  >
                    <span>Verify Online</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-navy-900">Nayab Tehsildar / Competent Authority</div>
                <div className="text-gray-500 text-[11px]">Digitally Signed & Certified</div>
                <div className="text-green-700 font-bold text-[11px] mt-1">✓ Tamper Proof Document</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved Documents List */}
      <div className="no-print bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-navy-900">
          Ready for Instant Download
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : approvedApps.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            No completed certificates ready in this view yet.
          </div>
        ) : (
          <div className="space-y-3">
            {approvedApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-saffron-400 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy-900">
                      {app.citizenName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                      Digitally Signed
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {app.service?.name} • Ref: <span className="font-mono font-bold text-gray-800">{app.trackingNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCert(app)}
                    className="px-3.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-saffron-400" />
                    <span>View & Download PDF</span>
                  </button>
                  <Link
                    href={`/verify/${app.trackingNumber}`}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                    title="Public QR Verification"
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
