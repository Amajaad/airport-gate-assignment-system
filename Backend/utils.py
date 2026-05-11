from datetime import datetime


def parse_time(t):
    return datetime.strptime(t, "%H:%M")


def is_timing_conflict(f1, f2):
    """
    Standard overlap detection:
    True if one flight starts before the other ends, and vice versa[cite: 6].
    """
    return parse_time(f1["arrival"]) < parse_time(f2["departure"]) and parse_time(
        f2["arrival"]
    ) < parse_time(f1["departure"])


def is_structural_conflict(f1, f2, gates):
    """
    True if two flights share ZERO compatible gates in the current inventory.
    """
    f1_gates = {
        g["id"] for g in gates if f1["aircraft_size"] in g["compatible_aircraft"]
    }
    f2_gates = {
        g["id"] for g in gates if f2["aircraft_size"] in g["compatible_aircraft"]
    }

    # If they have no shared gates, they can NEVER be assigned to the same resource
    return len(f1_gates.intersection(f2_gates)) == 0
