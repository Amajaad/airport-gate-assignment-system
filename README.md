# 🛫 Airport Flight Gate Assignment System

A sophisticated decision-support system designed to solve the **Gate Assignment Problem (GAP)** using advanced **Graph Theory** and **Constraint Satisfaction (CSP)** techniques.

![Version](https://img.shields.io/badge/version-1.1.0-indigo)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

## 🌟 Overview

This system optimizes the allocation of airport gates by modeling constraints as a multi-layered **Conflict Graph**. It solves for the **Chromatic Number** of this graph to determine the theoretical minimum number of gates required while strictly enforcing aircraft compatibility rules.

### The Two-Factor Conflict Model:
1.  **Temporal Conflicts**: Identifying overlaps in flight schedules (Interval Graph theory).
2.  **Structural Conflicts**: Identifying flights that share zero compatible gates in the current inventory (Constraint Propagation).

## 🚀 Key Features

- **Heuristic Optimization**: Uses the **Welsh-Powell algorithm** for real-time vertex coloring.
- **Dynamic Gantt Chart**: High-fidelity timeline using `react-google-charts` with gate-size grouping.
- **Interactive Conflict Graph**: Stylized network visualization using **Cytoscape.js** with conflict-type highlighting.
- **Advanced Conflict Matrix**: Visualizes both Timing (✕) and Structural (S) conflicts.
- **Gate Management**: Real-time interface to add/remove gates and see the algorithm adapt instantly.
- **Automated Validation**: Ensures 100% adherence to aircraft size and gate compatibility constraints.

## 🛠️ Architecture

### Backend (FastAPI + NetworkX)
- **Graph Modeling**: Builds the adjacency matrix based on schedule and size logic.
- **Coloring Engine**: Implements the Largest-First greedy coloring heuristic.
- **CSP Solver**: Maps mathematical colors to physical gate IDs based on domain availability.

### Frontend (React + Zustand + Tailwind)
- **Tabbed Interface**: Organized views for Scheduling, Matrix, Graph, and Inventory.
- **State Management**: Centralized store for real-time reactivity.
- **Visualization**: High-performance rendering of complex graph topologies.

## ⚙️ Setup & Installation

### 1. Backend Setup
```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi uvicorn networkx
uvicorn main:app --reload
```

### 2. Frontend Setup
```powershell
cd arayüzü
npm install
npm run dev
```

## 📖 Usage Guide

1.  **Select Scenario**: Choose Light (Timing Bottleneck), Moderate (Size Bottleneck), or Peak (Stress Test).
2.  **Analyze Schedule**: Use the **Schedule Tab** to see the 24-hour gate occupancy.
3.  **Inspect Conflicts**: Use the **Matrix** and **Graph** tabs to identify exactly why flights are unassigned.
4.  **Manage Capacity**: Use the **Gate Inventory** tab to add specialized gates (e.g., Large gates for Widebody aircraft) to resolve bottlenecks.

## 🧪 Mathematical Concept

The system models the airport as a graph $G = (V, E)$ where:
- $V$: Vertices representing flights.
- $E$: Edges representing conflicts where $e_{ij} = \mathcal{T}(i,j) \lor \mathcal{S}(i,j)$.
- **Objective**: Minimize the utilized set $G_{used}$ such that all active flights satisfy size and timing constraints.

Detailed mathematical derivations can be found in [MATH.md](./MATH.md).

---
*Developed as a demonstration of CSP and Graph Theory in Aviation Logistics.*
