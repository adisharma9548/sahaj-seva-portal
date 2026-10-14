"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  TrendingDown,
  Phone,
  ShieldCheck,
  RefreshCw,
  Navigation,
} from "lucide-react";

export default function DistrictMapPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.officePerformance) {
          setOffices(data.officePerformance);
          setSelectedOffice(data.officePerformance[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geospatial Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Ghaziabad District Office Map & Performance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic view of all 8 district tehsils, transport, and municipal offices colored by repeat visit efficiency.
          </p>
        </div>
      </div>

      {/* Main Map & Office Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Interactive Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-saffron-400" />
              <span>Interactive District Territory Grid (Lat 28.66° N, Lng 77.45° E)</span>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> High (&gt;80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Low (&lt;70%)
              </span>
            </div>
          </div>

          {/* Styled Map Representation */}
          <div className="relative aspect-[16/10] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

            {/* Ghaziabad District boundary representation */}
            <div className="absolute inset-6 border border-slate-700/60 rounded-3xl pointer-events-none"></div>

            {/* Office Hotspots positioned proportionally by coordinates */}
            {offices.map((off) => {
              // Normalize Ghaziabad lat (28.64 to 28.84) and lng (77.28 to 77.58) to percentage
              const latMin = 28.63;
              const latMax = 28.85;
              const lngMin = 27.27; // clamp
              const lngActualMin = 77.26;
              const lngActualMax = 77.60;

              const topPercent = 90 - ((off.lat - latMin) / (latMax - latMin)) * 80;
              const leftPercent = ((off.lng - lngActualMin) / (lngActualMax - lngActualMin)) * 80 + 10;

              const isSelected = selectedOffice?.officeId === off.officeId;

              return (
                <button
                  key={off.officeId}
                  onClick={() => setSelectedOffice(off)}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg border-2 ${
                      off.efficiencyScore >= 80
                        ? "bg-emerald-600 border-emerald-300"
                        : off.efficiencyScore >= 70
                        ? "bg-amber-600 border-amber-300"
                        : "bg-red-600 border-red-300"
                    } ${isSelected ? "ring-4 ring-saffron-500/50" : ""}`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 top-9 bg-slate-950/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700 pointer-events-none">
                    {off.name.split(" ")[1] || off.name.split(" ")[0]} ({off.efficiencyScore}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Selected Office Inspection Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Office Performance Profile
          </div>

          {selectedOffice ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {selectedOffice.name}
                </h3>
                <div className="text-saffron-400 font-hindi text-xs mt-0.5">
                  {selectedOffice.nameHi}
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Zone: {selectedOffice.zone} • Tehsil: Ghaziabad District
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Efficiency</span>
                  <div className="text-xl font-black text-emerald-400">
                    {selectedOffice.efficiencyScore}/100
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Repeat Rate</span>
                  <div className="text-xl font-black text-amber-400">
                    {selectedOffice.repeatRate}%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Visits Processed:</span>
                  <span className="font-bold text-white">{selectedOffice.totalVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Repeat Visits Logged:</span>
                  <span className="font-bold text-red-400">{selectedOffice.repeatVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Geographic Coordinates:</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {selectedOffice.lat.toFixed(3)}°N, {selectedOffice.lng.toFixed(3)}°E
                  </span>
                </div>
              </div>

              <div className="pt-2 text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-saffron-400" />
                <span>Tehsil Office Line: 0120-2820101</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click an office marker on the map to inspect telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
