import json
import os

import networkx as nx
import utils
from csp_solver import solve_with_constraints
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from graph_coloring import get_conflict_graph, run_welsh_powell
from utils import is_timing_conflict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.[cite: 2, 5]
    allow_headers=["*"],  # Allows all headers (e.g., Content-Type)
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Global state to hold the active scenario data[cite: 1]
state = {"flights": [], "gates": [], "scenario": ""}


@app.post("/load/{scenario}")
async def load_scenario(scenario: str):
    # This points to backend/data/scenario_name.json
    path = os.path.join(BASE_DIR, "data", f"{scenario}.json")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario}' not found")

    try:
        with open(path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        state["flights"] = data["flights"]
        state["gates"] = data["gates"]
        state["scenario"] = data["scenario"]
        return {"status": "success", "loaded": state["scenario"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading scenario: {str(e)}")


@app.post("/solve")
async def solve():
    if not state["flights"]:
        raise HTTPException(
            status_code=400, detail="No scenario loaded. Call /load/{scenario} first"
        )

    try:
        active_flights = [f for f in state["flights"] if f.get("active", True)]
        G = get_conflict_graph(active_flights, state["gates"])
        coloring = run_welsh_powell(G)

        # Pass G here so we can check for neighbors during assignment[cite: 4]
        assignments = solve_with_constraints(
            active_flights, state["gates"], coloring, G
        )

        # Theoretical minimum (Graph's chromatic number)
        theoretical_min = max(coloring.values()) + 1 if coloring else 0

        return {
            "assignments": assignments,
            "chromatic_number": len(set(assignments.values())),
            "theoretical_min": theoretical_min,
            "graph_data": nx.node_link_data(G),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Solver error: {str(e)}")


@app.put("/flights/{id}/toggle")
async def toggle_flight(id: str):
    for f in state["flights"]:
        if f["id"] == id:
            f["active"] = not f.get("active", True)
            return {"id": id, "active": f["active"]}
    raise HTTPException(status_code=404, detail=f"Flight '{id}' not found")


@app.post("/gates")
async def add_gate(size: str):
    if size not in ["small", "medium", "large"]:
        raise HTTPException(
            status_code=400, detail="Invalid size. Must be small, medium, or large"
        )

    # Calculate next ID
    gate_numbers = [int(g["id"][1:]) for g in state["gates"] if g["id"].startswith("G")]
    next_num = max(gate_numbers, default=0) + 1
    new_id = f"G{next_num}"

    # Compatibility logic (Updated for specialized Large gates)
    if size == "large":
        comp = ["large"]
    elif size == "medium":
        comp = ["medium"]  # or just ["medium"]
    else:
        comp = ["small"]

    new_gate = {"id": new_id, "size": size, "compatible_aircraft": comp}
    state["gates"].append(new_gate)
    return new_gate


@app.delete("/gates/{id}")
async def remove_gate(id: str):
    initial_len = len(state["gates"])
    state["gates"] = [g for g in state["gates"] if g["id"] != id]
    if len(state["gates"]) == initial_len:
        raise HTTPException(status_code=404, detail=f"Gate {id} not found")
    return {"status": "success", "removed": id}


@app.get("/flights")
async def get_flights():
    return state["flights"]


@app.get("/state")
async def get_state():
    return state
