"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage, useAuth } from "@/components/providers/AppProviders";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  QrCode,
  Printer,
  Users,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

function SlotBookingContent() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const appIdParam = searchParams.get("appId") || "";

  const [offices, setOffices] = useState<any[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("OFF-TEH-SADAR");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Application lookup for booking
  const [applicationId, setApplicationId] = useState(appIdParam || "");

  // Generate next 5 dates
  const nextDates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    nextDates.push(d.toISOString().split("T")[0]);
  }

  useEffect(() => {
    if (!selectedDate && nextDates.length > 0) {
      setSelectedDate(nextDates[0]);
    }
  }, []);

  const loadSlots = () => {
    setLoading(true);
    fetch(`/api/slots?officeId=${selectedOfficeId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSlots(data.slots);
          if (data.offices && offices.length === 0) {
            setOffices(data.offices);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedOfficeId, selectedDate]);

  const handleBookSlot = async (slotId: string) => {
    setBookingLoading(true);
    try {
      // If no application ID provided, get or create a demo one
      let targetAppId = applicationId;
      if (!targetAppId) {
        const appsRes = await fetch("/api/applications?limit=1");
        const appsData = await appsRes.json();
        targetAppId = appsData.applications?.[0]?.id || "demo-app-id";
      }

      const res = await fetch("/api/slots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: targetAppId,
          slotId,
          citizenName: user?.name || "Ramesh Sharma",
          citizenPhone: user?.phone || "9999999999",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data);
      } else {
        alert(data.error || "Failed to book slot");
      }
    } catch (e) {
      console.error(e);
      alert("Error booking slot");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePrintToken = () => {
    window.print();
  };

  const activeOffice = offices.find((o) => o.id === selectedOfficeId) || offices[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="no-print space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>Physical Visit Minimization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.bookSlot}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "दफ्तर तभी जाएं जब कानूनन अनिवार्य हो। निश्चित 15-मिनट का समय चुनें — कतार में इंतजार मात्र 2 मिनट!"
            : "Physical visits are strictly limited to when legally unavoidable. Pick a guaranteed 15-minute slot with minimal queue wait."}
        </p>
      </div>

      {/* Booking Form or Confirmed Token */}
      {!confirmedBooking ? (
        <div className="space-y-6">
          {/* Office and Date Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Office Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Tehsil / Designated Office
                </label>
                <select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-saffron-500"
                >
                  {offices.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.zone})
                    </option>
                  ))}
                </select>
                {activeOffice && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                    <span>{activeOffice.address}</span>
                  </div>
                )}
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Appointment Date
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {nextDates.map((dStr) => (
                    <button
                      key={dStr}
                      onClick={() => setSelectedDate(dStr)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedDate === dStr
                          ? "bg-navy-800 text-white shadow-sm"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {new Date(dStr).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-navy-900">
                  Available 15-Minute Counter Slots for {selectedDate}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  Pre-verified files undergo high-speed counter verification in under 2 minutes.
                </div>
              </div>
              <button
                onClick={loadSlots}
                className="text-xs font-bold text-saffron-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No slots available on this date. Please select another day.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const isAvailable = slot.availableSpots > 0;

                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        isAvailable
                          ? "border-gray-200 hover:border-saffron-500 bg-white shadow-sm"
                          : "border-gray-100 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-navy-900">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isAvailable ? `${slot.availableSpots} left` : "Full"}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-saffron-600" />
                          <span>Estimated queue: ~{slot.estimatedWaitMins} mins</span>
                        </div>
                      </div>

                      <div className="pt-3 mt-2 border-t border-gray-100">
                        <button
                          disabled={!isAvailable || bookingLoading}
                          onClick={() => handleBookSlot(slot.id)}
                          className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                            isAvailable && !bookingLoading
                              ? "bg-navy-800 hover:bg-navy-900 text-white shadow-sm"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {bookingLoading ? "Reserving..." : "Reserve Slot & Get Token"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Confirmed QR E-Token Card */
        <div className="bg-white rounded-2xl border-2 border-saffron-400 p-6 sm:p-8 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-xl font-black">
            ✓
          </div>

          <div>
            <div className="text-xs uppercase font-bold text-saffron-600 tracking-wider">
              Guaranteed In-Person Appointment Confirmed
            </div>
            <h2 className="text-2xl font-black text-navy-900 mt-1">
              Token Number: <span className="text-saffron-600">{confirmedBooking.tokenNumber}</span>
            </h2>
            <div className="text-xs text-gray-600 mt-1">
              Visit duration is guaranteed under 2 minutes. Bring this QR code on your phone or on paper.
            </div>
          </div>

          {/* QR Code Card Display */}
          <div className="max-w-sm mx-auto bg-gradient-to-b from-gray-50 to-orange-50/40 border-2 border-dashed border-gray-300 p-6 rounded-2xl space-y-4">
            <div className="w-36 h-36 bg-white border border-gray-300 rounded-xl mx-auto flex flex-col items-center justify-center p-2 shadow-inner">
              <QrCode className="w-28 h-28 text-navy-900" />
              <span className="text-[10px] font-mono font-bold text-gray-500">
                {confirmedBooking.tokenNumber}
              </span>
            </div>

            <div className="text-left text-xs space-y-1.5 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-bold text-navy-900">{user?.name || "Ramesh Sharma"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Slot:</span>
                <span className="font-bold text-saffron-700">
                  {confirmedBooking.booking?.date} ({confirmedBooking.booking?.timeSlot})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Office:</span>
                <span className="font-bold text-navy-900 truncate max-w-[180px]">
                  {activeOffice?.name || "Tehsil Sadar"}
                </span>
              </div>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePrintToken}
              className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save E-Token</span>
            </button>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
            >
              Reschedule / Change Slot
            </button>
            <Link
              href="/track"
              className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-sm"
            >
              Back to Tracker
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SlotBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      }
    >
      <SlotBookingContent />
    </Suspense>
  );
}
