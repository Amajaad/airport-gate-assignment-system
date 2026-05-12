import { useState, useEffect } from "react";
import { useStore } from "./store/useStore";
import GanttChart from "./components/GanttChart";
import ConflictMatrix from "./components/ConflictMatrix";
import ConflictGraph from "./components/ConflictGraph";
import GateManager from "./components/GateManager";
import AssignmentTable from "./components/AssignmentTable";
import './index.css'
export default function App() {
  const {
    loadScenario,
    chromaticNumber,
    theoreticalMin,
    flights,
    toggleFlight,
    assignments,
  } = useStore();

  const [activeTab, setActiveTab] = useState("gantt");

  // Track which scenario is currently active
  const [activeScenario, setActiveScenario] = useState("scenario_light");

  // Load the initial scenario on mount
  useEffect(() => {
    loadScenario("scenario_light");
  }, [loadScenario]);

  const activeCount = flights.filter((f) => f.active).length;

  // Configuration for the scenario buttons
  const scenarioOptions = [
    { id: "scenario_light", label: "Light" },
    { id: "scenario_moderate", label: "Moderate" },
    { id: "scenario_peak", label: "Peak" },
    { id: "high_pressure_morning_wave", label: "High Pressure" },
  ];

  const tabs = [
    {
      id: "gantt",
      label: "Schedule",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "table",
      label: "Assignment List",
      icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
    },
    {
      id: "matrix",
      label: "Conflict Matrix",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    {
      id: "graph",
      label: "Conflict Graph",
      icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
    },
    {
      id: "gates",
      label: "Gate Inventory",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
  ];

  const handleScenarioClick = (id) => {
    setActiveScenario(id);
    loadScenario(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Gate <span className="text-indigo-600">Allocator</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Dynamic Scenario Buttons */}
            {scenarioOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleScenarioClick(option.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm border cursor-pointer ${
                  activeScenario === option.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            ))}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px]">Flights</span>
                <span className="text-slate-900">{activeCount}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  {/* Theoretical Minimum Display */}
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px]">Min. Needed</span>
                    <span className="text-indigo-600 font-medium">{theoreticalMin}</span>
                  </div>
              
                  {/* Gates Assigned Display */}
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px]">Gates Assigned</span>
                    <span className={`font-medium ${chromaticNumber < theoreticalMin ? 'text-red-500' : 'text-emerald-600'}`}>
                      {chromaticNumber}
                    </span>
                  </div>
                </div>
              
                {/* Error Message Logic */}
                {chromaticNumber < theoreticalMin && (
                  <span className="text-red-500 text-[10px] font-bold italic">
                    ⚠ Not all flights are assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all font-semibold text-sm
                  ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
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
                    strokeWidth="2"
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="animate-in fade-in duration-500">
          {activeTab === "gantt" && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Gate Assignment Schedule
              </h2>
              <GanttChart />
            </section>
          )}

          {activeTab === "table" && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Detailed Assignment List
              </h2>
              <AssignmentTable />
            </section>
          )}

          {activeTab === "matrix" && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Conflict Matrix
              </h2>
              <ConflictMatrix />
            </section>
          )}

          {activeTab === "graph" && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Colored Conflict Graph
              </h2>
              <ConflictGraph />
            </section>
          )}

          {activeTab === "gates" && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Gate Management
              </h2>
              <GateManager />
            </section>
          )}
        </div>

        {/* Flight Inventory */}
        <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Flight Inventory</h2>
              <p className="text-slate-400 text-sm">
                Toggle flights to see real-time algorithmic adjustments.
              </p>
            </div>
            <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">
              {activeCount} Active / {flights.length} Total
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {flights.map((f) => {
              const isUnassigned = f.active && !assignments[f.id];
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFlight(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border
                    ${
                      f.active
                        ? isUnassigned
                          ? "bg-rose-500/10 border-rose-500/50 text-rose-600 hover:bg-rose-500/20 shadow-inner shadow-rose-100"
                          : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-750"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${f.active ? (isUnassigned ? "bg-rose-500 animate-pulse" : "bg-indigo-400") : "bg-slate-600"}`}
                  ></span>
                  {f.id} <br />
                  {f.aircraft_size}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto py-8 text-center text-slate-400 text-xs">
        Airport Flight Gate Assignment System • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
