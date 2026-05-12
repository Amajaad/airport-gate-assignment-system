import { useStore } from "../store/useStore";
const ConflictMatrix = () => {
  const { flights, graphData, gates } = useStore();
  const activeFlights = flights.filter((f) => f.active);

  const hasTimingConflict = (id1, id2) => {
    if (!graphData?.edges) return false;
    // Ensure we compare strings to strings or numbers to numbers
    return graphData.edges.some(
      (e) => 
        (String(e.source) === String(id1) && String(e.target) === String(id2)) ||
        (String(e.source) === String(id2) && String(e.target) === String(id1))
    );
  };

  const hasCompatibilityConflict = (f1, f2) => {
    if (f1.id === f2.id || !gates || gates.length === 0) return false;

    // Get IDs of gates that fit aircraft 1
    const f1Gates = gates
      .filter((g) => g.compatible_aircraft.includes(f1.aircraft_size))
      .map((g) => g.id);

    // Get IDs of gates that fit aircraft 2
    const f2Gates = gates
      .filter((g) => g.compatible_aircraft.includes(f2.aircraft_size))
      .map((g) => g.id);

    // Conflict exists if they share NO gates in common
    const commonGates = f1Gates.filter((gId) => f2Gates.includes(gId));
    return commonGates.length === 0;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-3 text-slate-500 font-medium sticky left-0 bg-slate-50 z-10 border-r border-slate-200 text-left">
              Flight
            </th>
            {activeFlights.map((f) => (
              <th key={f.id} className="p-3 text-slate-700 font-semibold min-w-[60px] text-center border-r border-slate-100 last:border-r-0">
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

                let cellClass = "p-3 text-center transition-colors border-r border-slate-50 last:border-r-0 font-bold ";
                let symbol = "○";

                if (isSelf) {
                  cellClass += "bg-slate-50 text-slate-300";
                  symbol = "0";
                } 
                // TIMING CONFLICT (Red)
                else if (timingConflict) {
                  cellClass += "bg-rose-500 text-white";
                  symbol = "X";
                } 
                // SIZE CONFLICT (Greenish/Teal)
                else if (sizeConflict) {
                  cellClass += "bg-teal-500 text-white"; 
                  symbol = "X";
                } 
                // COMPATIBLE (Light neutral)
                else {
                  cellClass += "bg-white text-slate-300";
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

      {/* LEGEND */}
      <div className="p-4 bg-slate-50 flex gap-6 text-[10px] border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="bg-rose-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</span>
          <span className="text-slate-500">Timing Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-teal-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</span>
          <span className="text-slate-500">Size Conflict (Greenish)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-bold text-xs">○</span>
          <span className="text-slate-500">No Conflict</span>
        </div>
      </div>
    </div>
  );
};

export default ConflictMatrix;