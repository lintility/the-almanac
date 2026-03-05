---
title: Modular Arithmetic
chapter: mathematics
type: concept
difficulty: intermediate
prerequisites:
  - "[[Division and Remainder]]"
  - "[[Greatest Common Divisor]]"
related:
  - "[[Prime Numbers]]"
  - "[[Cryptography]]"
  - "[[Hash Functions]]"
tags:
  - number-theory
  - modular-arithmetic
  - cryptography
  - mathematics
  - congruence
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Modular Arithmetic

## Overview

Modular arithmetic is a system of arithmetic for integers where numbers "wrap around" after reaching a certain value called the modulus. It's like clock arithmetic—after 12 o'clock comes 1 o'clock, not 13 o'clock.

This simple concept underlies cryptography, hash functions, random number generation, and countless computer science algorithms. If you've ever wondered how encryption works or why hash tables are efficient, modular arithmetic is a key piece of the puzzle.

## Core Concept

In modular arithmetic, we care about remainders after division. Two numbers are **congruent modulo n** if they leave the same remainder when divided by n.

**Notation**: a ≡ b (mod n)

**Read as**: "a is congruent to b modulo n"

**Means**: a and b have the same remainder when divided by n

**Examples**:
- 17 ≡ 5 (mod 12) because 17 % 12 = 5 % 12 = 5
- 23 ≡ 3 (mod 10) because 23 % 10 = 3 % 10 = 3
- 14 ≡ 2 (mod 6) because 14 % 6 = 2 % 6 = 2

**Clock analogy**: On a 12-hour clock:
- 17:00 (5 PM) is the same position as 5:00
- 17 ≡ 5 (mod 12)

## The Modulo Operation

The **modulo operation** (mod or %) finds the remainder after division:

```python
17 % 12 = 5  # 17 = 12×1 + 5
23 % 10 = 3  # 23 = 10×2 + 3
7 % 3 = 1    # 7 = 3×2 + 1
```

**Key property**: The result is always in the range [0, n-1] for modulus n.

**Examples with mod 5**:
- 0 % 5 = 0
- 1 % 5 = 1
- 5 % 5 = 0 (wraps around)
- 7 % 5 = 2
- 12 % 5 = 2

## Arithmetic Operations

Modular arithmetic preserves addition, subtraction, and multiplication:

### Addition

**(a + b) mod n = ((a mod n) + (b mod n)) mod n**

Example: (17 + 8) mod 12
```python
# Direct
(17 + 8) % 12 = 25 % 12 = 1

# Step by step
(17 % 12 + 8 % 12) % 12 = (5 + 8) % 12 = 13 % 12 = 1
```

**Clock example**: 5:00 + 8 hours = 1:00 (on 12-hour clock)

### Subtraction

**(a - b) mod n = ((a mod n) - (b mod n) + n) mod n**

The "+n" ensures non-negative results.

Example: (5 - 8) mod 12
```python
(5 - 8 + 12) % 12 = 9 % 12 = 9
```

**Clock example**: 5:00 - 8 hours = 9:00 (previous day)

### Multiplication

**(a × b) mod n = ((a mod n) × (b mod n)) mod n**

Example: (7 × 6) mod 10
```python
(7 * 6) % 10 = 42 % 10 = 2
```

**Useful for preventing integer overflow**:
```python
# Computing large products modulo n
a = 123456789
b = 987654321
n = 1000000007

# Instead of computing a * b (might overflow)
result = ((a % n) * (b % n)) % n
```

### Division (Modular Inverse)

Division is more complex. Instead of dividing by b, we multiply by b's **modular inverse**.

**Definition**: The modular inverse of b (mod n) is a number b⁻¹ such that:
**b × b⁻¹ ≡ 1 (mod n)**

**Requirement**: b and n must be coprime (GCD(b, n) = 1)

Example: Inverse of 3 (mod 7)
- Try: 3 × 5 = 15 ≡ 1 (mod 7) ✓
- So 3⁻¹ ≡ 5 (mod 7)

**Finding modular inverse** (using Extended Euclidean Algorithm):
```python
def mod_inverse(a, m):
    # Extended GCD
    def extended_gcd(a, b):
        if b == 0:
            return a, 1, 0
        gcd_val, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return gcd_val, x, y

    gcd_val, x, _ = extended_gcd(a, m)

    if gcd_val != 1:
        return None  # Inverse doesn't exist

    return (x % m + m) % m

# Example
inverse = mod_inverse(3, 7)  # Returns 5
# Verify: (3 * 5) % 7 = 15 % 7 = 1 ✓
```

## Properties

### Congruence Properties

**Reflexive**: a ≡ a (mod n)
**Symmetric**: If a ≡ b (mod n), then b ≡ a (mod n)
**Transitive**: If a ≡ b (mod n) and b ≡ c (mod n), then a ≡ c (mod n)

### Equivalence Classes

All integers congruent to each other mod n form an **equivalence class**:

**Mod 3 equivalence classes**:
- [0] = {..., -6, -3, 0, 3, 6, 9, ...}
- [1] = {..., -5, -2, 1, 4, 7, 10, ...}
- [2] = {..., -4, -1, 2, 5, 8, 11, ...}

### Fermat's Little Theorem

If p is prime and a is not divisible by p:
**a^(p-1) ≡ 1 (mod p)**

Example: 2⁷⁻¹ = 2⁶ = 64 ≡ 1 (mod 7)
(64 % 7 = 1 ✓)

**Application**: Fast modular exponentiation and primality testing.

## Modular Exponentiation

Computing a^b mod n efficiently using **binary exponentiation**:

**Naive approach** (inefficient for large b):
```python
result = (a ** b) % n  # Overflow for large a and b
```

**Efficient approach** (square-and-multiply):
```python
def mod_exp(base, exp, mod):
    result = 1
    base = base % mod

    while exp > 0:
        # If exp is odd, multiply result by base
        if exp % 2 == 1:
            result = (result * base) % mod

        # Square the base and halve the exponent
        base = (base * base) % mod
        exp = exp // 2

    return result

# Example: 2^10 mod 1000
result = mod_exp(2, 10, 1000)  # Returns 24
# 2^10 = 1024, 1024 % 1000 = 24
```

**Time Complexity**: O(log b) — much faster than O(b)

**Python built-in**:
```python
result = pow(2, 10, 1000)  # Returns 24
```

## Applications

### Cryptography

**RSA Encryption**: Uses modular exponentiation with large primes
```
Ciphertext = Message^e mod n
```

**Diffie-Hellman Key Exchange**: Uses modular arithmetic for secure key exchange

**Digital Signatures**: Rely on modular inverse and exponentiation

### Hash Functions

Hash tables use modulo to map keys to array indices:
```python
def hash_function(key, table_size):
    return key % table_size

# Example: Insert key 127 into table of size 10
index = hash_function(127, 10)  # Returns 7
```

### Cyclic Patterns

**Round-robin scheduling**: Assign tasks cyclically
```python
task_id = 47
num_workers = 5
assigned_worker = task_id % num_workers  # Worker 2
```

**Circular buffers**: Wrap around when reaching the end
```python
next_index = (current_index + 1) % buffer_size
```

### Random Number Generators

Linear Congruential Generator (simple RNG):
```python
def lcg(seed, a=1664525, c=1013904223, m=2**32):
    return (a * seed + c) % m
```

### Check Digits

Credit card validation (Luhn algorithm), ISBN checksums use modular arithmetic.

## Example: Caesar Cipher

Simple encryption by shifting letters:

```python
def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            # Convert to 0-25, shift, wrap around
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26
            result += chr(base + shifted)
        else:
            result += char
    return result

# Example
plaintext = "HELLO"
encrypted = caesar_encrypt(plaintext, 3)  # "KHOOR"
decrypted = caesar_encrypt(encrypted, -3)  # "HELLO"
```

## Common Pitfalls

**Negative numbers in different languages**:
```python
# Python: -7 % 3 = 2 (always non-negative)
# C/C++: -7 % 3 = -1 (sign depends on implementation)

# Safe approach
def safe_mod(a, n):
    return ((a % n) + n) % n
```

**Integer overflow**: When computing (a * b) % n for large numbers, compute modularly:
```python
# WRONG: May overflow
result = (a * b) % n

# RIGHT: Reduce modulo at each step
result = ((a % n) * (b % n)) % n
```

**Modular division without checking GCD**: Inverse only exists when GCD(a, n) = 1.

## When to Use Modular Arithmetic

Use modular arithmetic when:
- Implementing cryptographic algorithms
- Building hash functions or hash tables
- Working with cyclic patterns (clocks, calendars, buffers)
- Preventing integer overflow in calculations
- Solving problems with periodic behavior
- Implementing check digit algorithms

## See Also

- [[Greatest Common Divisor]]
- [[Prime Numbers]]
- [[Cryptography]]
- [[Hash Functions]]
- [[Fermat's Little Theorem]]

## References

- Knuth, Donald. "The Art of Computer Programming, Volume 2: Seminumerical Algorithms"
- "Introduction to Algorithms" (CLRS), Chapter 31
- "A Computational Introduction to Number Theory and Algebra" (Victor Shoup)
- [Modular Arithmetic (Khan Academy)](https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic)
