---
title: Arrays and Dynamic Arrays
chapter: computer-science
type: data-structure
difficulty: beginner
prerequisites:
  - "[[Variables]]"
  - "[[Memory Management]]"
related:
  - "[[Linked Lists]]"
  - "[[Stacks]]"
  - "[[Hash Tables]]"
  - "[[Big O Notation]]"
tags:
  - data-structures
  - arrays
  - memory
  - fundamentals
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Arrays and Dynamic Arrays

## Overview

An array is a collection of elements stored in contiguous memory locations, accessed by index. Think of it like a row of numbered mailboxes: each box (index) holds one item, and you can instantly retrieve any item if you know its box number.

Arrays are the most fundamental data structure in computing. Nearly every other data structure—stacks, queues, hash tables—builds on arrays or competes with them for different use cases.

## Core Concept

Arrays provide **O(1) constant-time access** to any element by index. This speed comes from a simple fact: since elements sit side-by-side in memory, the computer can calculate exactly where to find any element using math, not searching.

The calculation is straightforward:
```
element_address = array_start_address + (index × element_size)
```

For example, if an integer array starts at memory address 1000, and integers are 4 bytes:
- `array[0]` is at address 1000
- `array[1]` is at address 1004
- `array[2]` is at address 1008
- `array[10]` is at address 1040

The computer doesn't search through elements—it computes the address and jumps directly there.

## Types of Arrays

### Static Arrays (Fixed Size)

Traditional arrays have a fixed size set when created. Once allocated, the size cannot change.

**Characteristics:**
- Size determined at creation
- Memory allocated once, upfront
- Very fast and predictable
- Cannot grow or shrink

**Languages:** C, C++, Java (primitive arrays), Go

### Dynamic Arrays (Resizable)

Dynamic arrays automatically resize when you add elements beyond their capacity. They maintain array performance while allowing flexibility.

**Common names:**
- **Python:** `list`
- **JavaScript:** `Array`
- **Java:** `ArrayList`
- **C++:** `std::vector`
- **C#:** `List<T>`
- **Go:** slices
- **Rust:** `Vec<T>`

**How they work:**
1. Start with an array of fixed capacity (e.g., 4 elements)
2. When you add the 5th element, allocate a new, larger array (e.g., 8 elements)
3. Copy all existing elements to the new array
4. Add the new element
5. Delete the old array

This "resize and copy" operation is expensive, but it happens infrequently. Most additions are fast.

## Time Complexity

| Operation | Static Array | Dynamic Array |
|-----------|--------------|---------------|
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Insert at end | N/A | O(1) amortized* |
| Insert at beginning | O(n) | O(n) |
| Insert at middle | O(n) | O(n) |
| Delete at end | N/A | O(1) |
| Delete at beginning | O(n) | O(n) |
| Delete at middle | O(n) | O(n) |

***Amortized O(1):** Most insertions are O(1), but occasionally requires O(n) to resize. Averaged over many operations, it's O(1).

**Space Complexity:** O(n) for n elements

## Example: Array Access

Let's see how fast array access really is:

```python
# Create an array
numbers = [10, 20, 30, 40, 50]

# Instant access to any element
print(numbers[0])   # 10 - first element
print(numbers[2])   # 30 - third element
print(numbers[4])   # 50 - last element

# Doesn't matter if array has 5 elements or 5 million
# Access is always O(1)
```

Contrast this with a linked list, where accessing the 4th element requires traversing through elements 0, 1, 2, and 3.

## Implementation: Static Array in C

```c
#include <stdio.h>

int main() {
    // Declare array of 5 integers on the stack
    int numbers[5] = {10, 20, 30, 40, 50};

    // Access elements
    printf("First: %d\n", numbers[0]);    // 10
    printf("Third: %d\n", numbers[2]);    // 30

    // Modify element
    numbers[2] = 99;
    printf("Modified: %d\n", numbers[2]); // 99

    // Iterate through array
    for (int i = 0; i < 5; i++) {
        printf("numbers[%d] = %d\n", i, numbers[i]);
    }

    return 0;
}
```

**Key points:**
- Array size is fixed at compile time
- Very fast and memory-efficient
- No bounds checking (accessing `numbers[10]` causes undefined behavior)
- Lives on the stack (destroyed when function returns)

## Implementation: Dynamic Array in Python

```python
# Python lists are dynamic arrays
numbers = []  # Start empty

# Append elements (resizes automatically)
for i in range(5):
    numbers.append(i * 10)  # [0, 10, 20, 30, 40]

# Insert at end is fast
numbers.append(50)  # O(1) amortized

# Insert at beginning is slow (shifts all elements)
numbers.insert(0, -10)  # O(n) - now [-10, 0, 10, 20, 30, 40, 50]

# Insert at middle is also slow
numbers.insert(3, 15)  # O(n) - now [-10, 0, 10, 15, 20, 30, 40, 50]

# Access is always fast
print(numbers[5])  # O(1)

# Search requires iteration
if 20 in numbers:  # O(n)
    print("Found!")

# Delete from end is fast
numbers.pop()  # O(1) - removes 50

# Delete from middle is slow (shifts remaining elements)
del numbers[3]  # O(n) - removes 15
```

## Implementation: Dynamic Array from Scratch (Python)

Here's how dynamic arrays work under the hood:

```python
class DynamicArray:
    def __init__(self):
        self.capacity = 2  # Start small
        self.size = 0      # No elements yet
        self.array = [None] * self.capacity  # Pre-allocated space

    def append(self, item):
        # Check if we need to resize
        if self.size == self.capacity:
            self._resize()

        # Add item at the end
        self.array[self.size] = item
        self.size += 1

    def _resize(self):
        # Double the capacity
        self.capacity *= 2

        # Create new, larger array
        new_array = [None] * self.capacity

        # Copy all elements to new array
        for i in range(self.size):
            new_array[i] = self.array[i]

        # Switch to new array
        self.array = new_array

    def get(self, index):
        # Bounds check
        if index < 0 or index >= self.size:
            raise IndexError("Index out of range")

        return self.array[index]

    def __len__(self):
        return self.size

    def __str__(self):
        return str([self.array[i] for i in range(self.size)])

# Usage
arr = DynamicArray()
arr.append(10)  # [10], capacity=2
arr.append(20)  # [10, 20], capacity=2
arr.append(30)  # [10, 20, 30], capacity=4 (resized!)
arr.append(40)  # [10, 20, 30, 40], capacity=4

print(arr)          # [10, 20, 30, 40]
print(arr.get(2))   # 30
print(len(arr))     # 4
```

**How resizing works:**
- Start with capacity 2
- After 2 appends, resize to capacity 4
- After 4 appends, resize to capacity 8
- After 8 appends, resize to capacity 16

Each resize is expensive (O(n)), but happens exponentially less frequently. This gives **amortized O(1)** performance for append operations.

## Key Properties

**Advantages:**
- **Fast access:** O(1) to read or write any element by index
- **Cache-friendly:** Contiguous memory means CPU caches work efficiently
- **Memory-efficient:** No overhead per element (unlike linked lists with pointers)
- **Simple:** Easy to understand and implement

**Disadvantages:**
- **Expensive insertions/deletions:** Inserting or deleting in the middle requires shifting elements
- **Fixed size (static arrays):** Cannot grow after creation
- **Wasted space (dynamic arrays):** May have unused capacity after resizing
- **Expensive growth (dynamic arrays):** Occasional O(n) resize operation

## Common Pitfalls

**Off-by-one errors:**
Arrays are zero-indexed. An array of length 5 has valid indices 0-4, not 1-5.

```python
arr = [10, 20, 30]
# Valid: arr[0], arr[1], arr[2]
# Invalid: arr[3] - IndexError!
```

**Using append in loops instead of pre-allocation:**
If you know the size, pre-allocate:

```python
# Slow (many resizes)
arr = []
for i in range(1000000):
    arr.append(i)

# Fast (one allocation)
arr = [0] * 1000000
for i in range(1000000):
    arr[i] = i
```

**Assuming insertion is always cheap:**
`array.insert(0, x)` looks innocent but shifts every element. For 1 million elements, that's 1 million copies.

**Modifying array while iterating:**
```python
# Dangerous! Skips elements as you remove them
for i in range(len(arr)):
    if arr[i] == some_value:
        arr.pop(i)  # Shifts all elements, invalidates indices

# Correct approach: iterate backwards or use list comprehension
arr = [x for x in arr if x != some_value]
```

## When to Use

**Use arrays when:**
- You need fast access by index
- You know the approximate size in advance
- You mostly append to the end (dynamic arrays)
- Memory efficiency matters (large datasets)
- You're implementing other data structures (stacks, queues, heaps)

**Don't use arrays when:**
- You frequently insert or delete from the middle
- Size changes unpredictably and dramatically
- You need O(1) insertion at the beginning (use a [[Linked List]] or [[Deque]])

## Multi-Dimensional Arrays

Arrays can contain arrays, creating matrices or higher dimensions:

```python
# 2D array (matrix)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access: matrix[row][col]
print(matrix[1][2])  # 6 (row 1, column 2)

# Iterate through 2D array
for row in matrix:
    for value in row:
        print(value, end=' ')
    print()  # New line after each row
```

**Memory layout:** Despite the nested brackets, 2D arrays in languages like C are still stored in contiguous memory, row by row.

## See Also

- [[Linked Lists]]
- [[Stacks]]
- [[Queues]]
- [[Hash Tables]]
- [[Dynamic Programming]]
- [[Big O Notation]]
- [[Memory Management]]

## References

- Introduction to Algorithms (CLRS), Chapter 10.2
- [Python List Implementation (CPython source)](https://github.com/python/cpython/blob/main/Objects/listobject.c)
- [C++ std::vector Reference](https://en.cppreference.com/w/cpp/container/vector)
- The Art of Computer Programming, Volume 1 (Knuth), Section 2.2.2
