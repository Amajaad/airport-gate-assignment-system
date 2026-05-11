import { useState } from "react";
import { useStore } from "../store/useStore";

const GateManager = () => {
  const { gates, addGate, removeGate, gateColors } = useStore();
  const [selectedSize, setSelectedSize] = useState("medium");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Gate Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          >
            <option value="small">Small (Light Jets only)</option>
            <option value="medium">Medium (Narrowbody )</option>
            <option value="large">Large (Widebody ONLY)</option>
          </select>{" "}
        </div>
        <button
          onClick={() => addGate(selectedSize)}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Gate
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className="group relative bg-white border border-slate-200 rounded-xl p-4 transition-all hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: gateColors[gate.id] || "#cbd5e1" }}
              ></div>
              <span className="font-black text-slate-800">{gate.id}</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
              {gate.size}
            </div>

            <button
              onClick={() => removeGate(gate.id)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-rose-600"
              title="Remove Gate"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        {gates.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No gates in inventory. Add one to begin assignments.
          </div>
        )}
      </div>
    </div>
  );
};

export default GateManager;
