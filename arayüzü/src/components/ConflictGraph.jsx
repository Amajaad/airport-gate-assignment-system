import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { useStore } from "../store/useStore";

const ConflictGraph = () => {
  const cyRef = useRef(null);
  const { graphData, assignments, gateColors } = useStore();

  useEffect(() => {
    if (!graphData || !cyRef.current) return;

    const elements = [
      ...graphData.nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.id,
          gate: assignments[n.id],
          color: gateColors[assignments[n.id]] || "#64748b",
        },
      })),
      ...graphData.edges.map((e) => ({
        data: {
          source: e.source,
          target: e.target,
          type: e.conflict_type || "timing",
        },
      })),
    ];

    const cy = cytoscape({
      container: cyRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "data(color)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            width: 45,
            height: 45,
            "font-size": "10px",
            "font-weight": "bold",
            "border-width": 2,
            "border-color": "#fff",
            "text-outline-width": 1.5,
            "text-outline-color": "data(color)",
            "transition-property": "opacity, border-width, width, height",
            "transition-duration": "0.2s",
            "z-index": 10,
          },
        },
        {
          selector: "edge",
          style: {
            width: (ele) => (ele.data("type") === "timing" ? 1.5 : 3),
            "line-color": (ele) =>
              ele.data("type") === "timing" ? "#cbd5e1" : "#fbbf24",
            "line-style": (ele) =>
              ele.data("type") === "timing" ? "solid" : "dashed",
            "curve-style": "bezier",
            opacity: 0.8,
            "overlay-opacity": 0,
            "transition-property": "opacity, line-color, width",
            "transition-duration": "0.2s",
          },
        },
        {
          selector: ".highlighted",
          style: {
            opacity: 1,
            width: (ele) =>
              ele.isNode() ? 55 : ele.data("type") === "timing" ? 3 : 5,
            "z-index": 999,
          },
        },
        {
          selector: ".dimmed",
          style: {
            opacity: 0.1,
            "z-index": 0,
          },
        },
      ],
      layout: {
        name: "cose",
        padding: 40,
        animate: true,
        animationDuration: 1000,
        randomize: false,
        componentSpacing: 120,
        nodeRepulsion: 8000,
        edgeElasticity: 100,
        nestingFactor: 1.2,
        gravity: 1,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.99,
      },
    });

    // --- Interactivity for Clarity ---

    cy.on("mouseover", "node", (e) => {
      const node = e.target;
      const neighborhood = node.neighborhood().add(node);

      cy.elements().addClass("dimmed");
      neighborhood.removeClass("dimmed").addClass("highlighted");
      neighborhood.edges().removeClass("dimmed").addClass("highlighted");
    });

    cy.on("mouseout", "node", () => {
      cy.elements().removeClass("dimmed").removeClass("highlighted");
    });

    // Cleanup
    return () => cy.destroy();
  }, [graphData, assignments, gateColors]);

  return (
    <div className="relative w-full h-[500px] border bg-white rounded-xl overflow-hidden shadow-inner group">
      <div ref={cyRef} className="w-full h-full cursor-pointer" />

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-white/95 backdrop-blur-sm p-4 rounded-xl text-[10px] border border-slate-200 shadow-xl transition-opacity group-hover:opacity-100">
        <h4 className="font-black text-slate-800 uppercase tracking-widest mb-1 border-b pb-1">
          Conflict Guide
        </h4>
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 bg-slate-300"></div>
          <span className="text-slate-600 font-bold uppercase">
            Timing Conflict
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 border-b-2 border-dashed border-amber-400"></div>
          <span className="text-amber-600 font-bold uppercase">
            Size Incompatibility
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 pt-1 border-t border-slate-100">
          <div className="w-3 h-3 rounded-full bg-slate-500 shadow-sm"></div>
          <span className="text-slate-400 font-medium">Unassigned Flight</span>
        </div>
        <div className="mt-2 text-[9px] text-indigo-500 font-bold italic animate-pulse">
          💡 Hover over a flight to isolate its connections
        </div>
      </div>
    </div>
  );
};

export default ConflictGraph;
