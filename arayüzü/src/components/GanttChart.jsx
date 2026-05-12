import { Chart } from "react-google-charts";
import { useStore } from "../store/useStore";

const GanttChart = () => {
  const { flights, assignments, gates, gateColors } = useStore();

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const activeFlights = flights.filter((f) => f.active && assignments[f.id]);

  // --- DYNAMIC HEIGHT CALCULATION ---
  const trackHeight = 40;
  const headerHeight = 50; // Padding for the timeline header
  const dynamicHeight = activeFlights.length * trackHeight + headerHeight;

  const rows = activeFlights.map((f) => {
    const [startH, startM] = f.arrival.split(":").map(Number);
    const [endH, endM] = f.departure.split(":").map(Number);

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endH, endM);

    const gateId = assignments[f.id];
    const gateObj = gates.find((g) => g.id === gateId);
    const gateLabel = gateObj ? `${gateId} (${gateObj.size})` : gateId;

    return [f.id, `Flight ${f.id} (${f.aircraft_size})`, gateLabel, startDate, endDate, null, 100, null];
  });

  const data = [columns, ...rows];

  const options = {
    height: dynamicHeight, // Use calculated height here
    gantt: {
      trackHeight: trackHeight,
      labelStyle: {
        fontName: "Inter, system-ui, sans-serif",
        fontSize: 12,
        color: "#475569",
      },
      criticalPathEnabled: false,
      innerGridHorizLine: { stroke: "#f1f5f9", strokeWidth: 1 },
      innerGridTrack: { fill: "#ffffff" },
      innerGridDarkTrack: { fill: "#f8fafc" },
    },
  };

  if (activeFlights.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
        No active assignments to display in chart.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-inner border border-slate-100 p-4">

      <div className="overflow-x-auto">
        <Chart
          chartType="Gantt"
          width="100%"
          height={`${dynamicHeight}px`} // Pass the dynamic height as a string with px
          data={data}
          options={options}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 px-2">
        {Object.entries(gateColors).map(([gate, color]) => {
          const g = gates.find((it) => it.id === gate);
          return (
            <div key={gate} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                {gate} <span className="text-slate-300 font-normal">({g?.size || "?"})</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;