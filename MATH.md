# Mathematical Foundations of Gate Assignment

This document provides a technical overview of the mathematical models and algorithms used in the Airport Flight Gate Assignment System.

## 1. Mathematical Modeling (The GAP)

The **Gate Assignment Problem (GAP)** is modeled as a mapping $f: F \rightarrow G$, where $F$ is a set of $n$ flights and $G$ is a set of $m$ gates. The mapping must satisfy a set of constraints while optimizing resource utilization.

### 1.1 Variable Definitions
- $F = \{f_1, f_2, ..., f_n\}$
- $G = \{g_1, g_2, ..., g_m\}$
- $I_i = [a_i, d_i]$ (Time interval for flight $i$)
- $S_i \in \{\text{small, medium, large}\}$ (Aircraft size for flight $i$)
- $K_j \subseteq \{\text{small, medium, large}\}$ (Compatibility set for gate $j$)

---

## 2. The Conflict Graph $G = (V, E)$

The system uses a **Conflict Graph** to represent constraints.

### 2.1 Vertex Set ($V$)
Each vertex $v_i \in V$ corresponds to a flight $f_i$.

### 2.2 Edge Set ($E$)
An edge exists between $v_i$ and $v_j$ if a conflict prevents them from sharing a gate.
$$e_{ij} = 1 \iff \text{Overlap}(I_i, I_j) \lor \text{Incompatible}(S_i, S_j)$$

#### 2.2.1 Temporal Overlap (Interval Graph)
Derived from Interval Graph theory:
$$\text{Overlap}(I_i, I_j) \iff (a_i < d_j) \land (a_j < d_i)$$

#### 2.2.2 Structural Incompatibility
$$\text{Incompatible}(S_i, S_j) \iff (K(S_i) \cap K(S_j) = \emptyset)$$
*Note: This occurs when two flights have no shared compatible gates in the current inventory.*

---

## 3. Vertex Coloring & Chromatic Number

The assignment problem is solved by finding a vertex coloring of $G$.

### 3.1 The Chromatic Number $\chi(G)$
$\chi(G)$ is the minimum number of colors (gates) required such that no two adjacent vertices share the same color.
- **Theoretical Minimum**: Displayed as "Min. Needed" in the UI.
- **Complexity**: Finding $\chi(G)$ for a general graph is **NP-Hard**.

### 3.2 Welsh-Powell Heuristic
To provide real-time solutions, the system uses the **Welsh-Powell Algorithm**:
1. Sort nodes by degree $deg(v)$ in descending order.
2. Assign the lowest available color that has not been assigned to a neighbor.

---

## 4. Constraint Satisfaction (CSP) Solver

The solver operates on two levels:

1. **Unary Constraints (Domain Filtering)**:
   For each flight $v_i$, the domain $D_i$ is restricted to gates where $S_i \in K_j$.
2. **Binary Constraints (Conflict Enforcement)**:
   For any $(v_i, v_j) \in E$, the assignments $f(v_i)$ and $f(v_j)$ must be distinct.

---

## 5. Summary of Algorithm Flow

1. **Pre-processing**: Parse flight intervals and gate sizes.
2. **Graph Construction**: Build the Conflict Graph $(V, E)$ using both temporal and structural logic.
3. **Graph Coloring**: Apply Welsh-Powell to determine color priorities.
4. **Assignment**: Match colors to physical gate IDs using first-fit domain satisfaction.
5. **Validation**: Verify that no gate is double-booked and all size constraints are met.

---
*This model ensures that gate assignments are mathematically sound and optimized for minimum resource usage.*
