import { create } from "zustand";
import client from "../api/client";

export const useStore = create((set, get) => ({
  flights: [],
  gates: [],
  assignments: {},
  graphData: null,
  chromaticNumber: 0,
  theoreticalMin: 0,
  gateColors: {},

  loadScenario: async (name) => {
    try {
      await client.post(`/load/${name}`);
      const res = await client.get("/flights");
      const stateRes = await client.get("/state");
      set({ flights: res.data, gates: stateRes.data.gates });
      await get().solve(); // Auto-solve after loading
    } catch (err) {
      console.error(
        "Loading Error:",
        err.response?.data?.detail || err.message,
      );
    }
  },

  toggleFlight: async (id) => {
    await client.put(`/flights/${id}/toggle`);
    const res = await client.get("/flights");
    set({ flights: res.data });
    await get().solve(); // Re-calculate constraints after toggle
  },

  addGate: async (size) => {
    await client.post(`/gates?size=${size}`);
    const stateRes = await client.get("/state");
    set({ gates: stateRes.data.gates });
    await get().solve();
  },

  removeGate: async (id) => {
    await client.delete(`/gates/${id}`);
    const stateRes = await client.get("/state");
    set({ gates: stateRes.data.gates });
    await get().solve();
  },

  solve: async () => {
    const res = await client.post("/solve");
    const { assignments, chromatic_number, theoretical_min, graph_data } =
      res.data;

    // Generate colors for each gate
    const palette = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#82E0AA",
      "#85C1E9",
      "#F1948A",
    ];
    const uniqueGates = [...new Set(Object.values(assignments))];
    const gateColors = {};
    uniqueGates.forEach((gate, i) => {
      gateColors[gate] = palette[i % palette.length];
    });

    set({
      assignments,
      chromaticNumber: chromatic_number,
      theoreticalMin: theoretical_min,
      graphData: graph_data,
      gateColors,
    });
  },
}));
