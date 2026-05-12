import { useStore } from "../store/useStore";

const ConflictMatrix = () => {
  const { flights, graphData, gates } = useStore();
  const activeFlights = flights.filter((f) => f.active);

  const hasTimingConflict = (id1, id2) => {
    return graphData?.edges.some(
      (e) =>
        (e.source === id1 && e.target === id2) ||
        (e.source === id2 && e.target === id1),
    );
  };

  const hasCompatibilityConflict = (f1, f2) => {
    if (f1.id === f2.id) return false;
    const f1Gates = gates
      .filter((g) => g.compatible_aircraft.includes(f1.aircraft_size))
      .map((g) => g.id);
    const f2Gates = gates
      .filter((g) => g.compatible_aircraft.includes(f2.aircraft_size))
      .map((g) => g.id);

    const commonGates = f1Gates.filter((gId) => f2Gates.includes(gId));
    return commonGates.length === 0;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-3 text-slate-500 font-medium sticky left-0 bg-slate-50 z-10 border-r border-slate-200 uppercase tracking-wider">
              Flight
            </th>
            {activeFlights.map((f) => (
              <th
                key={f.id}
                className="p-3 text-slate-700 font-semibold min-w-[60px] text-center border-r border-slate-100 last:border-r-0"
              >
                <div className="flex flex-col">
                  <span className="text-[12px]">{f.id}</span>
                  <span className="text-[8px] font-normal text-slate-400 uppercase">
                    {f.aircraft_size}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeFlights.map((f1) => (
            <tr key={f1.id} className="border-b border-slate-100 last:border-b-0 group">
              <td className="p-3 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200">
                <div className="flex flex-col">
                  <span className="text-[12px]">{f1.id}</span>
                  <span className="text-[8px] font-normal text-slate-400 uppercase">
                    {f1.aircraft_size}
                  </span>
                </div>
              </td>
              {activeFlights.map((f2) => {
                const isSelf = f1.id === f2.id;
                const timingConflict = hasTimingConflict(f1.id, f2.id);
                const sizeConflict = hasCompatibilityConflict(f1, f2);

                // Determine styling based on priority: Self > Timing > Size > OK
                let cellStyles = "bg-white text-slate-300";
                let symbol = "○";

                if (isSelf) {
                  cellStyles = "bg-slate-50 text-slate-300";
                  symbol = "—";
                } else if (timingConflict) {
                  cellStyles = "bg-red-500 text-white font-black"; // High contrast red
                  symbol = "✕";
                } else if (sizeConflict) {
                  cellStyles = "bg-amber-400 text-amber-950 font-black"; // High contrast amber
                  symbol = "S";
                } else {
                  cellStyles = "bg-emerald-50 text-emerald-600 font-medium";
                  symbol = "○";
                }

                return (
                  <td
                    key={f2.id}
                    className={`p-3 text-center transition-colors border-r border-slate-100 last:border-r-0 text-[13px] ${cellStyles}`}
                  >
                    {symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="p-4 bg-slate-50 flex flex-wrap gap-6 text-[11px] border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded text-[10px] font-bold">✕</span>
          <span className="text-slate-600 font-medium">Timing Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-amber-400 text-amber-950 rounded text-[10px] font-bold">S</span>
          <span className="text-slate-600 font-medium">Size Conflict (No Shared Gates)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[10px] font-bold">○</span>
          <span className="text-slate-600 font-medium">Compatible</span>
        </div>
      </div>

      {activeFlights.length === 0 && (
        <div className="p-12 text-center text-slate-400 italic bg-white">
          No active flights to display matrix
        </div>
      )}
    </div>
  );
};

export default ConflictMatrix;