---
title: Fibonacci Numbers
chapter: mathematics
type: sequence
difficulty: beginner
prerequisites: []
related:
  - "[[Recursion]]"
  - "[[Golden Ratio]]"
  - "[[Dynamic Programming]]"
tags:
  - number-theory
  - sequences
  - recursion
  - mathematics
  - fibonacci
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Fibonacci Numbers

## Overview

The Fibonacci sequence is one of the most famous patterns in mathematics. Each number is the sum of the two numbers before it: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, and so on. This deceptively simple pattern appears throughout nature, art, and computer science.

Think of it like climbing stairs: you can take one step or two steps at a time. The number of ways to climb n stairs follows the Fibonacci sequence.

## Core Concept

**The Fibonacci sequence** is defined by a simple recursive rule:

F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2) for n ≥ 2

Each number is the sum of the previous two numbers.

**The sequence**:
```
Position:  0  1  2  3  4  5   6   7   8   9   10
Value:     0  1  1  2  3  5   8  13  21  34   55
```

**Example**: F(6) = F(5) + F(4) = 5 + 3 = 8

## Calculating Fibonacci Numbers

### Method 1: Naive Recursion

The most direct translation of the mathematical definition:

```python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
```

**Problem**: This recalculates the same values many times. For F(5):
```
                F(5)
              /      \
          F(4)        F(3)
         /    \      /    \
      F(3)   F(2)  F(2)  F(1)
     /  \    /  \  /  \
   F(2) F(1) F(1) F(0) F(1) F(0)
   /  \
 F(1) F(0)
```

F(3) is calculated 2 times, F(2) is calculated 3 times. This grows exponentially!

**Time Complexity**: O(2ⁿ) — extremely slow for large n

### Method 2: Memoization (Top-Down)

Cache results to avoid recalculation:

```python
def fibonacci_memo(n, memo={}):
    # Check if already calculated
    if n in memo:
        return memo[n]

    # Base cases
    if n <= 1:
        return n

    # Calculate and store
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]
```

**Time Complexity**: O(n) — each value calculated once
**Space Complexity**: O(n) — stores n values

### Method 3: Iteration (Bottom-Up)

Build up from the base cases:

```python
def fibonacci_iterative(n):
    if n <= 1:
        return n

    prev2 = 0  # F(0)
    prev1 = 1  # F(1)

    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
```

**Time Complexity**: O(n)
**Space Complexity**: O(1) — only stores two values

**This is the most practical method for most use cases.**

### Method 4: Closed-Form Formula (Binet's Formula)

Mathematical formula using the golden ratio:

```python
import math

def fibonacci_formula(n):
    phi = (1 + math.sqrt(5)) / 2  # Golden ratio
    psi = (1 - math.sqrt(5)) / 2

    return int((phi**n - psi**n) / math.sqrt(5))
```

**Time Complexity**: O(1) — constant time!
**Limitation**: Floating-point precision issues for large n

## Properties and Patterns

### Every 3rd Fibonacci Number is Even

F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8

Pattern: odd, odd, **even**, odd, odd, **even**, ...

### Sum of First n Fibonacci Numbers

Sum from F(1) to F(n) = F(n+2) - 1

Example: 1 + 1 + 2 + 3 + 5 + 8 = 20 = F(8) - 1 = 21 - 1

### GCD Property

GCD(F(m), F(n)) = F(GCD(m, n))

Example: GCD(F(6), F(9)) = GCD(8, 34) = 2 = F(3) = F(GCD(6,9))

### Relationship to Golden Ratio

As n increases, the ratio F(n+1) / F(n) approaches φ (phi), the golden ratio:

φ = (1 + √5) / 2 ≈ 1.618...

```
F(2)/F(1) = 1/1 = 1.0
F(3)/F(2) = 2/1 = 2.0
F(4)/F(3) = 3/2 = 1.5
F(5)/F(4) = 5/3 = 1.666...
F(10)/F(9) = 55/34 = 1.617...
F(20)/F(19) = 6765/4181 = 1.61803...
```

## Applications

### Nature

- **Flower petals**: Lilies have 3, buttercups have 5, daisies have 34 or 55
- **Pine cones**: Spirals in Fibonacci numbers
- **Nautilus shells**: Spiral follows Fibonacci ratios
- **Tree branches**: Branching patterns
- **Rabbit reproduction**: Original problem posed by Fibonacci

### Computer Science

**Fibonacci Heap**: Efficient priority queue data structure

**Search Algorithms**: Fibonacci search similar to binary search

**Algorithm Analysis**: Worst-case for Euclidean algorithm occurs with consecutive Fibonacci numbers

### Finance

**Fibonacci Retracement**: Technical analysis tool for identifying support/resistance levels

### Art and Architecture

**Golden Rectangle**: Rectangle with sides in φ ratio, can be divided into a square and another golden rectangle

**Composition**: Artists use Fibonacci spiral for pleasing composition

## Example Problem: Climbing Stairs

**Problem**: How many distinct ways can you climb a staircase of n steps if you can take 1 or 2 steps at a time?

**Solution**: This is the Fibonacci sequence!

- 1 step: 1 way (just step 1)
- 2 steps: 2 ways (1+1 or 2)
- 3 steps: 3 ways (1+1+1, 1+2, 2+1)
- 4 steps: 5 ways (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)

Ways(n) = Ways(n-1) + Ways(n-2)

To reach step n, you either:
- Came from step n-1 (taking 1 step)
- Came from step n-2 (taking 2 steps)

```python
def climb_stairs(n):
    # Same as Fibonacci!
    if n <= 2:
        return n

    prev2 = 1
    prev1 = 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
```

## Common Pitfalls

**Using naive recursion for large n**: Exponential time makes it impractical for n > 40.

**Floating-point precision in Binet's formula**: For n > 70, precision errors accumulate.

**Integer overflow**: Fibonacci numbers grow quickly. Use appropriate data types:
- F(50) = 12,586,269,025 (fits in 64-bit integer)
- F(100) = 354,224,848,179,261,915,075 (needs arbitrary precision)

## When to Use Fibonacci

Use Fibonacci concepts when:
- Solving problems with overlapping subproblems
- Counting combinations (stairs, paths, tilings)
- Understanding recursion and dynamic programming
- Analyzing algorithm efficiency
- Exploring patterns in nature or design

## See Also

- [[Golden Ratio]]
- [[Recursion]]
- [[Dynamic Programming]]
- [[Greatest Common Divisor]]
- [[Number Theory]]

## References

- Liber Abaci (Fibonacci, 1202) - Original rabbit problem
- "The Fibonacci Quarterly" - Academic journal devoted to Fibonacci numbers
- Knuth, Donald. "The Art of Computer Programming"
- [Fibonacci Number (Wikipedia)](https://en.wikipedia.org/wiki/Fibonacci_number)
