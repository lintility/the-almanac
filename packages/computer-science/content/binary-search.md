---
title: Binary Search
chapter: computer-science
type: algorithm
difficulty: beginner
prerequisites:
  - "[[Arrays]]"
  - "[[Sorting]]"
related:
  - "[[Binary Search Tree]]"
  - "[[Divide and Conquer]]"
tags:
  - algorithms
  - searching
  - divide-and-conquer
  - efficiency
status: published
created: "2025-10-05"
updated: "2025-10-05"
author: Lintile
---

# Binary Search

## Overview

Binary search is a fast algorithm for finding a specific item in a sorted list. Instead of checking every item one by one, it repeatedly divides the search space in half—much like finding a word in a dictionary by opening to the middle, then deciding whether to search the left or right half.

## Core Concept

Binary search works on a simple principle: if you have a sorted list, you can eliminate half of the remaining items with each comparison.

Think of it like the number guessing game where someone picks a number between 1 and 100, and you try to guess it. The smart strategy? Always guess the middle number. If they say "higher," you've just eliminated all numbers below your guess. If they say "lower," you've eliminated all numbers above. You keep cutting the possibilities in half until you find the answer.

## How It Works

1. **Start in the middle**: Look at the item in the middle of your sorted list
2. **Compare**: Is it the item you're looking for?
   - If yes, you're done!
   - If the target is smaller, search the left half
   - If the target is larger, search the right half
3. **Repeat**: Apply the same process to the half you chose
4. **Stop**: When you find the item or run out of items to check

## Example

Let's search for the number 37 in a sorted array:

```
[2, 5, 8, 12, 16, 23, 37, 44, 56, 67, 89]
```

**Step 1**: Check middle (index 5) → 23
- 37 > 23, so search right half: `[37, 44, 56, 67, 89]`

**Step 2**: Check middle (index 2 of new range) → 56
- 37 < 56, so search left half: `[37, 44]`

**Step 3**: Check middle (index 0 of new range) → 37
- Found it! Return index 6 in original array

## Implementation

```python
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        # Find the middle index
        mid = (left + right) // 2

        # Check if we found the target
        if arr[mid] == target:
            return mid  # Found it!

        # Target is in the left half
        elif arr[mid] > target:
            right = mid - 1

        # Target is in the right half
        else:
            left = mid + 1

    return -1  # Not found
```

## Complexity Analysis

**Time Complexity**: O(log n)
- Each step eliminates half the remaining items
- For 1000 items, you need at most 10 comparisons
- For 1,000,000 items, you need at most 20 comparisons

**Space Complexity**: O(1)
- Only uses a constant amount of extra space

## Key Properties

- **Requires sorted data**: Binary search only works on sorted lists
- **Fast for large datasets**: The bigger the list, the more impressive the speedup
- **No wasted comparisons**: Every comparison eliminates half the possibilities

## Common Pitfalls

- **Forgetting to sort**: Binary search assumes the data is already sorted
- **Integer overflow**: When calculating `mid = (left + right) / 2`, use `mid = left + (right - left) / 2` to avoid overflow in some languages
- **Off-by-one errors**: Be careful with the boundary conditions (`<=` vs `<`)

## When to Use

Binary search is ideal when you:
- Have a sorted collection
- Need to search repeatedly (the sorting overhead pays off)
- Want fast lookups (much faster than checking every item)

Don't use binary search when:
- Your data isn't sorted (sorting takes time)
- You only need to search once (might not be worth sorting first)
- Your data changes frequently (maintaining sorted order has a cost)

## Variations

- **Lower bound**: Find the first position where an element could be inserted
- **Upper bound**: Find the last position where an element could be inserted
- **Binary search on answer**: Search for the answer to an optimization problem

## See Also

- [[Linear Search]]
- [[Binary Search Tree]]
- [[Divide and Conquer]]
- [[Big O Notation]]

## References

- Introduction to Algorithms (CLRS), Chapter 2.3
- The Art of Computer Programming, Volume 3 (Knuth)
