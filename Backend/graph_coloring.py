import networkx as nx
from utils import is_structural_conflict, is_timing_conflict


def get_conflict_graph(flights, gates):
    """
    Builds a NetworkX graph where edges represent either:
    1. Timing conflicts (overlapping schedules)
    2. Structural conflicts (zero shared compatible gates)
    """
    G = nx.Graph()
    for i, f1 in enumerate(flights):
        G.add_node(f1["id"], aircraft_size=f1["aircraft_size"])
        for f2 in flights[i + 1 :]:
            timing = is_timing_conflict(f1, f2)
            structural = is_structural_conflict(f1, f2, gates)

            if timing or structural:
                # Store the reason for the conflict in the edge data
                G.add_edge(
                    f1["id"],
                    f2["id"],
                    conflict_type="both"
                    if (timing and structural)
                    else "timing"
                    if timing
                    else "structural",
                )
    return G


def run_welsh_powell(G):
    """
    Colors the graph by sorting nodes by degree (largest to smallest)[cite: 2].
    Returns a dict of {flight_id: color_index}.
    """
    return nx.coloring.greedy_color(G, strategy="largest_first")
