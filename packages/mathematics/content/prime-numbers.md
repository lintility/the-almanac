---
title: Prime Numbers
chapter: mathematics
type: concept
difficulty: beginner
prerequisites: []
related:
  - "[[Factorization]]"
  - "[[Modular Arithmetic]]"
  - "[[Number Theory]]"
tags:
  - number-theory
  - primes
  - divisibility
  - mathematics
status: published
created: "2025-10-05"
updated: "2025-10-05"
author: Lintile
---

# Prime Numbers

## Overview

A prime number is a whole number greater than 1 that can only be divided evenly by 1 and itself. Think of primes as the "atoms" of mathematics—they're the building blocks that all other whole numbers are made from.

## Core Concept

Prime numbers have exactly two factors: 1 and the number itself.

- **2 is prime**: Only divisible by 1 and 2
- **3 is prime**: Only divisible by 1 and 3
- **4 is NOT prime**: Divisible by 1, 2, and 4 (composite)
- **5 is prime**: Only divisible by 1 and 5

Imagine primes as LEGO pieces that can't be broken down further. Just as you can build any LEGO creation from basic bricks, you can build any whole number by multiplying primes together.

## The First Few Primes

2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...

Notice:
- **2 is the only even prime** (all other even numbers are divisible by 2)
- **Primes get less frequent** as numbers get larger
- **There's no pattern** to predict the next prime

## Testing for Primality

To check if a number n is prime:

1. Check if n ≤ 1 (not prime)
2. Check if n = 2 (the only even prime)
3. Check if n is even (not prime)
4. Test divisibility by odd numbers from 3 up to √n

```python
def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    # Check odd divisors up to √n
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2

    return True
```

**Why only check up to √n?**

If n has a factor larger than √n, it must also have a factor smaller than √n. So we only need to check the smaller factors.

## Key Properties

### Infinitude of Primes

There are infinitely many prime numbers. No matter how large a prime you find, there's always a larger one.

**Proof sketch**: Suppose you had a complete list of all primes. Multiply them all together and add 1. This new number isn't divisible by any prime on your list, meaning either it's prime itself, or it has a prime factor not on your list. Either way, your list was incomplete.

### Fundamental Theorem of Arithmetic

Every whole number greater than 1 can be expressed as a product of primes in exactly one way (ignoring order).

Examples:
- 12 = 2 × 2 × 3
- 30 = 2 × 3 × 5
- 100 = 2 × 2 × 5 × 5

## Finding Primes: Sieve of Eratosthenes

An ancient algorithm for finding all primes up to a limit:

1. List all numbers from 2 to n
2. Start with 2 (the first prime)
3. Cross out all multiples of 2 (except 2 itself)
4. Move to the next uncrossed number
5. Repeat steps 3-4 until you've processed all numbers

```python
def sieve_of_eratosthenes(limit):
    # Create a list of True values
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            # Mark multiples as not prime
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False

    # Return list of prime numbers
    return [num for num, prime in enumerate(is_prime) if prime]
```

## Applications

### Cryptography

Prime numbers are essential to modern encryption:
- RSA encryption relies on the difficulty of factoring large numbers into primes
- Your online banking depends on 300+ digit primes

### Hash Tables

Prime-sized hash tables reduce collisions and improve performance.

### Pseudo-Random Numbers

Prime numbers help generate better random number sequences.

## Distribution of Primes

### Prime Number Theorem

The density of primes near a number n is approximately 1/ln(n).

Around 1,000: roughly 1 in 7 numbers is prime
Around 1,000,000: roughly 1 in 14 numbers is prime

### Prime Gaps

The gaps between consecutive primes can be arbitrarily large, but they tend to be small for small primes.

## Famous Prime-Related Problems

### Twin Primes

Pairs of primes that differ by 2: (3,5), (5,7), (11,13), (17,19)...

**Conjecture**: There are infinitely many twin primes (unproven!)

### Goldbach's Conjecture

Every even number greater than 2 can be expressed as the sum of two primes.

Examples:
- 4 = 2 + 2
- 6 = 3 + 3
- 8 = 3 + 5
- 10 = 3 + 7 = 5 + 5

**Status**: Unproven for over 280 years!

## Common Misconceptions

- **Misconception**: 1 is a prime number
  - **Reality**: By definition, primes must have exactly two factors. 1 only has one factor (itself).

- **Misconception**: All odd numbers are prime
  - **Reality**: 9, 15, 21, 25... are all odd and composite

## See Also

- [[Composite Numbers]]
- [[Factorization]]
- [[Greatest Common Divisor]]
- [[Modular Arithmetic]]
- [[RSA Encryption]]

## References

- The Prime Pages - https://primes.utm.edu
- A Mathematician's Apology (G. H. Hardy)
- Prime Obsession (John Derbyshire)
