---
title: Graph Traversal (BFS & DFS)
chapter: computer-science
type: algorithm
difficulty: intermediate
prerequisites:
  - "[[Graphs]]"
  - "[[Recursion]]"
  - "[[Stacks]]"
  - "[[Queues]]"
related:
  - "[[Trees]]"
  - "[[Topological Sort]]"
  - "[[Backtracking]]"
  - "[[Shortest Path]]"
tags:
  - algorithms
  - graphs
  - traversal
  - bfs
  - dfs
  - search
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Content Writer
---

# Graph Traversal (BFS & DFS)

## Overview

Graph traversal is the process of visiting every vertex in a graph. The two fundamental approaches—Breadth-First Search (BFS) and Depth-First Search (DFS)—differ in the order they visit vertices, making each suited for different problems.

Think of exploring a maze: DFS is like picking a path and following it as far as possible before backtracking, while BFS is like expanding outward from your starting point in waves, exploring all nearby paths before going deeper.

## Core Concept

Both algorithms systematically visit all reachable vertices from a starting point, but in different orders:

- **Depth-First Search (DFS)**: Go deep first. Follow each path to its end before trying another path.
- **Breadth-First Search (BFS)**: Go wide first. Explore all neighbors at the current level before moving deeper.

**Key similarity**: Both track visited vertices to avoid infinite loops in cyclic graphs.

**Key difference**: The data structure used to track "next vertex to visit."
- DFS uses a **stack** (LIFO: Last In, First Out)
- BFS uses a **queue** (FIFO: First In, First Out)

## Depth-First Search (DFS)

### How DFS Works

DFS explores as far down a branch as possible before backtracking.

**Process**:
1. Start at a vertex, mark it visited
2. Recursively visit each unvisited neighbor
3. When all neighbors are visited, backtrack
4. Continue until all reachable vertices are visited

### Visual Example

```
Graph:      0 --- 1
            |     |
            2 --- 3

Starting at 0, DFS might visit: 0 → 1 → 3 → 2

Step-by-step:
1. Visit 0, mark visited: {0}
2. Go to neighbor 1, mark visited: {0, 1}
3. From 1, go to neighbor 3, mark visited: {0, 1, 3}
4. From 3, go to neighbor 2, mark visited: {0, 1, 3, 2}
5. All neighbors visited, done!

The path goes deep before exploring other branches.
```

### Recursive Implementation

The most natural way to implement DFS:

```python
def dfs_recursive(graph, vertex, visited=None):
    """
    Depth-first search using recursion.

    Args:
        graph: adjacency list (dict of vertex -> list of neighbors)
        vertex: starting vertex
        visited: set of visited vertices (internal use)

    Returns:
        List of vertices in DFS order
    """
    if visited is None:
        visited = set()

    visited.add(vertex)
    result = [vertex]

    for neighbor in graph[vertex]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))

    return result

# Example
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2]
}

print(dfs_recursive(graph, 0))  # [0, 1, 3, 2]
```

**Why recursion works**: The call stack naturally acts as a stack, tracking which vertices to return to after exploring deep.

### Iterative Implementation

Using an explicit stack instead of the call stack:

```python
def dfs_iterative(graph, start):
    """
    Depth-first search using explicit stack.

    Args:
        graph: adjacency list
        start: starting vertex

    Returns:
        List of vertices in DFS order
    """
    visited = set()
    stack = [start]
    result = []

    while stack:
        vertex = stack.pop()  # LIFO: take most recently added

        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)

            # Add neighbors to stack (in reverse order for same order as recursive)
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result

print(dfs_iterative(graph, 0))  # [0, 1, 3, 2]
```

**When to use iterative**: When recursion depth might exceed stack limits (deep graphs).

### DFS Properties

**Time Complexity**: O(V + E)
- V = number of vertices
- E = number of edges
- Every vertex visited once, every edge explored once

**Space Complexity**: O(V)
- Visited set: O(V)
- Recursion stack or explicit stack: O(V) in worst case (linear path)

**Order**: Not unique—depends on order of neighbors in adjacency list.

### DFS Applications

#### 1. Cycle Detection

Check if a graph contains a cycle.

```python
def has_cycle_undirected(graph):
    """Detect cycle in undirected graph."""
    visited = set()

    def dfs(vertex, parent):
        visited.add(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                if dfs(neighbor, vertex):
                    return True
            elif neighbor != parent:
                # Visited neighbor that's not our parent = cycle!
                return True

        return False

    # Check all components
    for vertex in graph:
        if vertex not in visited:
            if dfs(vertex, None):
                return True

    return False

# Cyclic graph
cyclic = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
print(has_cycle_undirected(cyclic))  # True

# Acyclic graph (tree)
acyclic = {0: [1, 2], 1: [0], 2: [0, 3], 3: [2]}
print(has_cycle_undirected(acyclic))  # False
```

#### 2. Topological Sort

Order vertices in a Directed Acyclic Graph (DAG) such that for every edge u → v, u comes before v.

**Use case**: Task scheduling with dependencies.

```python
def topological_sort(graph):
    """
    Topological sort using DFS.

    Args:
        graph: directed acyclic graph (adjacency list)

    Returns:
        List of vertices in topological order
    """
    visited = set()
    stack = []

    def dfs(vertex):
        visited.add(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs(neighbor)

        # Add to stack AFTER visiting all descendants
        stack.append(vertex)

    # Visit all vertices
    for vertex in graph:
        if vertex not in visited:
            dfs(vertex)

    # Reverse to get correct order
    return stack[::-1]

# Task dependencies: A must finish before B, etc.
tasks = {
    'A': ['B', 'C'],  # A depends on nothing, B and C depend on A
    'B': ['D'],       # D depends on B
    'C': ['D'],       # D depends on C
    'D': []           # D depends on nothing
}

print(topological_sort(tasks))  # ['A', 'C', 'B', 'D'] or ['A', 'B', 'C', 'D']
```

#### 3. Finding Connected Components

Identify groups of connected vertices.

```python
def count_components(graph):
    """Count connected components in undirected graph."""
    visited = set()
    count = 0

    def dfs(vertex):
        visited.add(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                dfs(neighbor)

    for vertex in graph:
        if vertex not in visited:
            dfs(vertex)
            count += 1  # Found a new component

    return count

# Two separate components
disconnected = {
    0: [1], 1: [0],      # Component 1
    2: [3], 3: [2]       # Component 2
}

print(count_components(disconnected))  # 2
```

#### 4. Pathfinding

Find any path between two vertices.

```python
def find_path_dfs(graph, start, end, path=None):
    """Find a path from start to end using DFS."""
    if path is None:
        path = []

    path = path + [start]

    if start == end:
        return path

    for neighbor in graph[start]:
        if neighbor not in path:  # Avoid cycles
            new_path = find_path_dfs(graph, neighbor, end, path)
            if new_path:
                return new_path

    return None  # No path found

graph = {0: [1, 2], 1: [3], 2: [3], 3: []}
print(find_path_dfs(graph, 0, 3))  # [0, 1, 3] or [0, 2, 3]
```

## Breadth-First Search (BFS)

### How BFS Works

BFS explores neighbors level by level, like ripples spreading in water.

**Process**:
1. Start at a vertex, add to queue
2. Dequeue a vertex, visit all its unvisited neighbors
3. Add those neighbors to queue
4. Repeat until queue is empty

### Visual Example

```
Graph:      0 --- 1
            |     |
            2 --- 3

Starting at 0, BFS visits: 0 → 1 → 2 → 3

Step-by-step:
Queue: [0]
1. Dequeue 0, visit it
   Add neighbors 1, 2 to queue
   Queue: [1, 2], Visited: {0}

2. Dequeue 1, visit it
   Add neighbor 3 to queue
   Queue: [2, 3], Visited: {0, 1}

3. Dequeue 2, visit it
   Neighbor 3 already in queue/visited
   Queue: [3], Visited: {0, 1, 2}

4. Dequeue 3, visit it
   All neighbors visited
   Queue: [], Visited: {0, 1, 2, 3}

Done! Visited all vertices level by level.
```

### Implementation

BFS is always iterative (uses a queue):

```python
from collections import deque

def bfs(graph, start):
    """
    Breadth-first search.

    Args:
        graph: adjacency list
        start: starting vertex

    Returns:
        List of vertices in BFS order
    """
    visited = set([start])
    queue = deque([start])
    result = []

    while queue:
        vertex = queue.popleft()  # FIFO: take oldest
        result.append(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2]
}

print(bfs(graph, 0))  # [0, 1, 2, 3]
```

**Why queue?** Queue ensures we process vertices in the order we discover them—closest first, then farther away.

### BFS Properties

**Time Complexity**: O(V + E)
- Same as DFS: visit every vertex once, explore every edge once

**Space Complexity**: O(V)
- Visited set: O(V)
- Queue: O(V) in worst case (all vertices in queue at once)

**Order**: Visits vertices by distance from start (closest first).

### BFS Applications

#### 1. Shortest Path (Unweighted Graph)

BFS finds the shortest path in unweighted graphs because it explores by distance.

```python
def shortest_path_bfs(graph, start, end):
    """
    Find shortest path from start to end.

    Returns:
        List representing shortest path, or None if no path exists
    """
    if start == end:
        return [start]

    visited = set([start])
    queue = deque([[start]])  # Store paths, not just vertices

    while queue:
        path = queue.popleft()
        vertex = path[-1]

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                new_path = path + [neighbor]

                if neighbor == end:
                    return new_path  # Found shortest path!

                queue.append(new_path)

    return None  # No path exists

graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2, 4],
    4: [3]
}

print(shortest_path_bfs(graph, 0, 4))  # [0, 1, 3, 4] or [0, 2, 3, 4]
```

#### 2. Level-Order Traversal

Process vertices level by level (common in trees).

```python
def bfs_levels(graph, start):
    """
    BFS that tracks levels.

    Returns:
        List of levels, where each level is a list of vertices
    """
    visited = set([start])
    queue = deque([(start, 0)])  # (vertex, level)
    levels = []
    current_level = -1

    while queue:
        vertex, level = queue.popleft()

        # Start new level if needed
        if level > current_level:
            levels.append([])
            current_level = level

        levels[level].append(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, level + 1))

    return levels

graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1], 4: [1], 5: [2]
}

print(bfs_levels(graph, 0))
# [[0], [1, 2], [3, 4, 5]]
# Level 0: start
# Level 1: neighbors of start
# Level 2: neighbors of level 1
```

#### 3. Bipartite Graph Detection

Check if a graph can be colored with two colors (no adjacent vertices share a color).

```python
def is_bipartite(graph):
    """
    Check if graph is bipartite using BFS.

    Returns:
        True if bipartite, False otherwise
    """
    color = {}

    for start in graph:
        if start in color:
            continue

        # Try to 2-color this component
        queue = deque([start])
        color[start] = 0

        while queue:
            vertex = queue.popleft()

            for neighbor in graph[vertex]:
                if neighbor not in color:
                    # Color neighbor with opposite color
                    color[neighbor] = 1 - color[vertex]
                    queue.append(neighbor)
                elif color[neighbor] == color[vertex]:
                    # Adjacent vertices have same color!
                    return False

    return True

# Bipartite (like a chess board pattern)
bipartite = {0: [1, 3], 1: [0, 2], 2: [1, 3], 3: [0, 2]}
print(is_bipartite(bipartite))  # True

# Not bipartite (triangle = odd cycle)
not_bipartite = {0: [1, 2], 1: [0, 2], 2: [0, 1]}
print(is_bipartite(not_bipartite))  # False
```

## DFS vs BFS: When to Use Which

### Use DFS When:

1. **You need to explore all paths** (e.g., finding all solutions, backtracking)
2. **The solution is likely far from the start** (DFS might get lucky and find it quickly)
3. **You want to use recursion** (more elegant for tree-like problems)
4. **Memory is limited** (DFS uses less memory for wide graphs)
5. **Detecting cycles, topological sort, strongly connected components**

**Examples**:
- Solving mazes (try each path)
- Topological sorting
- Detecting cycles
- Finding connected components
- Backtracking problems (Sudoku, N-Queens)

### Use BFS When:

1. **You need the shortest path** (unweighted graphs)
2. **The solution is likely near the start** (BFS finds it quickly)
3. **You need to process vertices by distance/level**
4. **Testing bipartiteness, finding shortest path**

**Examples**:
- Shortest path in unweighted graphs
- Level-order tree traversal
- Finding minimum steps/moves
- Social network analysis ("friends within 2 hops")
- Web crawler (closer pages first)

### Quick Comparison

| Feature | DFS | BFS |
|---------|-----|-----|
| Data Structure | Stack (or recursion) | Queue |
| Order | Deep first | Wide first |
| Shortest path | ❌ No | ✅ Yes (unweighted) |
| Memory (wide graph) | ✅ Better | ❌ Worse |
| Memory (deep graph) | ❌ Worse | ✅ Better |
| Implementation | Recursive or iterative | Iterative only |
| All paths | ✅ Better | ❌ Worse |
| Closest neighbors | ❌ Worse | ✅ Better |

## Time and Space Complexity

Both algorithms have the same time complexity but different space characteristics.

### Time Complexity: O(V + E)

**Why?**
- Visit each vertex once: O(V)
- Check each edge once: O(E)
- Total: O(V + E)

**Example**: Graph with 1000 vertices and 5000 edges
- Operations: 1000 + 5000 = 6000
- Both DFS and BFS perform similarly

### Space Complexity: O(V)

**DFS Space**:
- Visited set: O(V)
- Stack (worst case): O(V) for linear path
- Total: O(V)

**BFS Space**:
- Visited set: O(V)
- Queue (worst case): O(V) when level contains all vertices
- Total: O(V)

**Practical difference**:
- **Wide, shallow graph**: BFS uses more space (queue holds entire level)
- **Deep, narrow graph**: DFS uses more space (stack holds entire path)

## Common Pitfalls

### Not Handling Disconnected Graphs

DFS/BFS from one vertex only visits vertices reachable from that vertex.

```python
# Wrong: Might miss vertices
visited = dfs(graph, start_vertex)

# Correct: Visit all components
visited = set()
for vertex in graph:
    if vertex not in visited:
        dfs(graph, vertex, visited)
```

### Forgetting to Track Visited Vertices

Results in infinite loops for cyclic graphs.

```python
# Wrong: Infinite loop!
def dfs_bad(graph, vertex):
    print(vertex)
    for neighbor in graph[vertex]:
        dfs_bad(graph, neighbor)  # Revisits vertices!

# Correct: Track visited
def dfs_good(graph, vertex, visited):
    if vertex in visited:
        return
    visited.add(vertex)
    print(vertex)
    for neighbor in graph[vertex]:
        dfs_good(graph, neighbor, visited)
```

### Using BFS for Deep Searches

BFS can use excessive memory for wide graphs at deep levels.

```python
# Bad: BFS on a tree with 1000 nodes per level, 10 levels deep
# Queue size at level 10: potentially 1000^10 nodes!

# Better: Use DFS for deep explorations
```

### Confusing Visited Marking Timing

When to mark a vertex as visited affects correctness.

```python
# Correct for BFS: Mark when adding to queue
visited.add(neighbor)
queue.append(neighbor)

# Wrong for BFS: Mark when dequeuing (can add duplicates to queue)
vertex = queue.popleft()
visited.add(vertex)  # Too late! Might be in queue multiple times
```

## Real-World Applications

**Web Crawlers**: BFS to crawl pages by distance from seed URL.

**Social Networks**: BFS for "people you might know" (friends of friends).

**GPS Navigation**: BFS variant (Dijkstra's) for shortest routes.

**Garbage Collection**: DFS to find reachable objects in memory.

**Compiler Design**: Topological sort (DFS) for build dependencies.

**Game AI**: DFS for exploring game trees, BFS for shortest path to goal.

**Version Control**: DFS to traverse commit history in Git.

## Practice Problems

**Beginner**:
- Number of islands (DFS/BFS on 2D grid)
- Clone a graph
- Find if path exists

**Intermediate**:
- Shortest path in binary matrix (BFS)
- Course schedule (cycle detection with DFS)
- All paths from source to target (DFS)
- Rotting oranges (multi-source BFS)

**Advanced**:
- Word ladder (BFS with transformations)
- Alien dictionary (topological sort)
- Reconstruct itinerary (DFS with backtracking)

## See Also

- [[Graphs]]
- [[Recursion]]
- [[Stacks]]
- [[Queues]]
- [[Topological Sort]]
- [[Shortest Path]]
- [[Dijkstra's Algorithm]]
- [[Backtracking]]

## References

- "Introduction to Algorithms" (CLRS), Chapter 22.2-22.3
- [Graph Traversal Visualizations](https://visualgo.net/en/dfsbfs)
- "Grokking Algorithms" by Aditya Bhargava, Chapter 6
- "Algorithms" by Sedgewick & Wayne, Section 4.1-4.2
