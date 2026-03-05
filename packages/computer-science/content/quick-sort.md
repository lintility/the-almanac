---
title: Quick Sort
chapter: computer-science
type: algorithm
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Recursion]]"
  - "[[Divide and Conquer]]"
related:
  - "[[Merge Sort]]"
  - "[[Partition Algorithm]]"
  - "[[Binary Search]]"
tags:
  - algorithms
  - sorting
  - divide-and-conquer
  - recursion
  - comparison-sort
  - in-place
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Quick Sort

## Overview

Quick Sort is one of the most widely used sorting algorithms in practice. It uses a divide-and-conquer approach built around a clever "partition" operation that rearranges elements around a chosen pivot. Despite having O(n²) worst-case performance, its excellent average-case performance of O(n log n) and in-place nature make it the default choice for many applications.

Think of it like organizing books on a shelf: pick a book as a reference point, move all shorter books to the left and taller books to the right, then repeat the process on each side until everything is in order.

## Core Concept

Quick Sort works by selecting a "pivot" element and partitioning the array around it—placing smaller elements before the pivot and larger elements after. The pivot is now in its final sorted position. The algorithm then recursively sorts the elements before and after the pivot.

The key insight: after partitioning, you've made progress toward sorting without needing to merge anything back together (unlike Merge Sort).

**The process**:
1. **Choose a pivot** from the array
2. **Partition**: Rearrange elements so smaller values are left of pivot, larger values are right
3. **Recursively sort** the left portion
4. **Recursively sort** the right portion

## How It Works

**High-level algorithm**:

1. If the array has 1 or fewer elements, it's sorted—return
2. Choose a pivot element (various strategies exist)
3. Partition the array around the pivot:
   - Elements < pivot go to the left
   - Elements > pivot go to the right
   - Pivot is in its final position
4. Recursively apply Quick Sort to the left portion
5. Recursively apply Quick Sort to the right portion

**Why it's fast**: Quick Sort sorts in place with minimal extra space. The partitioning step is efficient, and on average, the pivot divides the array roughly in half, giving O(n log n) performance.

## Example

Let's sort `[10, 7, 8, 9, 1, 5]` using the last element as pivot:

**Initial**: `[10, 7, 8, 9, 1, 5]` → pivot = 5

**Partition around 5**:
```
[10, 7, 8, 9, 1, 5]
 ^                    i (elements <= 5)
 ^                    j (scanning)

Compare 10 > 5 → skip, j++
Compare 7 > 5 → skip, j++
Compare 8 > 5 → skip, j++
Compare 9 > 5 → skip, j++
Compare 1 <= 5 → swap with position i+1

[10, 1, 8, 9, 7, 5]
     ^
     i moved

Now place pivot after i:
[1, 5, 8, 9, 7, 10]
    ↑ pivot in final position
```

Result: `[1] | [5] | [8, 9, 7, 10]`

**Recursively sort left**: `[1]` → already sorted

**Recursively sort right**: `[8, 9, 7, 10]` → pivot = 10
```
Partition around 10:
[7, 9, 8, 10]
Result: [7, 9, 8] | [10] | []
```

**Continue recursion** on `[7, 9, 8]` → pivot = 8
```
Partition around 8:
[7, 8, 9]
Result: [7] | [8] | [9]
```

**Final sorted array**: `[1, 5, 7, 8, 9, 10]`

## Implementation

```python
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    # Base case: if low >= high, array is sorted
    if low < high:
        # Partition and get pivot position
        pivot_index = partition(arr, low, high)

        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

    return arr


def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]

    # Index of smaller element (where partition happens)
    i = low - 1

    # Compare each element with pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            # Element is smaller than pivot, swap it
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]

    return i + 1  # Return pivot's final position
```

## Complexity Analysis

**Time Complexity**:
- **Best case**: O(n log n) — pivot divides array in half each time
- **Average case**: O(n log n) — typical random data
- **Worst case**: O(n²) — pivot is always smallest or largest element (already sorted arrays)
  - For 1,000 elements in worst case: 1,000,000 operations
  - For 1,000 elements in average case: ~10,000 operations

**Space Complexity**: O(log n)
- Recursive call stack depth (best/average case)
- O(n) in worst case (unbalanced partitions)
- Sorts in place, no auxiliary arrays needed

## Key Properties

- **In-place**: Sorts without requiring extra array space
- **Not stable**: Equal elements may change relative order
- **Cache-friendly**: Good locality of reference in practice
- **Fast on average**: Often faster than other O(n log n) algorithms
- **Vulnerable to worst case**: Poor pivot choices lead to O(n²) performance

## Pivot Selection Strategies

The pivot choice dramatically affects performance:

**Last element** (simple but vulnerable):
```python
pivot = arr[high]
```

**First element** (simple but vulnerable):
```python
pivot = arr[low]
```

**Middle element** (better for partially sorted data):
```python
pivot = arr[(low + high) // 2]
```

**Random element** (good average case):
```python
import random
pivot_index = random.randint(low, high)
```

**Median-of-three** (best practice):
```python
mid = (low + high) // 2
# Choose median of arr[low], arr[mid], arr[high]
pivot = median(arr[low], arr[mid], arr[high])
```

## Common Pitfalls

**Worst-case input**: Already-sorted arrays cause O(n²) performance with naive pivot selection. Use median-of-three or random pivots to mitigate.

**Not in-place with naive implementation**: Creating new arrays for left/right portions defeats the purpose. Use index-based partitioning.

**Infinite recursion**: Incorrect partition logic can fail to make progress, causing stack overflow.

**Not handling duplicates well**: Many equal elements can cause unbalanced partitions. Three-way partitioning (Dutch National Flag) improves this.

## When to Use

Use Quick Sort when:
- Average-case performance matters more than worst-case guarantees
- Memory is limited (in-place sorting)
- Data is randomly distributed
- You need a general-purpose sorting algorithm
- Cache efficiency matters (good locality)

Don't use Quick Sort when:
- Worst-case O(n log n) guarantee is required (use Merge Sort)
- Stability is required (use Merge Sort or Tim Sort)
- Data might be adversarially chosen
- Stack space is extremely limited

## Comparison with Other Sorts

**vs. Merge Sort**:
- Quick Sort: O(n log n) average, O(n²) worst, in-place, not stable
- Merge Sort: O(n log n) guaranteed, uses O(n) extra space, stable
- Quick Sort is often faster in practice due to better cache behavior

**vs. Heap Sort**:
- Both are in-place with O(n log n) average/worst case
- Quick Sort is typically 2-3x faster in practice
- Heap Sort has better worst-case guarantee

**vs. Tim Sort** (Python's built-in sort):
- Tim Sort is hybrid (Merge + Insertion), stable, adaptive
- Quick Sort is simpler and faster for random data
- Tim Sort is better for real-world data with patterns

## Variations

**Three-way Quick Sort**: Handles duplicates efficiently by partitioning into <pivot, =pivot, >pivot regions.

**Dual-pivot Quick Sort**: Uses two pivots, can be faster on modern hardware (used in Java's Arrays.sort).

**Introsort**: Hybrid algorithm that switches to Heap Sort if Quick Sort's recursion depth exceeds a threshold (prevents O(n²) worst case).

## Real-World Applications

- **Language standard libraries**: Basis for many built-in sort functions
- **Database query optimization**: Used internally for sorting operations
- **Graphics processing**: Sorting primitives by depth
- **Numerical computing**: Quick Select for finding k-th smallest element
- **General-purpose sorting**: Default choice when stability isn't required

## Optimization Tips

**Insertion Sort for small arrays**: When recursive calls reach small sizes (e.g., < 10 elements), switch to Insertion Sort for better performance.

**Tail recursion optimization**: Sort the smaller partition first, then loop on the larger (reduces stack depth).

**Median-of-three pivot**: Significantly reduces probability of worst-case behavior.

## See Also

- [[Merge Sort]]
- [[Heap Sort]]
- [[Partition Algorithm]]
- [[Divide and Conquer]]
- [[Big O Notation]]

## References

- Introduction to Algorithms (CLRS), Chapter 7
- "Algorithms" (Robert Sedgewick and Kevin Wayne)
- Hoare, C.A.R. (1961). "Algorithm 64: Quicksort"
- Bentley, Jon; McIlroy, Douglas (1993). "Engineering a Sort Function"
- Knuth, Donald. "The Art of Computer Programming, Volume 3: Sorting and Searching"
