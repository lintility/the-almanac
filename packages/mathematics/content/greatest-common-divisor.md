---
title: Greatest Common Divisor (GCD)
chapter: mathematics
type: concept
difficulty: beginner
prerequisites:
  - "[[Prime Numbers]]"
  - "[[Divisibility]]"
related:
  - "[[Modular Arithmetic]]"
  - "[[Euclidean Algorithm]]"
  - "[[Least Common Multiple]]"
tags:
  - number-theory
  - algorithms
  - divisibility
  - gcd
  - mathematics
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Greatest Common Divisor (GCD)

## Overview

The Greatest Common Divisor (GCD) of two numbers is the largest number that divides both of them evenly. Also called the Greatest Common Factor (GCF) or Highest Common Factor (HCF), the GCD is fundamental to number theory, fraction simplification, and cryptography.

Think of it like finding the largest box size that can perfectly pack both 12 apples and 18 oranges with none left over. The GCD(12, 18) = 6, so you can use boxes that hold 6 fruits each.

## Core Concept

The GCD of two integers a and b is the largest positive integer that divides both a and b without remainder.

**Examples**:
- GCD(12, 18) = 6 (both divide evenly by 6)
- GCD(15, 25) = 5 (both divide evenly by 5)
- GCD(7, 13) = 1 (only 1 divides both—they're coprime)
- GCD(0, 5) = 5 (any number divides 0)

**Notation**: GCD(a, b) or gcd(a, b)

## Finding the GCD

### Method 1: Listing Factors

Find all divisors of each number, then identify the largest common one:

**Example**: GCD(24, 36)

Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24
Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36
Common factors: 1, 2, 3, 4, 6, 12
**Greatest common factor: 12**

**Limitation**: Slow for large numbers.

### Method 2: Prime Factorization

Factor both numbers into primes, then take the smallest power of each common prime:

**Example**: GCD(60, 90)

60 = 2² × 3 × 5
90 = 2 × 3² × 5

Common primes with minimum powers:
- 2: min(2, 1) = 1 → 2¹
- 3: min(1, 2) = 1 → 3¹
- 5: min(1, 1) = 1 → 5¹

GCD(60, 90) = 2 × 3 × 5 = **30**

**Limitation**: Factoring large numbers is computationally expensive.

### Method 3: Euclidean Algorithm

The most efficient method, based on the property:
**GCD(a, b) = GCD(b, a mod b)**

**Algorithm**:
1. If b = 0, then GCD(a, b) = a
2. Otherwise, GCD(a, b) = GCD(b, a mod b)
3. Repeat until b = 0

**Example**: GCD(48, 18)

```
GCD(48, 18) = GCD(18, 48 mod 18) = GCD(18, 12)
GCD(18, 12) = GCD(12, 18 mod 12) = GCD(12, 6)
GCD(12, 6)  = GCD(6, 12 mod 6)  = GCD(6, 0)
GCD(6, 0)   = 6
```

**Answer: 6**

**Implementation**:
```python
def gcd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = temp
    return a
```

**Recursive version**:
```python
def gcd_recursive(a, b):
    if b == 0:
        return a
    return gcd_recursive(b, a % b)
```

**Time Complexity**: O(log(min(a, b))) — extremely fast!

### Built-in Functions

Most languages provide GCD in standard libraries:

```python
import math
result = math.gcd(48, 18)  # Returns 6
```

```javascript
// JavaScript doesn't have built-in GCD, use implementation
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}
```

## Properties

### Fundamental Properties

**Commutative**: GCD(a, b) = GCD(b, a)

**Associative**: GCD(a, GCD(b, c)) = GCD(GCD(a, b), c)

**Identity with 0**: GCD(a, 0) = a

**Reflexive**: GCD(a, a) = a

### Relationship to LCM

GCD and Least Common Multiple (LCM) are related:

**a × b = GCD(a, b) × LCM(a, b)**

Example: a=12, b=18
- GCD(12, 18) = 6
- LCM(12, 18) = 36
- Verify: 12 × 18 = 216 = 6 × 36 ✓

```python
def lcm(a, b):
    return (a * b) // gcd(a, b)
```

### Coprime Numbers

Two numbers are **coprime** (or relatively prime) if GCD(a, b) = 1.

Examples:
- GCD(8, 15) = 1 → coprime
- GCD(8, 12) = 4 → not coprime

**Important**: Coprime doesn't mean both are prime—just that they share no common factors.

### Bézout's Identity

For any integers a and b, there exist integers x and y such that:
**ax + by = GCD(a, b)**

Example: GCD(35, 15) = 5
Solution: 35(1) + 15(-2) = 35 - 30 = 5

This is computed by the Extended Euclidean Algorithm.

## Applications

### Simplifying Fractions

Reduce a fraction to lowest terms by dividing numerator and denominator by their GCD:

```python
def simplify_fraction(numerator, denominator):
    common = gcd(numerator, denominator)
    return (numerator // common, denominator // common)

# Example: 24/36
# GCD(24, 36) = 12
# Simplified: 24/12 = 2, 36/12 = 3
# Result: 2/3
```

### Grid Problems

**Problem**: Starting at (0, 0), moving only right or up by 1 unit, how many distinct paths pass through (12, 18)?

Paths that pass through a grid point (a, b) starting from origin are related to GCD(a, b).

### Modular Arithmetic

GCD is essential for:
- Finding modular inverses
- Solving linear Diophantine equations
- RSA cryptography (requires coprime numbers)

### Music Theory

Musical intervals correspond to ratios. Simplified ratios (using GCD) give fundamental frequency relationships.

## Example: Tiling Problem

**Problem**: You have a 12 × 18 rectangular floor. What's the largest square tile that can cover it perfectly with no cutting?

**Solution**: The tile size is GCD(12, 18) = 6

Each tile is 6 × 6, and you need:
- 12 / 6 = 2 tiles along the 12-unit side
- 18 / 6 = 3 tiles along the 18-unit side
- Total: 2 × 3 = 6 tiles

```python
def largest_square_tile(length, width):
    tile_size = gcd(length, width)
    num_tiles = (length // tile_size) * (width // tile_size)
    return tile_size, num_tiles

# Example
tile_size, count = largest_square_tile(12, 18)
# Returns: (6, 6)
```

## Extended Euclidean Algorithm

Finds x and y such that ax + by = GCD(a, b):

```python
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0  # GCD, x, y

    gcd_val, x1, y1 = extended_gcd(b, a % b)

    x = y1
    y = x1 - (a // b) * y1

    return gcd_val, x, y

# Example
gcd_val, x, y = extended_gcd(35, 15)
# Returns: (5, 1, -2)
# Verify: 35(1) + 15(-2) = 35 - 30 = 5 ✓
```

**Applications**:
- Computing modular inverses
- Solving linear Diophantine equations
- RSA key generation

## Common Pitfalls

**Negative numbers**: GCD is typically defined for positive integers. For negative inputs, use absolute values:
```python
def gcd(a, b):
    a, b = abs(a), abs(b)
    while b != 0:
        a, b = b, a % b
    return a
```

**GCD of multiple numbers**: Apply GCD iteratively:
```python
from functools import reduce
result = reduce(gcd, [12, 18, 24, 30])  # Returns 6
```

**Confusing GCD with LCM**: GCD finds the largest common divisor. LCM finds the smallest common multiple. They're inverses in a sense.

## When to Use GCD

Use GCD when:
- Simplifying fractions
- Finding patterns in number relationships
- Solving tiling or grid problems
- Working with modular arithmetic
- Determining if numbers are coprime
- Implementing cryptographic algorithms

## See Also

- [[Least Common Multiple]]
- [[Euclidean Algorithm]]
- [[Modular Arithmetic]]
- [[Prime Numbers]]
- [[Number Theory]]

## References

- Euclid's Elements, Book VII (circa 300 BC) - Original algorithm
- Knuth, Donald. "The Art of Computer Programming, Volume 2: Seminumerical Algorithms"
- [Euclidean Algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_algorithm)
- Introduction to Algorithms (CLRS), Chapter 31
