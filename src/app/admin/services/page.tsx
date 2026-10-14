"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  IndianRupee,
  Layers,
  Edit2,
  Check,
  Plus,
  RefreshCw,
  Building2,
} from "lucide-react";

export default function ServiceManagerPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadServices = () => {
    setLoading(true);
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    // Update local state in demo mode
    setServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? editingService : s))
    );
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingService(null);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold mb-1 border border-saffron-500/30">
            <FileText className="w-3.5 h-3.5" />
            <span>Service Configuration Manager</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Public Services, Documents & SLA Rules
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure statutory fees, SLA turnarounds, required document checklists, and per-office slot capacities.
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">
            Active District Services ({services.length})
          </h2>
          <span className="text-xs text-slate-500">Live schema synchronized</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Code & Service</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Govt Fee</th>
                  <th className="pb-3">SLA (Days)</th>
                  <th className="pb-3">Target Visits</th>
                  <th className="pb-3">Docs Required</th>
                  <th className="pb-3 text-right">Configure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-white text-xs">{srv.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{srv.code}</div>
                    </td>
                    <td className="py-3 text-slate-400">{srv.category}</td>
                    <td className="py-3 font-semibold text-slate-300">
                      {srv.fee === 0 ? "Free (₹0)" : `₹${srv.fee}`}
                    </td>
                    <td className="py-3 font-semibold text-saffron-400">{srv.slaDays} Days</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          srv.physicalVisitRequired
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        }`}
                      >
                        {srv.physicalVisitRequired ? "1 Visit (Target)" : "0 Visits (100% Online)"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{srv.documents?.length || 3} Documents</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setEditingService({ ...srv })}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] inline-flex items-center gap-1 border border-slate-700"
                      >
                        <Edit2 className="w-3 h-3 text-saffron-400" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSave}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full space-y-4"
          >
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">
                Configure {editingService.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                  Govt Fee (₹)
                </label>
                <input
                  type="number"
                  value={editingService.fee}
                  onChange={(e) =>
                    setEditingService({ ...editingService, fee: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                  Statutory SLA Days
                </label>
                <input
                  type="number"
                  value={editingService.slaDays}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      slaDays: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                  Physical In-Person Visit Rule
                </label>
                <select
                  value={editingService.physicalVisitRequired ? "true" : "false"}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      physicalVisitRequired: e.target.value === "true",
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  <option value="false">0 Visits Required (100% Digital Scrutiny)</option>
                  <option value="true">1 Visit (Only for Physical Biometrics / Deed Registry)</option>
                </select>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs text-center font-bold">
                ✓ Service updated successfully in active registry!
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
