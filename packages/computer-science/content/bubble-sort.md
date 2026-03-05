---
title: Bubble Sort
chapter: computer-science
type: algorithm
difficulty: beginner
prerequisites:
  - "[[Arrays]]"
  - "[[Loops]]"
related:
  - "[[Merge Sort]]"
  - "[[Quick Sort]]"
  - "[[Sorting Algorithms]]"
tags:
  - algorithms
  - sorting
  - comparison-sort
  - beginner
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Bubble Sort

## Overview

Bubble Sort is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. The algorithm gets its name because smaller elements "bubble" to the top of the list with each pass.

While rarely used in practice due to its poor performance, Bubble Sort is valuable for learning the fundamentals of sorting algorithms and understanding why efficiency matters.

## Core Concept

Bubble Sort works by making multiple passes through the array. On each pass, it compares every pair of adjacent elements and swaps them if they're out of order. After each complete pass, the largest unsorted element "bubbles" into its correct position at the end.

Think of it like sorting a deck of cards by repeatedly scanning from left to right, swapping any pair that's out of order. After the first scan, the highest card is in the rightmost position. After the second scan, the second-highest card is in place. Continue until no more swaps are needed.

## How It Works

1. **First pass**: Compare each pair of adjacent elements from start to end
2. **Swap if needed**: If elements are out of order, swap them
3. **Largest element in place**: After the pass, the largest element is at the end
4. **Repeat**: Make another pass, ignoring the last element (already sorted)
5. **Continue**: Keep making passes until no swaps occur

## Example

Let's sort `[5, 3, 8, 4, 2]`:

**Pass 1**:
```
[5, 3, 8, 4, 2]  Compare 5 and 3 → swap
[3, 5, 8, 4, 2]  Compare 5 and 8 → no swap
[3, 5, 8, 4, 2]  Compare 8 and 4 → swap
[3, 5, 4, 8, 2]  Compare 8 and 2 → swap
[3, 5, 4, 2, 8]  ← 8 is now in correct position
```

**Pass 2**:
```
[3, 5, 4, 2, 8]  Compare 3 and 5 → no swap
[3, 5, 4, 2, 8]  Compare 5 and 4 → swap
[3, 4, 5, 2, 8]  Compare 5 and 2 → swap
[3, 4, 2, 5, 8]  ← 5 is now in correct position
```

**Pass 3**:
```
[3, 4, 2, 5, 8]  Compare 3 and 4 → no swap
[3, 4, 2, 5, 8]  Compare 4 and 2 → swap
[3, 2, 4, 5, 8]  ← 4 is now in correct position
```

**Pass 4**:
```
[3, 2, 4, 5, 8]  Compare 3 and 2 → swap
[2, 3, 4, 5, 8]  ← 3 is now in correct position
```

**Pass 5**: No swaps needed → array is sorted!

## Implementation

```python
def bubble_sort(arr):
    n = len(arr)

    # Make passes through the array
    for i in range(n):
        # Track if any swaps occurred this pass
        swapped = False

        # Compare adjacent elements up to the unsorted portion
        for j in range(0, n - i - 1):
            # Swap if elements are out of order
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swaps occurred, array is sorted
        if not swapped:
            break

    return arr
```

**Optimization**: The `swapped` flag allows early termination if the array becomes sorted before all passes complete.

## Complexity Analysis

**Time Complexity**:
- **Worst case**: O(n²) — when array is reverse sorted
  - Must make n passes, each examining n elements
  - For 1000 elements: up to 1,000,000 comparisons
- **Best case**: O(n) — when array is already sorted
  - Makes one pass, no swaps, terminates early
- **Average case**: O(n²) — typical random data

**Space Complexity**: O(1)
- Sorts in place, uses only a constant amount of extra space

## Key Properties

- **Simple to understand and implement**: Great for learning
- **Stable**: Equal elements maintain their relative order
- **In-place**: Sorts without requiring extra array space
- **Adaptive**: Performs well on nearly-sorted data (with optimization)
- **Inefficient**: Rarely used in practice due to quadratic time complexity

## Common Pitfalls

**Missing early termination**: Without the `swapped` flag, Bubble Sort makes unnecessary passes even after the array is sorted.

**Off-by-one errors**: The inner loop range must be `n - i - 1` to avoid comparing beyond the unsorted portion and prevent index errors.

**Using for large datasets**: Bubble Sort becomes painfully slow as data size grows. For 10,000 elements, expect up to 100 million comparisons.

## When to Use

Use Bubble Sort when:
- Learning sorting algorithm fundamentals
- Dataset is very small (< 10 elements)
- Data is nearly sorted (with optimization)
- Code simplicity matters more than performance
- As a teaching tool to understand why efficiency matters

Don't use Bubble Sort when:
- Dataset is medium or large
- Performance matters
- Better algorithms are available (almost always)

## Comparison with Other Sorts

**vs. Insertion Sort**: Insertion Sort is similar in complexity but typically faster in practice and better for nearly-sorted data.

**vs. Quick Sort**: Quick Sort is O(n log n) average case—dramatically faster for large datasets.

**vs. Merge Sort**: Merge Sort is consistently O(n log n) but requires extra space. Much faster for any significant dataset.

**Why learn Bubble Sort?**: It's the simplest sorting algorithm, making it perfect for understanding sorting concepts. Its poor performance also demonstrates why algorithmic efficiency matters.

## Variations

**Cocktail Shaker Sort**: Bubbles in both directions (forward and backward passes) to handle certain edge cases better.

**Odd-Even Sort**: Variant designed for parallel processing.

## Visual Intuition

Imagine sorting a vertical column of numbered balls where you can only compare and swap adjacent pairs:

```
Pass 1: 5       3       3       3       2
        3  →    5  →    5  →    2  →    3
        8       8       2       5       5
        4       2       8       8       8
        2       4       4       4       4
```

Each pass moves the heaviest unsorted ball to its final position.

## See Also

- [[Insertion Sort]]
- [[Merge Sort]]
- [[Quick Sort]]
- [[Big O Notation]]
- [[Sorting Algorithms Comparison]]

## References

- Introduction to Algorithms (CLRS), Chapter 2
- "Algorithms" (Robert Sedgewick and Kevin Wayne)
- Knuth, Donald. "The Art of Computer Programming, Volume 3: Sorting and Searching"
