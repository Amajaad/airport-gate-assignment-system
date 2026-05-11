def solve_with_constraints(flights, gates, coloring_result, G):
    """
    Refines coloring results to ensure aircraft fits in the gate while 
    allowing gate reuse for non-conflicting flights[cite: 2, 3].
    """
    final_assignments = {}
    
    # Welsh-Powell priority is already handled by the order of coloring_result[cite: 4]
    for flight_id in coloring_result.keys():
        flight = next(f for f in flights if f['id'] == flight_id)
        
        # 1. Get compatible gates based on aircraft size
        compatible_gate_ids = [
            g['id'] for g in gates 
            if flight['aircraft_size'] in g['compatible_aircraft']
        ]
        
        # 2. Find which gates are currently occupied by conflicting flights
        neighbor_ids = list(G.neighbors(flight_id))
        occupied_gates = {
            final_assignments[n_id] 
            for n_id in neighbor_ids 
            if n_id in final_assignments
        }
        
        # 3. Assign the first compatible gate that isn't occupied by a neighbor[cite: 2]
        for gate_id in compatible_gate_ids:
            if gate_id not in occupied_gates:
                final_assignments[flight_id] = gate_id
                break
                
    return final_assignments