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

    // Check if the intersection of compatible gates is empty

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
              <th
                key={f.id}
                className="p-3 text-slate-700 font-semibold min-w-[55px] text-center border-r border-slate-100 last:border-r-0"
              >
                <div className="flex flex-col">
                  <span>{f.id}</span>

                  <span className="text-[9px] font-normal text-slate-400 capitalize">
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
              className="border-b border-slate-100 last:border-b-0 group"
            >
              <td className="p-3 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200">
                <div className="flex flex-col">
                  <span>{f1.id}</span>

                  <span className="text-[9px] font-normal text-slate-400 capitalize">
                    {f1.aircraft_size}
                  </span>
                </div>
              </td>

              {activeFlights.map((f2) => {
                const isSelf = f1.id === f2.id;

                const timingConflict = hasTimingConflict(f1.id, f2.id);

                const sizeConflict = hasCompatibilityConflict(f1, f2);

                return (
                  <td
                    key={f2.id}
                    className={`p-3 text-center transition-colors border-r border-slate-50 last:border-r-0 relative

                      ${
                        isSelf
                          ? "bg-slate-50 text-slate-300"
                          : timingConflict
                            ? "bg-rose-50 text-rose-600 font-bold"
                            : sizeConflict
                              ? "bg-amber-50 text-amber-600 font-bold"
                              : "bg-emerald-50/30 text-emerald-600/50"
                      }`}
                  >
                    {isSelf
                      ? "0"
                      : timingConflict
                        ? "X"
                        : sizeConflict
                          ? "S"
                          : "○"}

                    {!isSelf && timingConflict && (
                      <span className="absolute top-0 right-0 w-full h-full opacity-75 bg-rose-400"></span>
                    )}

                    {!isSelf && sizeConflict && (
                      <span className="absolute top-0 right-0 w-full h-full opacity-75 bg-amber-400"></span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 bg-slate-50/50 flex gap-6 text-[10px] border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-rose-600 font-bold text-xs">✕</span>{" "}
          <span className="text-slate-500">Timing Conflict</span>
        </div>

        {/* <div className="flex items-center gap-2">

          <span className="text-amber-600 font-bold text-xs">S</span>{" "}

          <span className="text-slate-500">Size Conflict (Incompatible)</span>

        </div>*/}

        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold text-xs">○</span>{" "}
          <span className="text-slate-500">Compatible</span>
        </div>
      </div>

      {activeFlights.length === 0 && (
        <div className="p-8 text-center text-slate-400 italic">
          No active flights to display matrix
        </div>
      )}
    </div>
  );
};

export default ConflictMatrix;
