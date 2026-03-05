---
title: Graphs
chapter: computer-science
type: data-structure
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Linked Lists]]"
  - "[[Stacks]]"
  - "[[Queues]]"
  - "[[Trees]]"
related:
  - "[[Depth-First Search]]"
  - "[[Breadth-First Search]]"
  - "[[Dijkstra's Algorithm]]"
  - "[[Hash Tables]]"
tags:
  - data-structures
  - graphs
  - graph-theory
  - algorithms
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Graphs

## Overview

A graph is a data structure consisting of **vertices** (nodes) connected by **edges** (links). Unlike trees, graphs have no restrictions: nodes can connect to any other nodes, creating cycles, multiple paths, and complex relationships.

Think of a graph like a map of cities (vertices) connected by roads (edges), or a social network where people (vertices) are connected by friendships (edges). Graphs model relationships, networks, and dependencies throughout computing and the real world.

## Core Concept

Graphs are the most **flexible** data structure for representing relationships. While arrays organize data linearly and trees organize hierarchically, graphs organize data as **arbitrary connections**.

A graph consists of:
- **V**: Set of vertices (nodes)
- **E**: Set of edges (connections between vertices)

**Key difference from trees:**
- Trees: Hierarchical, no cycles, one path between nodes
- Graphs: Non-hierarchical, can have cycles, multiple paths possible

## Graph Terminology

**Vertex (Node):** A point in the graph.

**Edge (Link):** A connection between two vertices.

**Directed vs Undirected:**
- **Undirected edge:** Two-way connection (e.g., friendship: if A is friends with B, B is friends with A)
- **Directed edge (arc):** One-way connection (e.g., following on Twitter: A follows B doesn't mean B follows A)

**Weighted vs Unweighted:**
- **Weighted:** Edges have values (e.g., distance between cities)
- **Unweighted:** Edges have no values (just connection exists or doesn't)

**Degree:** Number of edges connected to a vertex.
- **Undirected graph:** degree is count of edges
- **Directed graph:** in-degree (incoming edges) and out-degree (outgoing edges)

**Path:** Sequence of edges connecting vertices.

**Cycle:** Path that starts and ends at the same vertex.

**Connected graph:** Path exists between every pair of vertices.

**Acyclic graph:** Graph with no cycles (trees are acyclic graphs).

## Types of Graphs

### Undirected Graph

Edges have no direction. If vertex A connects to B, then B connects to A.

```
    A --- B
    |     |
    C --- D

Edges: (A,B), (A,C), (B,D), (C,D)
```

**Examples:**
- Social networks (mutual friendships)
- Computer networks (ethernet connections)
- Road networks (two-way streets)

### Directed Graph (Digraph)

Edges have direction, shown with arrows.

```
    A → B
    ↓   ↓
    C ← D

Edges: A→B, A→C, D→C, B→D
```

**Examples:**
- Twitter (following relationships)
- Web pages (hyperlinks)
- Task dependencies (task A must complete before task B)

### Weighted Graph

Edges have values representing cost, distance, time, etc.

```
    A -5- B
    |     |
    2     3
    |     |
    C -1- D

Edge (A,B) has weight 5
Edge (A,C) has weight 2
Edge (B,D) has weight 3
Edge (C,D) has weight 1
```

**Examples:**
- Road maps (distances between cities)
- Flight routes (costs or durations)
- Network routing (bandwidth or latency)

### Cyclic vs Acyclic Graphs

**Cyclic:** Contains at least one cycle.

```
A → B
↓   ↓
C ← D

Cycle: A→B→D→C→A
```

**Acyclic:** No cycles. A **Directed Acyclic Graph (DAG)** is particularly useful.

```
A → B → D
↓   ↓
C → E

No cycles possible (edges only go "forward")
```

**DAG use cases:**
- Task scheduling
- Build systems (make, npm, cargo)
- Version control (git commit graphs)

## Graph Representations

Choosing the right representation affects performance and memory usage.

### 1. Adjacency Matrix

A 2D array where `matrix[i][j] = 1` if edge exists from vertex i to vertex j.

**For undirected graph:**
```
    0 --- 1
    |     |
    2 --- 3

Adjacency Matrix (4x4):
     0  1  2  3
  0 [0  1  1  0]
  1 [1  0  0  1]
  2 [1  0  0  1]
  3 [0  1  1  0]

matrix[0][1] = 1 (edge exists between 0 and 1)
matrix[0][3] = 0 (no edge between 0 and 3)
```

**For weighted graph:** Store weight instead of 1, or infinity/null for no edge.

**Advantages:**
- O(1) edge lookup: `matrix[u][v]`
- Simple to implement
- Easy to check if edge exists

**Disadvantages:**
- O(V²) space (wastes space for sparse graphs)
- O(V) to find all neighbors of a vertex
- Adding/removing vertices is expensive

**Best for:**
- Dense graphs (many edges)
- Quick edge existence checks
- Small graphs

### 2. Adjacency List

Each vertex stores a list of its neighbors.

**For undirected graph:**
```
    0 --- 1
    |     |
    2 --- 3

Adjacency List:
0 → [1, 2]
1 → [0, 3]
2 → [0, 3]
3 → [1, 2]
```

**For weighted graph:** Store tuples of (neighbor, weight).

```
0 → [(1, 5), (2, 2)]
1 → [(0, 5), (3, 3)]
2 → [(0, 2), (3, 1)]
3 → [(1, 3), (2, 1)]
```

**Advantages:**
- O(V + E) space (efficient for sparse graphs)
- O(degree) to find all neighbors
- Easy to add vertices/edges

**Disadvantages:**
- O(degree) to check if edge exists
- Slightly more complex than matrix

**Best for:**
- Sparse graphs (few edges relative to vertices)
- Most real-world graphs
- When you frequently traverse neighbors

### 3. Edge List

Store all edges as a list of pairs.

```
Edges: [(0,1), (0,2), (1,3), (2,3)]
```

**Advantages:**
- Simplest representation
- O(E) space
- Easy to iterate through all edges

**Disadvantages:**
- O(E) to find neighbors or check edge existence
- Hard to find vertices incident to an edge

**Best for:**
- Simple graph processing
- Kruskal's algorithm for minimum spanning tree
- When you process all edges sequentially

## Common Graph Algorithms

### Depth-First Search (DFS)

Explore as far as possible along each branch before backtracking.

**Uses:**
- Detect cycles
- Topological sorting
- Pathfinding
- Connected components

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()

    visited.add(start)
    print(start, end=' ')

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited

# Example graph (adjacency list)
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2]
}

dfs(graph, 0)  # Output: 0 1 3 2
```

**Time complexity:** O(V + E)
**Space complexity:** O(V) for visited set and recursion stack

### Breadth-First Search (BFS)

Explore all neighbors at current depth before moving to next level.

**Uses:**
- Shortest path in unweighted graphs
- Level-order traversal
- Connected components
- Bipartite graph detection

```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])

    while queue:
        vertex = queue.popleft()
        print(vertex, end=' ')

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

bfs(graph, 0)  # Output: 0 1 2 3
```

**Time complexity:** O(V + E)
**Space complexity:** O(V) for visited set and queue

## Time Complexity Summary

| Operation | Adjacency Matrix | Adjacency List | Edge List |
|-----------|------------------|----------------|-----------|
| Space | O(V²) | O(V + E) | O(E) |
| Add vertex | O(V²) | O(1) | O(1) |
| Add edge | O(1) | O(1) | O(1) |
| Remove vertex | O(V²) | O(V + E) | O(E) |
| Remove edge | O(1) | O(V) | O(E) |
| Check if edge exists | O(1) | O(degree) | O(E) |
| Find all neighbors | O(V) | O(degree) | O(E) |
| DFS/BFS | O(V²) | O(V + E) | O(V × E) |

**V** = number of vertices, **E** = number of edges, **degree** = number of neighbors for a vertex

## Implementation: Graph with Adjacency List (Python)

```python
class Graph:
    def __init__(self, directed=False):
        self.graph = {}
        self.directed = directed

    def add_vertex(self, vertex):
        """Add a vertex to the graph."""
        if vertex not in self.graph:
            self.graph[vertex] = []

    def add_edge(self, u, v, weight=None):
        """Add an edge from u to v."""
        # Ensure vertices exist
        self.add_vertex(u)
        self.add_vertex(v)

        # Add edge u -> v
        edge = (v, weight) if weight else v
        self.graph[u].append(edge)

        # If undirected, add edge v -> u
        if not self.directed:
            edge = (u, weight) if weight else u
            self.graph[v].append(edge)

    def remove_edge(self, u, v):
        """Remove edge from u to v."""
        self.graph[u] = [n for n in self.graph[u] if
                         (n[0] if isinstance(n, tuple) else n) != v]

        if not self.directed:
            self.graph[v] = [n for n in self.graph[v] if
                             (n[0] if isinstance(n, tuple) else n) != u]

    def has_edge(self, u, v):
        """Check if edge exists from u to v."""
        if u not in self.graph:
            return False

        for neighbor in self.graph[u]:
            n = neighbor[0] if isinstance(neighbor, tuple) else neighbor
            if n == v:
                return True
        return False

    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex."""
        return self.graph.get(vertex, [])

    def dfs(self, start, visited=None):
        """Depth-first search."""
        if visited is None:
            visited = set()

        visited.add(start)
        result = [start]

        for neighbor in self.graph.get(start, []):
            n = neighbor[0] if isinstance(neighbor, tuple) else neighbor
            if n not in visited:
                result.extend(self.dfs(n, visited))

        return result

    def bfs(self, start):
        """Breadth-first search."""
        visited = set([start])
        queue = deque([start])
        result = []

        while queue:
            vertex = queue.popleft()
            result.append(vertex)

            for neighbor in self.graph.get(vertex, []):
                n = neighbor[0] if isinstance(neighbor, tuple) else neighbor
                if n not in visited:
                    visited.add(n)
                    queue.append(n)

        return result

    def __str__(self):
        """String representation."""
        lines = []
        for vertex in sorted(self.graph.keys()):
            neighbors = self.graph[vertex]
            lines.append(f"{vertex} → {neighbors}")
        return "\n".join(lines)

# Usage: Undirected graph
g = Graph(directed=False)
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 3)
g.add_edge(2, 3)

print(g)
# 0 → [1, 2]
# 1 → [0, 3]
# 2 → [0, 3]
# 3 → [1, 2]

print("DFS from 0:", g.dfs(0))  # [0, 1, 3, 2]
print("BFS from 0:", g.bfs(0))  # [0, 1, 2, 3]

# Usage: Weighted directed graph
wg = Graph(directed=True)
wg.add_edge('A', 'B', 5)
wg.add_edge('A', 'C', 2)
wg.add_edge('B', 'D', 3)
wg.add_edge('C', 'D', 1)

print("\n" + str(wg))
# A → [('B', 5), ('C', 2)]
# B → [('D', 3)]
# C → [('D', 1)]
# D → []
```

## Implementation: Graph with Adjacency Matrix (C)

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX_VERTICES 100

typedef struct Graph {
    int num_vertices;
    int matrix[MAX_VERTICES][MAX_VERTICES];
} Graph;

Graph* create_graph(int vertices) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->num_vertices = vertices;

    // Initialize all edges to 0 (no edge)
    for (int i = 0; i < vertices; i++) {
        for (int j = 0; j < vertices; j++) {
            g->matrix[i][j] = 0;
        }
    }

    return g;
}

void add_edge(Graph* g, int u, int v) {
    // Undirected graph: add both directions
    g->matrix[u][v] = 1;
    g->matrix[v][u] = 1;
}

int has_edge(Graph* g, int u, int v) {
    return g->matrix[u][v];
}

void print_graph(Graph* g) {
    printf("Adjacency Matrix:\n");
    for (int i = 0; i < g->num_vertices; i++) {
        for (int j = 0; j < g->num_vertices; j++) {
            printf("%d ", g->matrix[i][j]);
        }
        printf("\n");
    }
}

void dfs_helper(Graph* g, int vertex, int visited[]) {
    visited[vertex] = 1;
    printf("%d ", vertex);

    for (int i = 0; i < g->num_vertices; i++) {
        if (g->matrix[vertex][i] == 1 && !visited[i]) {
            dfs_helper(g, i, visited);
        }
    }
}

void dfs(Graph* g, int start) {
    int visited[MAX_VERTICES] = {0};
    printf("DFS from %d: ", start);
    dfs_helper(g, start, visited);
    printf("\n");
}

int main() {
    Graph* g = create_graph(4);

    add_edge(g, 0, 1);
    add_edge(g, 0, 2);
    add_edge(g, 1, 3);
    add_edge(g, 2, 3);

    print_graph(g);
    /*
    0 1 1 0
    1 0 0 1
    1 0 0 1
    0 1 1 0
    */

    dfs(g, 0);  // DFS from 0: 0 1 3 2

    free(g);
    return 0;
}
```

## Key Properties

**Advantages:**
- **Flexible:** Can model any relationship or network
- **Powerful:** Solves problems trees/arrays can't (shortest paths, network flow)
- **Real-world:** Natural fit for social networks, maps, dependencies
- **Rich algorithms:** Extensive research and optimized algorithms available

**Disadvantages:**
- **Complex:** Harder to implement and reason about than linear structures
- **Space:** Can use significant memory (especially adjacency matrix)
- **No guarantees:** Unlike trees, no structural guarantees (can have cycles, disconnected components)

## Common Pitfalls

**Not handling disconnected graphs:**
```python
# DFS/BFS from one vertex won't visit all vertices if graph is disconnected
# Solution: iterate through all vertices and start DFS/BFS from unvisited ones
for vertex in graph:
    if vertex not in visited:
        dfs(graph, vertex, visited)
```

**Infinite loops in cyclic graphs:**
```python
# Always track visited nodes to avoid revisiting
def dfs(graph, node, visited):
    if node in visited:  # Critical!
        return
    visited.add(node)
    # ... continue traversal
```

**Confusing directed and undirected:**
When adding edges to an undirected graph, add both directions. For directed graphs, add only the specified direction.

**Wrong representation choice:**
- Use adjacency list for sparse graphs (most real-world graphs)
- Use adjacency matrix only for dense graphs or when edge lookups dominate

**Not checking for vertex existence:**
```python
# Always check if vertex exists before accessing
if vertex in graph:
    neighbors = graph[vertex]
```

## When to Use

**Use graphs when:**
- Modeling relationships or networks (social, computer, road)
- Finding shortest paths (maps, routing)
- Detecting cycles (dependency checking)
- Analyzing connectivity (network reliability)
- Scheduling with dependencies (build systems, task scheduling)

**Don't use graphs when:**
- Data is hierarchical without cycles (use [[Trees]])
- Data is linear (use [[Arrays]] or [[Linked Lists]])
- Simple key-value lookups (use [[Hash Tables]])
- Graph structure adds unnecessary complexity

## See Also

- [[Depth-First Search]]
- [[Breadth-First Search]]
- [[Dijkstra's Algorithm]]
- [[Trees]]
- [[Topological Sort]]
- [[Minimum Spanning Tree]]
- [[Network Flow]]
- [[Hash Tables]]

## References

- Introduction to Algorithms (CLRS), Chapter 22 (Graph Algorithms)
- [Graph Visualization](https://visualgo.net/en/graphds)
- [NetworkX Python Library](https://networkx.org/)
- Algorithms, 4th Edition (Sedgewick & Wayne), Part 4
