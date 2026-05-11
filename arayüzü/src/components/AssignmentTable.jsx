import { useStore } from "../store/useStore";

const AssignmentTable = () => {
  const { flights, assignments, gates, gateColors } = useStore();

  // Show all active flights, even if they don't have an assignment
  const activeFlights = flights
    .filter((f) => f.active)
    .map((f) => {
      const gateId = assignments[f.id];
      const gateObj = gates.find((g) => g.id === gateId);
      return {
        id: f.id,
        gate_id: gateId,
        gate_size: gateObj ? gateObj.size : "",
        aircraft_size: f.aircraft_size,
        arrival: f.arrival,
        departure: f.departure,
      };
    });

  if (activeFlights.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-lg border border-dashed border-slate-300 italic">
        No active flights to display.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <th className="p-4">Flight</th>
            <th className="p-4">Gate</th>
            <th className="p-4">Schedule</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {activeFlights.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{a.id}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                    {a.aircraft_size}
                  </span>
                </div>
              </td>
              <td className="p-4">
                {a.gate_id ? (
                  <span
                    className="px-3 py-1 rounded-full text-white text-[11px] font-black shadow-sm inline-block"
                    style={{
                      backgroundColor: gateColors[a.gate_id] || "#cbd5e1",
                    }}
                  >
                    {a.gate_id}{" "}
                    <span className="text-white/70 font-normal">
                      ({a.gate_size})
                    </span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                    Unassigned
                  </span>
                )}
              </td>
              <td className="p-4 text-xs font-mono font-bold text-slate-600">
                <span className="text-emerald-600">{a.arrival}</span>
                <span className="mx-2 text-slate-300">→</span>
                <span className="text-rose-600">{a.departure}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
