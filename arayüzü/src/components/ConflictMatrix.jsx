import { useStore } from "../store/useStore";

const ConflictMatrix = () => {
  const { flights, graphData, gates } = useStore();
  const activeFlights = flights.filter((f) => f.active);

  // Checks if there's a timing conflict from the backend graph
  const hasTimingConflict = (id1, id2) => {
    return graphData?.edges.some(
      (e) =>
        (e.source === id1 && e.target === id2) ||
        (e.source === id2 && e.target === id1),
    );
  };

  // Checks if two flights share ANY compatible gates
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
          <tr className="bg-slate-100 border-b border-slate-300">
            <th className="p-3 text-slate-600 font-bold sticky left-0 bg-slate-100 z-20 border-r border-slate-300">
              Flight
            </th>
            {activeFlights.map((f) => (
              <th
                key={f.id}
                className="p-3 text-slate-700 font-bold min-w-[60px] text-center border-r border-slate-200 last:border-r-0"
              >
                <div className="flex flex-col">
                  <span>{f.id}</span>
                  <span className="text-[9px] font-medium text-slate-500 uppercase">
                    {f.aircraft_size}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeFlights.map((f1) => (
            <tr
              key={f1.id}
              className="border-b border-slate-200 last:border-b-0 group"
            >
              <td className="p-3 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-300">
                <div className="flex flex-col">
                  <span>{f1.id}</span>
                  <span className="text-[9px] font-normal text-slate-400 uppercase">
                    {f1.aircraft_size}
                  </span>
                </div>
              </td>
              {activeFlights.map((f2) => {
                const isSelf = f1.id === f2.id;
                const timingConflict = hasTimingConflict(f1.id, f2.id);
                const sizeConflict = hasCompatibilityConflict(f1, f2);

                // Determine styling based on priority: Self > Timing > Size > Compatible
                let cellStyles = "bg-white text-slate-400";
                let symbol = "○";

                if (isSelf) {
                  cellStyles = "bg-slate-100 text-slate-300";
                  symbol = "0";
                } else if (timingConflict) {
                  cellStyles = "bg-red-600 text-white font-black"; // High contrast red
                  symbol = "X";
                } else if (sizeConflict) {
                  cellStyles = "bg-amber-500 text-white font-black"; // High contrast amber
                  symbol = "S";
                } else {
                  cellStyles = "bg-emerald-50 text-emerald-700 font-bold"; // Soft green for clarity
                  symbol = "○";
                }

                return (
                  <td
                    key={f2.id}
                    className={`p-3 text-center transition-colors border-r border-slate-100 last:border-r-0 text-sm ${cellStyles}`}
                  >
                    {symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend Section - Symbols kept as requested, styles improved for visibility */}
      <div className="p-4 bg-slate-50 flex gap-8 text-[11px] border-t border-slate-200 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-red-600 text-white rounded text-[10px] font-bold">X</span>
          <span className="text-slate-700">Timing Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-amber-500 text-white rounded text-[10px] font-bold">S</span>
          <span className="text-slate-700">Size Conflict (Incompatible)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[10px] font-bold">○</span>
          <span className="text-slate-700">Compatible</span>
        </div>
      </div>

      {activeFlights.length === 0 && (
        <div className="p-12 text-center text-slate-400 italic bg-slate-50">
          No active flights to display matrix
        </div>
      )}
    </div>
  );
};

export default ConflictMatrix;