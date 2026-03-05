---
title: Merge Sort
chapter: computer-science
type: algorithm
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Recursion]]"
  - "[[Divide and Conquer]]"
related:
  - "[[Quick Sort]]"
  - "[[Bubble Sort]]"
  - "[[Binary Search]]"
tags:
  - algorithms
  - sorting
  - divide-and-conquer
  - recursion
  - comparison-sort
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Merge Sort

## Overview

Merge Sort is an efficient, stable sorting algorithm that uses the divide-and-conquer approach. It splits the array into halves, recursively sorts each half, then merges the sorted halves back together. Unlike simpler algorithms like Bubble Sort, Merge Sort guarantees O(n log n) performance regardless of input order.

Think of it like organizing a shuffled deck of cards: split the deck in half, sort each half separately, then merge them together by repeatedly taking the smaller card from the front of each half.

## Core Concept

Merge Sort operates on a simple insight: merging two already-sorted lists is easy and fast. You just repeatedly compare the first elements of each list and take the smaller one.

The algorithm breaks the sorting problem down:
1. **Divide**: Split the array in half
2. **Conquer**: Recursively sort each half
3. **Combine**: Merge the two sorted halves

The base case is an array of size 1, which is already sorted.

## How It Works

**High-level process**:

1. If the array has 1 or fewer elements, it's already sorted—return it
2. Split the array into left and right halves
3. Recursively sort the left half
4. Recursively sort the right half
5. Merge the two sorted halves into a single sorted array

**The merge step**: Given two sorted arrays, create a result array by:
- Compare the first elements of each array
- Take the smaller element and add it to the result
- Repeat until both arrays are empty

## Example

Let's sort `[38, 27, 43, 3, 9, 82, 10]`:

**Divide phase** (split until single elements):
```
                [38, 27, 43, 3, 9, 82, 10]
                /                        \
        [38, 27, 43, 3]              [9, 82, 10]
        /             \               /          \
    [38, 27]        [43, 3]       [9, 82]       [10]
    /     \         /     \       /     \
  [38]   [27]    [43]   [3]    [9]   [82]
```

**Conquer phase** (merge sorted halves):
```
  [38]   [27]    [43]   [3]    [9]   [82]      [10]
    \     /         \     /       \     /          |
    [27, 38]        [3, 43]       [9, 82]       [10]
        \             /               \          /
       [3, 27, 38, 43]              [9, 10, 82]
                \                    /
            [3, 9, 10, 27, 38, 43, 82]
```

**Detailed merge example** (merging `[27, 38]` and `[3, 43]`):
```
Left:  [27, 38]    Right: [3, 43]    Result: []
       ^                  ^
Compare 27 vs 3 → take 3

Left:  [27, 38]    Right: [43]       Result: [3]
       ^                  ^
Compare 27 vs 43 → take 27

Left:  [38]        Right: [43]       Result: [3, 27]
       ^                  ^
Compare 38 vs 43 → take 38

Left:  []          Right: [43]       Result: [3, 27, 38]
                          ^
Take remaining 43 → Result: [3, 27, 38, 43]
```

## Implementation

```python
def merge_sort(arr):
    # Base case: arrays of size 0 or 1 are already sorted
    if len(arr) <= 1:
        return arr

    # Divide: find the middle point
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    # Conquer: recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)

    # Combine: merge the sorted halves
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    # Compare elements from left and right, take smaller
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append remaining elements (one array will be empty)
    result.extend(left[i:])
    result.extend(right[j:])

    return result
```

## Complexity Analysis

**Time Complexity**: O(n log n) in all cases
- **Why log n**: The array is split in half repeatedly, creating log₂(n) levels
- **Why n**: Each level processes all n elements during merging
- For 1,000 elements: ~10,000 operations (vs. 1,000,000 for Bubble Sort)
- For 1,000,000 elements: ~20,000,000 operations

**Space Complexity**: O(n)
- Requires additional space for temporary arrays during merging
- Not an in-place sort (unlike Quick Sort)

## Key Properties

- **Guaranteed O(n log n)**: Worst case, best case, and average case are all the same
- **Stable**: Maintains relative order of equal elements
- **Not in-place**: Requires extra memory proportional to array size
- **Predictable**: Performance doesn't depend on input order
- **Parallelizable**: Each half can be sorted independently

## Common Pitfalls

**Creating too many arrays**: The implementation above creates new arrays at each level. An optimized version uses a single auxiliary array to reduce memory allocation overhead.

**Incorrect merge logic**: Forgetting to handle remaining elements after one array is exhausted leads to incomplete sorts.

**Not handling base case**: Forgetting `if len(arr) <= 1` causes infinite recursion.

**Space concerns**: For very large datasets or memory-constrained environments, Merge Sort's O(n) space requirement can be problematic.

## When to Use

Use Merge Sort when:
- You need guaranteed O(n log n) performance
- Stable sorting is required (preserving order of equal elements)
- Worst-case predictability matters
- Dataset doesn't fit in memory (external sorting)
- Data comes from streams or linked lists
- Parallelization is possible

Don't use Merge Sort when:
- Memory is extremely limited (use in-place algorithms like Quick Sort)
- Data is small (simpler algorithms like Insertion Sort are faster)
- Average-case performance is more important than worst-case (Quick Sort is often faster)

## Comparison with Other Sorts

**vs. Quick Sort**:
- Merge Sort: O(n log n) guaranteed, uses O(n) space, stable
- Quick Sort: O(n log n) average but O(n²) worst case, O(log n) space, not stable
- Quick Sort is often faster in practice but less predictable

**vs. Heap Sort**:
- Both are O(n log n) guaranteed
- Heap Sort is in-place (O(1) space)
- Merge Sort is stable, Heap Sort is not
- Merge Sort is faster in practice due to better cache performance

**vs. Bubble Sort**:
- Merge Sort is dramatically faster: O(n log n) vs. O(n²)
- For 1,000,000 elements: millions vs. trillions of operations

## Variations

**Bottom-up Merge Sort**: Iterative version that avoids recursion by sorting progressively larger chunks.

**Natural Merge Sort**: Exploits existing sorted runs in the data.

**In-place Merge Sort**: More complex variant that reduces space to O(1) at the cost of increased time complexity or loss of stability.

**External Merge Sort**: Sorts data that doesn't fit in memory by dividing it into chunks, sorting each, and merging them using disk storage.

## Real-World Applications

- **External sorting**: Sorting massive datasets that don't fit in memory
- **Sorting linked lists**: Merge Sort performs well on linked structures (no random access needed)
- **Parallel processing**: Easy to parallelize by sorting halves on different processors
- **Stability-critical applications**: When maintaining relative order matters (e.g., sorting database records by multiple fields)

## See Also

- [[Quick Sort]]
- [[Heap Sort]]
- [[Divide and Conquer]]
- [[Recursion]]
- [[Big O Notation]]

## References

- Introduction to Algorithms (CLRS), Chapter 2.3
- "Algorithms" (Robert Sedgewick and Kevin Wayne)
- Knuth, Donald. "The Art of Computer Programming, Volume 3: Sorting and Searching"
- von Neumann, John (1945). "First Draft of a Report on the EDVAC"
