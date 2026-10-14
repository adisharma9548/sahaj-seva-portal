"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function QueueSlotUtilizationPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSlots = () => {
    setLoading(true);
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSlots(data.slots || []);
          setOffices(data.offices || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const totalCapacity = slots.reduce((acc, s) => acc + s.capacity, 0);
  const totalBooked = slots.reduce((acc, s) => acc + s.bookedCount, 0);
  const utilizationPercent = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 74;

  const hourlyDistribution = [
    { time: "10:00 AM", booked: 42, capacity: 50 },
    { time: "10:30 AM", booked: 48, capacity: 50 },
    { time: "11:00 AM", booked: 49, capacity: 50 },
    { time: "11:30 AM", booked: 38, capacity: 50 },
    { time: "02:00 PM", booked: 45, capacity: 50 },
    { time: "02:30 PM", booked: 32, capacity: 50 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Capacity & Queue Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Queue and Slot Utilization
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize counter throughput, monitor peak hours, and minimize citizen queue wait times.
          </p>
        </div>
        <button
          onClick={loadSlots}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Slot Capacity Utilization</span>
          <div className="text-3xl font-black text-saffron-400">{utilizationPercent}%</div>
          <span className="text-xs text-slate-500">{totalBooked} of {totalCapacity} slots booked</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Wait Time</span>
          <div className="text-3xl font-black text-emerald-400">1.8 <span className="text-xs font-normal text-slate-400">Mins</span></div>
          <span className="text-xs text-emerald-500">Down from 55 mins baseline</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">No-Show Rate</span>
          <div className="text-3xl font-black text-slate-300">5.8%</div>
          <span className="text-xs text-slate-500">Reminded via automated SMS</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Peak Congestion Window</span>
          <div className="text-2xl font-black text-sky-400">11:00 AM</div>
          <span className="text-xs text-sky-500">98% capacity reached</span>
        </div>
      </div>

      {/* Hourly Utilization Chart */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-saffron-400" />
          <span>Hourly Slot Bookings vs Total Capacity</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#fff", fontSize: 12 }}
              />
              <Bar dataKey="booked" fill="#E8710A" name="Booked Slots" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" fill="#334155" name="Capacity" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
