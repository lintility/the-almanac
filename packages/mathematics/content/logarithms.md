---
title: Logarithms
chapter: mathematics
type: concept
difficulty: intermediate
prerequisites:
  - "[[Exponents and Powers]]"
related:
  - "[[Big O Notation]]"
  - "[[Binary Search]]"
  - "[[Complexity Analysis]]"
tags:
  - algebra
  - logarithms
  - exponents
  - mathematics
  - complexity
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Logarithms

## Overview

A logarithm answers the question: "To what power must I raise this base to get this number?" If exponents build numbers up through repeated multiplication, logarithms break them back down. Understanding logarithms is essential for analyzing algorithm efficiency, working with exponential growth, and understanding phenomena that span many orders of magnitude.

Think of logarithms as the inverse of exponents, much like division is the inverse of multiplication. If 2³ = 8, then log₂(8) = 3.

## Core Concept

**The logarithm** log_b(x) asks: "What power of b gives x?"

**Definition**: **log_b(x) = y** means **b^y = x**

**Examples**:
- log₂(8) = 3 because 2³ = 8
- log₁₀(100) = 2 because 10² = 100
- log₂(32) = 5 because 2⁵ = 32
- log₁₀(1000) = 3 because 10³ = 1000

**Three parts**:
- **Base** (b): The number being raised to a power
- **Argument** (x): The result we're analyzing
- **Result** (y): The exponent/power

## Common Logarithm Bases

### Base 10 (Common Logarithm)

**Notation**: log(x) or log₁₀(x)

Used in:
- pH scale (acidity/alkalinity)
- Decibels (sound intensity)
- Richter scale (earthquake magnitude)
- Scientific notation

**Examples**:
- log₁₀(10) = 1
- log₁₀(100) = 2
- log₁₀(1000) = 3

**Pattern**: log₁₀(10^n) = n

### Base 2 (Binary Logarithm)

**Notation**: log₂(x) or lg(x)

Used in:
- Computer science and algorithms
- Information theory (bits of information)
- Binary tree analysis
- Complexity analysis

**Examples**:
- log₂(2) = 1
- log₂(4) = 2
- log₂(8) = 3
- log₂(1024) = 10

**Pattern**: log₂(2^n) = n

### Base e (Natural Logarithm)

**Notation**: ln(x) or log_e(x)

e ≈ 2.71828 (Euler's number)

Used in:
- Calculus and continuous growth
- Probability and statistics
- Physics and engineering
- Compound interest

**Examples**:
- ln(e) = 1
- ln(e²) = 2
- ln(1) = 0

## Computing Logarithms

### In Code

```python
import math

# Base 10 (common logarithm)
log10 = math.log10(100)  # Returns 2.0

# Base 2 (binary logarithm)
log2 = math.log2(8)  # Returns 3.0

# Natural logarithm (base e)
ln = math.log(2.718)  # Returns ~1.0

# Arbitrary base
def log_base(x, base):
    return math.log(x) / math.log(base)

log_3_9 = log_base(9, 3)  # Returns 2.0 (because 3^2 = 9)
```

### Change of Base Formula

Convert between bases:

**log_b(x) = log_a(x) / log_a(b)**

Example: Compute log₃(27) using natural logarithm
```python
log_3_27 = math.log(27) / math.log(3)  # Returns 3.0
```

## Logarithm Properties

### Product Rule

**log_b(xy) = log_b(x) + log_b(y)**

Example:
- log₂(8 × 4) = log₂(8) + log₂(4) = 3 + 2 = 5
- Verify: log₂(32) = 5 ✓

**Why it works**: If b^m = x and b^n = y, then xy = b^m × b^n = b^(m+n)

### Quotient Rule

**log_b(x/y) = log_b(x) - log_b(y)**

Example:
- log₂(16/4) = log₂(16) - log₂(4) = 4 - 2 = 2
- Verify: log₂(4) = 2 ✓

### Power Rule

**log_b(x^n) = n × log_b(x)**

Example:
- log₂(8³) = 3 × log₂(8) = 3 × 3 = 9
- Verify: log₂(512) = 9 ✓ (because 2⁹ = 512)

### Special Cases

**log_b(1) = 0** (because b⁰ = 1)
**log_b(b) = 1** (because b¹ = b)
**log_b(b^n) = n** (inverse property)

### Inverse Relationship

**b^(log_b(x)) = x**

Example: 2^(log₂(7)) = 7

## Applications in Computer Science

### Algorithm Complexity

Logarithms appear in Big O notation for efficient algorithms:

**O(log n)**: Algorithms that repeatedly halve the problem
- Binary search
- Balanced binary tree operations
- Finding the most significant bit

**Why log₂(n)?** Halving n repeatedly until you reach 1:
- 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1
- Takes ~10 steps (log₂(1000) ≈ 10)

```python
def binary_search_steps(n):
    return int(math.log2(n)) + 1

# For 1,000,000 elements
steps = binary_search_steps(1000000)  # ~20 steps
# vs linear search: 1,000,000 steps
```

### Tree Height

A balanced binary tree with n nodes has height ~log₂(n):

```python
def tree_height(n_nodes):
    return math.ceil(math.log2(n_nodes + 1))

# Tree with 1000 nodes has height ~10
height = tree_height(1000)  # Returns 10
```

### Bit Length

Number of bits needed to represent n:

```python
def bit_length(n):
    if n == 0:
        return 1
    return math.floor(math.log2(n)) + 1

# 255 requires 8 bits (1-255 fits in 8 bits)
bits = bit_length(255)  # Returns 8
```

### Doubling Time

How long until something doubles at a given growth rate?

**Doubling time ≈ 70 / growth_rate**

(Uses natural logarithm: ln(2) ≈ 0.693)

```python
def doubling_time(growth_rate_percent):
    return 70 / growth_rate_percent

# At 7% annual growth
years = doubling_time(7)  # ~10 years to double
```

## Logarithmic Scales

### Decibels (Sound)

Sound intensity on logarithmic scale:

**dB = 10 × log₁₀(I / I₀)**

- 0 dB: Threshold of hearing
- 60 dB: Normal conversation (1,000,000× threshold)
- 120 dB: Threshold of pain (1,000,000,000,000× threshold)

Each 10 dB increase = 10× intensity increase.

### pH Scale (Acidity)

**pH = -log₁₀[H⁺]**

- pH 7: Neutral (water)
- pH 3: Acidic (orange juice, 10,000× more H⁺ than water)
- pH 11: Basic (ammonia, 10,000× less H⁺ than water)

### Richter Scale (Earthquakes)

Each whole number increase = 10× energy release:
- Magnitude 5: Moderate earthquake
- Magnitude 6: 10× more energy
- Magnitude 7: 100× more energy than magnitude 5

## Example: Binary Search Analysis

**Problem**: How many steps to search a sorted array of n elements?

**Analysis**: Each comparison eliminates half the remaining elements.

After k comparisons, at most n / 2^k elements remain.
We stop when n / 2^k = 1.

Solving for k:
```
n / 2^k = 1
n = 2^k
k = log₂(n)
```

**Implementation with logging**:
```python
def binary_search_instrumented(arr, target):
    left, right = 0, len(arr) - 1
    steps = 0

    while left <= right:
        steps += 1
        mid = (left + right) // 2

        if arr[mid] == target:
            print(f"Found in {steps} steps")
            print(f"Theoretical max: {math.ceil(math.log2(len(arr)))}")
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Test
arr = list(range(1000))  # 1000 elements
binary_search_instrumented(arr, 873)
# Output: Found in 9 steps
# Theoretical max: 10
```

## Common Pitfalls

**log(0) is undefined**: No power of any positive base gives 0.

**log of negative numbers**: Undefined in real numbers (involves complex numbers).

**Confusing log bases**: log(x) might mean log₁₀(x) in some contexts, ln(x) in others. Always clarify.

**Order of operations**: log(xy) ≠ log(x) × log(y). Use product rule instead.

**Floating-point precision**: Logarithms of very large or very small numbers can lose precision.

## Solving Logarithmic Equations

**Example**: Solve log₂(x) = 5

Convert to exponential form: x = 2⁵ = 32

**Example**: Solve log₂(x) + log₂(4) = 5

Use product rule: log₂(4x) = 5
Convert: 4x = 2⁵ = 32
Solve: x = 8

## When to Use Logarithms

Use logarithms when:
- Analyzing algorithm complexity (especially divide-and-conquer)
- Working with exponential growth or decay
- Dealing with data spanning many orders of magnitude
- Solving equations involving exponents
- Understanding tree structures
- Measuring phenomena on logarithmic scales

## See Also

- [[Exponents and Powers]]
- [[Big O Notation]]
- [[Binary Search]]
- [[Complexity Analysis]]
- [[Information Theory]]

## References

- Introduction to Algorithms (CLRS), Appendix A
- "The Art of Computer Programming" (Donald Knuth)
- "Concrete Mathematics" (Graham, Knuth, Patashnik)
- [Logarithm (Khan Academy)](https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs)
