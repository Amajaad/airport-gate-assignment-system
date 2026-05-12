import { useStore } from "../store/useStore";

const ConflictMatrix = () => {
  const { flights, graphData, gates } = useStore();
  const activeFlights = flights.filter((f) => f.active);

  const hasTimingConflict = (id1, id2) => {
    return graphData?.edges.some(
      (e) => (e.source === id1 && e.target === id2) || (e.source === id2 && e.target === id1)
    );
  };

  const hasCompatibilityConflict = (f1, f2) => {
    if (f1.id === f2.id) return false;
    const f1Gates = gates.filter((g) => g.compatible_aircraft.includes(f1.aircraft_size)).map((g) => g.id);
    const f2Gates = gates.filter((g) => g.compatible_aircraft.includes(f2.aircraft_size)).map((g) => g.id);
    const commonGates = f1Gates.filter((gId) => f2Gates.includes(gId));
    return commonGates.length === 0;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-3 text-slate-500 font-medium sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
              Flight
            </th>
            {activeFlights.map((f) => (
              <th key={f.id} className="p-3 text-slate-700 font-semibold min-w-[55px] text-center border-r border-slate-100 last:border-r-0">
                <div className="flex flex-col">
                  <span>{f.id}</span>
                  <span className="text-[9px] font-normal text-slate-400 capitalize">{f.aircraft_size}</span>
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
                  <span>{f1.id}</span>
                  <span className="text-[9px] font-normal text-slate-400 capitalize">{f1.aircraft_size}</span>
                </div>
              </td>

              {activeFlights.map((f2) => {
                const isSelf = f1.id === f2.id;
                const timingConflict = hasTimingConflict(f1.id, f2.id);
                const sizeConflict = hasCompatibilityConflict(f1, f2);

                // Style Logic
                let cellClass = "p-3 text-center transition-colors border-r border-slate-50 last:border-r-0 font-bold ";
                let symbol = "○";

                if (isSelf) {
                  cellClass += "bg-slate-50 text-slate-300";
                  symbol = "0";
                } else if (timingConflict) {
                  cellClass += "bg-rose-500 text-white"; // Red BG, White X
                  symbol = "X";
                } else if (sizeConflict) {
                  cellClass += "bg-amber-400 text-amber-950"; // Yellow BG, Dark X (very clear)
                  symbol = "X";
                } else {
                  cellClass += "bg-emerald-50 text-emerald-600";
                  symbol = "○";
                }

                return (
                  <td key={f2.id} className={cellClass}>
                    {symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="p-4 bg-slate-50/50 flex gap-6 text-[10px] border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="bg-rose-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</span>
          <span className="text-slate-500">Timing Conflict</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-amber-950 w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</span>
          <span className="text-slate-500">Size Conflict</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold text-xs">○</span>
          <span className="text-slate-500">Compatible</span>
        </div>
      </div>
    </div>
  );
};

export default ConflictMatrix;