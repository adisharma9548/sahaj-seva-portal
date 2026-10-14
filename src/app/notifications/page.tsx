"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  Bell,
  MessageSquare,
  Smartphone,
  CheckCheck,
  Search,
  ExternalLink,
  Clock,
  RefreshCw,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { lang, t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const loadNotifications = () => {
    setLoading(true);
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    const matchesChannel = filterChannel === "ALL" || n.channel === filterChannel;
    const matchesSearch =
      n.recipientPhone.includes(search) ||
      n.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold">
          <Bell className="w-3.5 h-3.5" />
          <span>Simulated Citizen Communications Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {t.notifications}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {lang === "hi"
            ? "सभी स्वचालित एसएमएस और व्हाट्सएप सूचनाएं (डेमो मोड में कोई वास्तविक संदेश प्रेषित नहीं होता)।"
            : "Live log of automated SMS & WhatsApp dispatches. In Demo Mode, messages are securely logged here with zero external carrier charges."}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone number, citizen name, or message..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "SMS", "WHATSAPP"].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterChannel === ch
                  ? "bg-navy-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {ch}
            </button>
          ))}
          <button
            onClick={loadNotifications}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications Feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
          No notifications recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-saffron-400 shadow-sm transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${
                      item.channel === "WHATSAPP"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.channel === "WHATSAPP" ? (
                      <MessageSquare className="w-3 h-3" />
                    ) : (
                      <Smartphone className="w-3 h-3" />
                    )}
                    <span>{item.channel}</span>
                  </span>
                  <span className="font-extrabold text-xs text-navy-900">
                    To: {item.recipientName} ({item.recipientPhone})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>{formatDateTime(item.timestamp)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed font-sans">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
