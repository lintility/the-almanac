---
title: Heaps and Priority Queues
chapter: computer-science
type: data-structure
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Trees]]"
  - "[[Big O Notation]]"
related:
  - "[[Binary Search Trees]]"
  - "[[Queues]]"
  - "[[Sorting Algorithms]]"
tags:
  - data-structures
  - heaps
  - priority-queues
  - binary-heap
  - heap-sort
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Heaps and Priority Queues

## Overview

A heap is a specialized tree-based data structure that maintains a **heap property**: in a max-heap, every parent node is greater than or equal to its children; in a min-heap, every parent is less than or equal to its children.

Think of a heap like a tournament bracket where the best player (max-heap) or worst player (min-heap) is always at the top. Unlike a binary search tree, heaps don't maintain a full ordering—only the partial ordering needed to keep the min/max at the root.

Heaps power **priority queues**, which let you efficiently retrieve the "most important" item. They're essential for scheduling, graph algorithms (Dijkstra's, Prim's), and sorting (heapsort).

## Core Concept

Heaps solve a specific problem: **quickly finding and removing the minimum (or maximum) element** while allowing efficient insertions.

A regular queue gives you FIFO (first in, first out). A priority queue gives you "**most important first**" based on priority, not arrival time. Heaps implement priority queues with O(log n) insert and O(log n) extract-min/max.

**Heap property:**
- **Max-heap:** `parent >= children` (largest element at root)
- **Min-heap:** `parent <= children` (smallest element at root)

This property applies **recursively** to all nodes in the tree.

## Heap Properties

**Complete binary tree:** All levels are completely filled except possibly the last, which fills from left to right.

```
Max-heap example:
        100
       /   \
      19    36
     / \    /
    17  3  25

- 100 >= 19, 36 (root is largest)
- 19 >= 17, 3
- 36 >= 25
- Tree is complete (fills left to right)
```

**Array representation:** Because heaps are **complete** binary trees, they're efficiently stored in arrays without wasting space.

For element at index `i`:
- **Left child:** `2*i + 1`
- **Right child:** `2*i + 2`
- **Parent:** `(i - 1) // 2`

```
Array: [100, 19, 36, 17, 3, 25]
Index:   0   1   2   3  4   5

Index 0 (100): children at 1 (19) and 2 (36)
Index 1 (19): parent at 0 (100), children at 3 (17) and 4 (3)
Index 2 (36): parent at 0 (100), child at 5 (25)
```

## Types of Heaps

### Max-Heap

Parent nodes are **greater than or equal to** children. The **maximum** element is at the root.

```
        100
       /   \
      90    80
     / \    /
    70 60  50

Array: [100, 90, 80, 70, 60, 50]
```

**Use cases:**
- Find maximum element repeatedly
- Heapsort (descending order)
- Scheduling highest-priority tasks

### Min-Heap

Parent nodes are **less than or equal to** children. The **minimum** element is at the root.

```
        10
       /  \
      20   30
     / \   /
    40 50 35

Array: [10, 20, 30, 40, 50, 35]
```

**Use cases:**
- Find minimum element repeatedly
- Dijkstra's shortest path algorithm
- Event-driven simulation (process earliest events first)
- Heapsort (ascending order)

## Heap Operations

### Insert (O(log n))

1. Add element at the **end** (maintains complete tree)
2. **Bubble up (heapify up):** Compare with parent, swap if heap property violated
3. Repeat until heap property restored

**Example:** Insert 95 into max-heap

```
Before:
        100
       /   \
      90    80
     / \
    70 60

Step 1: Add to end
        100
       /   \
      90    80
     / \    /
    70 60  95

Step 2: Compare with parent (80)
95 > 80, swap

        100
       /   \
      90    95
     / \    /
    70 60  80

Step 3: Compare with parent (100)
95 < 100, done
```

### Extract-Max/Extract-Min (O(log n))

1. **Remove root** (max or min element)
2. **Move last element to root**
3. **Bubble down (heapify down):** Compare with children, swap with larger child (max-heap) or smaller child (min-heap)
4. Repeat until heap property restored

**Example:** Extract-max from max-heap

```
Before:
        100
       /   \
      90    80
     / \    /
    70 60  50

Step 1: Remove root (100), move last element (50) to root
        50
       /  \
      90   80
     / \
    70 60

Step 2: Compare 50 with children (90, 80)
Swap with larger child (90)

        90
       /  \
      50   80
     / \
    70 60

Step 3: Compare 50 with children (70, 60)
Swap with larger child (70)

        90
       /  \
      70   80
     / \
    50 60

Done (50 has no children)
```

### Peek (O(1))

Simply return the root element without removing it.

```python
def peek(heap):
    return heap[0] if heap else None
```

### Heapify (O(n))

Convert an arbitrary array into a heap. Surprisingly, this is **O(n)**, not O(n log n).

**Algorithm:** Start from the last non-leaf node, bubble down each node.

```python
def heapify(arr):
    n = len(arr)
    # Start from last parent node
    for i in range(n // 2 - 1, -1, -1):
        bubble_down(arr, n, i)
```

**Why O(n)?** Most nodes are near the bottom and need few swaps. The math works out to O(n) total operations.

## Time Complexity

| Operation | Time Complexity |
|-----------|-----------------|
| Peek (get min/max) | O(1) |
| Insert | O(log n) |
| Extract-min/max | O(log n) |
| Delete arbitrary element | O(log n) |
| Heapify (build heap) | O(n) |
| Search | O(n) |

**Space Complexity:** O(n) for n elements

**Key insight:** Heaps are **not** for searching arbitrary elements. They're optimized for finding and removing the min/max.

## Implementation: Min-Heap (Python)

```python
class MinHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def left_child(self, i):
        return 2 * i + 1

    def right_child(self, i):
        return 2 * i + 2

    def swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def insert(self, value):
        """Insert value and maintain heap property."""
        # Add to end
        self.heap.append(value)

        # Bubble up
        i = len(self.heap) - 1
        while i > 0 and self.heap[i] < self.heap[self.parent(i)]:
            self.swap(i, self.parent(i))
            i = self.parent(i)

    def extract_min(self):
        """Remove and return minimum element."""
        if not self.heap:
            return None

        if len(self.heap) == 1:
            return self.heap.pop()

        # Store min value
        min_val = self.heap[0]

        # Move last element to root
        self.heap[0] = self.heap.pop()

        # Bubble down
        self._bubble_down(0)

        return min_val

    def _bubble_down(self, i):
        """Restore heap property by moving element down."""
        min_index = i
        left = self.left_child(i)
        right = self.right_child(i)

        # Find smallest among node and children
        if left < len(self.heap) and self.heap[left] < self.heap[min_index]:
            min_index = left

        if right < len(self.heap) and self.heap[right] < self.heap[min_index]:
            min_index = right

        # If smallest is not current node, swap and continue
        if min_index != i:
            self.swap(i, min_index)
            self._bubble_down(min_index)

    def peek(self):
        """Return minimum without removing."""
        return self.heap[0] if self.heap else None

    def size(self):
        return len(self.heap)

    def is_empty(self):
        return len(self.heap) == 0

    def __str__(self):
        return str(self.heap)

# Usage
heap = MinHeap()
for val in [50, 30, 70, 20, 40, 60, 80]:
    heap.insert(val)

print(heap)  # [20, 30, 60, 50, 40, 70, 80]
print(heap.peek())  # 20

print(heap.extract_min())  # 20
print(heap.extract_min())  # 30
print(heap)  # [40, 50, 60, 80, 70]
```

## Implementation: Max-Heap (C)

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 100

typedef struct MaxHeap {
    int arr[MAX_SIZE];
    int size;
} MaxHeap;

void init_heap(MaxHeap* heap) {
    heap->size = 0;
}

int parent(int i) { return (i - 1) / 2; }
int left_child(int i) { return 2 * i + 1; }
int right_child(int i) { return 2 * i + 2; }

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void insert(MaxHeap* heap, int value) {
    if (heap->size >= MAX_SIZE) {
        printf("Heap overflow\n");
        return;
    }

    // Add to end
    int i = heap->size;
    heap->arr[i] = value;
    heap->size++;

    // Bubble up
    while (i > 0 && heap->arr[i] > heap->arr[parent(i)]) {
        swap(&heap->arr[i], &heap->arr[parent(i)]);
        i = parent(i);
    }
}

void bubble_down(MaxHeap* heap, int i) {
    int max_index = i;
    int left = left_child(i);
    int right = right_child(i);

    // Find largest among node and children
    if (left < heap->size && heap->arr[left] > heap->arr[max_index]) {
        max_index = left;
    }

    if (right < heap->size && heap->arr[right] > heap->arr[max_index]) {
        max_index = right;
    }

    // If largest is not current node, swap and continue
    if (max_index != i) {
        swap(&heap->arr[i], &heap->arr[max_index]);
        bubble_down(heap, max_index);
    }
}

int extract_max(MaxHeap* heap) {
    if (heap->size == 0) {
        printf("Heap underflow\n");
        return -1;
    }

    int max_val = heap->arr[0];

    // Move last element to root
    heap->arr[0] = heap->arr[heap->size - 1];
    heap->size--;

    // Bubble down
    if (heap->size > 0) {
        bubble_down(heap, 0);
    }

    return max_val;
}

int peek(MaxHeap* heap) {
    if (heap->size == 0) {
        printf("Heap is empty\n");
        return -1;
    }
    return heap->arr[0];
}

void print_heap(MaxHeap* heap) {
    printf("Heap: [");
    for (int i = 0; i < heap->size; i++) {
        printf("%d", heap->arr[i]);
        if (i < heap->size - 1) printf(", ");
    }
    printf("]\n");
}

int main() {
    MaxHeap heap;
    init_heap(&heap);

    insert(&heap, 50);
    insert(&heap, 30);
    insert(&heap, 70);
    insert(&heap, 20);
    insert(&heap, 40);
    insert(&heap, 60);
    insert(&heap, 80);

    print_heap(&heap);  // [80, 40, 70, 20, 30, 50, 60]

    printf("Max: %d\n", peek(&heap));  // 80
    printf("Extract: %d\n", extract_max(&heap));  // 80
    printf("Extract: %d\n", extract_max(&heap));  // 70

    print_heap(&heap);  // [60, 40, 50, 20, 30]

    return 0;
}
```

## Priority Queues

A **priority queue** is an abstract data type where each element has a **priority**, and elements are served in priority order (not insertion order).

Heaps are the **standard implementation** of priority queues.

**Operations:**
- `enqueue(item, priority)` → `insert(item)` with heap
- `dequeue()` → `extract_min()` or `extract_max()`
- `peek()` → see highest-priority item without removing

**Example:** Task scheduling

```python
import heapq  # Python's built-in min-heap

# Priority queue using Python's heapq (min-heap)
tasks = []

heapq.heappush(tasks, (1, "Critical bug fix"))
heapq.heappush(tasks, (5, "Write documentation"))
heapq.heappush(tasks, (2, "Deploy to production"))
heapq.heappush(tasks, (3, "Code review"))

# Process tasks by priority (lowest number = highest priority)
while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"Priority {priority}: {task}")

# Output:
# Priority 1: Critical bug fix
# Priority 2: Deploy to production
# Priority 3: Code review
# Priority 5: Write documentation
```

## Heapsort

Heapsort uses a heap to sort an array in O(n log n) time.

**Algorithm:**
1. **Heapify** the array (O(n))
2. **Extract-max** repeatedly, placing each element at the end (O(n log n))

```python
def heapsort(arr):
    """Sort array in ascending order using max-heap."""
    n = len(arr)

    # Build max-heap (O(n))
    for i in range(n // 2 - 1, -1, -1):
        bubble_down(arr, n, i)

    # Extract elements one by one (O(n log n))
    for i in range(n - 1, 0, -1):
        # Move current root (max) to end
        arr[0], arr[i] = arr[i], arr[0]

        # Heapify reduced heap
        bubble_down(arr, i, 0)

def bubble_down(arr, n, i):
    """Helper: restore heap property."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        bubble_down(arr, n, largest)

# Usage
arr = [12, 11, 13, 5, 6, 7]
heapsort(arr)
print(arr)  # [5, 6, 7, 11, 12, 13]
```

**Time:** O(n log n) always (unlike quicksort's O(n²) worst case)
**Space:** O(1) (in-place, unlike mergesort)
**Stable:** No (relative order of equal elements not preserved)

## Comparison: Heap vs BST vs Sorted Array

| Operation | Heap | BST (balanced) | Sorted Array |
|-----------|------|----------------|--------------|
| Find min/max | O(1) | O(log n) | O(1) |
| Extract min/max | O(log n) | O(log n) | O(n) |
| Insert | O(log n) | O(log n) | O(n) |
| Search arbitrary | O(n) | O(log n) | O(log n) |
| Build from array | O(n) | O(n log n) | O(n log n) |

**When to choose heap:**
- Repeatedly access min/max
- Priority queue needed
- Don't need to search arbitrary elements

**When to choose BST:**
- Need to search arbitrary elements
- Need all elements in sorted order
- Need range queries

**When to choose sorted array:**
- Static data (no insertions)
- Fast search more important than fast min/max extraction

## Key Properties

**Advantages:**
- **Fast min/max access:** O(1) peek, O(log n) extract
- **Efficient insertion:** O(log n)
- **Space-efficient:** Array representation, no pointers
- **Cache-friendly:** Contiguous memory (unlike trees with pointers)
- **Heapify is O(n):** Build heap from unsorted array surprisingly fast

**Disadvantages:**
- **Slow arbitrary search:** O(n) to find non-min/max elements
- **Not sorted:** Can't iterate in order without destroying heap
- **No range queries:** Unlike BSTs
- **Fixed size (array):** May need resizing

## Common Pitfalls

**Using wrong heap type:**
- Need smallest element? Use **min-heap**
- Need largest element? Use **max-heap**

**Confusing heap with BST:**
```python
# Heap: parent >= children (max-heap)
# BST: left < parent < right

# This is valid in max-heap but NOT in BST:
#      50
#     / \
#    30  40  (30 < 50, 40 < 50 ✓ heap property)
#            (but 40 is not > 30, so not a BST!)
```

**Forgetting heap uses array indexing:**
```python
# For element at index i:
left_child = 2 * i + 1   # NOT i + 1
right_child = 2 * i + 2  # NOT i + 2
parent = (i - 1) // 2    # NOT i - 1
```

**Assuming heapsort is fastest:**
Heapsort is O(n log n) but has poor cache performance. For most cases, use **quicksort** (faster in practice) or **mergesort** (stable, predictable).

**Using heap when you need full ordering:**
If you need to iterate through all elements in sorted order, use a sorted array or BST instead.

## When to Use

**Use heaps when:**
- Implementing priority queues (task scheduling, event processing)
- Finding k largest/smallest elements (top-k problems)
- Dijkstra's shortest path or Prim's MST algorithms
- Merging k sorted lists
- Streaming median calculation

**Don't use heaps when:**
- Need to search for arbitrary elements (use [[Hash Tables]] or [[Binary Search Trees]])
- Need all data in sorted order (use sorted array or [[Binary Search Trees]])
- Need O(1) insertions (use [[Hash Tables]])

## See Also

- [[Binary Search Trees]]
- [[Priority Queues]]
- [[Sorting Algorithms]]
- [[Dijkstra's Algorithm]]
- [[Arrays]]
- [[Trees]]

## References

- Introduction to Algorithms (CLRS), Chapter 6 (Heapsort)
- [Python heapq module](https://docs.python.org/3/library/heapq.html)
- [Heap Visualization](https://visualgo.net/en/heap)
- Algorithms, 4th Edition (Sedgewick & Wayne), Section 2.4
