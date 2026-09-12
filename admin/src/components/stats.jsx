import React, { useState, useEffect, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { TrendingUp, Package, IndianRupee, BarChart3, Download, Loader2 } from "lucide-react";

function Stats() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: "#000000" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#38bdf8" },
      links: { color: "#0284c7", distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.35 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getItems();
      const itemsList = Array.isArray(res.data?.data) ? res.data.data : [];
      setItems(itemsList);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const totalItemsCount = items.reduce((acc, item) => acc + (Number(item.available_quantity) || 0), 0);
  const totalValuation = items.reduce((acc, item) => {
    const qty = Number(item.available_quantity) || 0;
    const price = Number(item.price_per_unit) || 0;
    return acc + (qty * price);
  }, 0);
  const uniqueItemsCount = items.length;

  const handleDownloadExcel = () => {
    if (items.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Item Name,Quantity,Unit Price (INR),Total Value (INR)\n";

    items.forEach((item) => {
      const qty = Number(item.available_quantity) || 0;
      const price = Number(item.price_per_unit) || 0;
      const total = qty * price;
      const name = `"${(item.item_name || "").replace(/"/g, '""')}"`;
      csvContent += `${name},${qty},${price},${total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `item_statistics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen relative bg-[#000000] text-slate-100 ocean-gradient-bg overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles id="stats-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 pt-16 sm:pt-6">
        {/* Top Header & Export Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-sky-400" />
              ITEM STATISTICS
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              VIEW COMPREHENSIVE ITEM ANALYTICS AND EXPORT REPORTS
            </p>
          </div>

          <button
            onClick={handleDownloadExcel}
            disabled={items.length === 0}
            className="self-start md:self-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all transform hover:scale-[1.02] flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD EXCEL
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            <p className="text-slate-400 text-sm">Calculating statistics & valuation...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-400 bg-rose-500/10 rounded-3xl border border-rose-500/20 backdrop-blur-md">
            <p className="text-base font-semibold">Error loading statistics: {error}</p>
          </div>
        ) : (
          <>
            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Items Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl flex items-center justify-between group hover:border-sky-500/50 transition-all">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Items</p>
                  <h3 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {totalItemsCount.toLocaleString()}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Package className="w-7 h-7" />
                </div>
              </div>

              {/* Total Value Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl flex items-center justify-between group hover:border-sky-500/50 transition-all">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Value</p>
                  <h3 className="text-3xl font-extrabold text-sky-400 font-mono tracking-tight">
                    ₹{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <IndianRupee className="w-7 h-7" />
                </div>
              </div>

              {/* Unique Items Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl flex items-center justify-between group hover:border-sky-500/50 transition-all">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Unique Items</p>
                  <h3 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {uniqueItemsCount.toLocaleString()}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* ITEM BREAKDOWN Table */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden space-y-6 p-6 sm:p-8">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-extrabold text-white font-heading uppercase tracking-wide">
                  ITEM BREAKDOWN
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-base font-semibold">No items available to generate statistics.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-sm text-slate-200">
                    <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider text-xs border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-6">ITEM NAME</th>
                        <th className="py-4 px-6 text-center">QUANTITY</th>
                        <th className="py-4 px-6 text-right">UNIT PRICE</th>
                        <th className="py-4 px-6 text-right">TOTAL VALUE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                      {items.map((item) => {
                        const qty = Number(item.available_quantity) || 0;
                        const price = Number(item.price_per_unit) || 0;
                        const itemTotal = qty * price;

                        return (
                          <tr key={item._id} className="hover:bg-slate-900/80 transition-colors">
                            <td className="py-4 px-6 font-bold text-white font-heading">
                              {item.item_name}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-semibold">
                                {qty.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-mono text-slate-300">
                              ₹{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 px-6 text-right font-mono font-bold text-sky-400">
                              ₹{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Stats;
