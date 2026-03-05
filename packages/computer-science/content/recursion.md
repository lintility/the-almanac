---
title: Recursion
chapter: computer-science
type: concept
difficulty: intermediate
prerequisites:
  - "[[Functions]]"
  - "[[Call Stack]]"
related:
  - "[[Dynamic Programming]]"
  - "[[Tree Traversal]]"
  - "[[Divide and Conquer]]"
tags:
  - programming
  - recursion
  - algorithms
  - problem-solving
status: published
created: "2025-10-05"
updated: "2025-10-05"
author: Lintile
---

# Recursion

## Overview

Recursion is when a function calls itself to solve a problem by breaking it down into smaller, similar problems. It's like looking into two mirrors facing each other—each reflection contains a smaller version of the scene, until eventually the reflections become too small to see.

## Core Concept

A recursive function has two essential parts:

1. **Base case**: The stopping condition that prevents infinite loops
2. **Recursive case**: The function calling itself with a simpler version of the problem

Think of recursion like a set of Russian nesting dolls. To open the whole set, you:
1. Open the outer doll
2. If there's another doll inside, repeat the process
3. When you reach the smallest doll (base case), you're done

## How It Works

Every recursive function follows the same pattern:

```python
def recursive_function(problem):
    # Base case: the simplest version
    if problem_is_simple_enough:
        return simple_answer

    # Recursive case: break down the problem
    smaller_problem = make_problem_smaller(problem)
    smaller_answer = recursive_function(smaller_problem)

    # Combine to get final answer
    return combine(smaller_answer)
```

## Examples

### Example 1: Factorial

The factorial of 5 (written 5!) is 5 × 4 × 3 × 2 × 1 = 120.

Notice the pattern:
- 5! = 5 × 4!
- 4! = 4 × 3!
- 3! = 3 × 2!
- 2! = 2 × 1!
- 1! = 1 (base case)

```python
def factorial(n):
    # Base case
    if n <= 1:
        return 1

    # Recursive case
    return n * factorial(n - 1)
```

### Example 2: Fibonacci Sequence

The Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13...

Each number is the sum of the two before it.

```python
def fibonacci(n):
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1

    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## The Call Stack

When a function calls itself, each call gets added to the call stack:

```
factorial(3)
  → factorial(2)
    → factorial(1)
      → returns 1
    → returns 2 * 1 = 2
  → returns 3 * 2 = 6
```

The stack "unwinds" as each function returns its result.

## Key Properties

- **Elegant solutions**: Recursive code is often shorter and more readable
- **Natural for tree/graph problems**: Many data structures are inherently recursive
- **Memory overhead**: Each recursive call uses stack space
- **Potential for stack overflow**: Too many recursive calls can crash the program

## Common Patterns

### 1. Divide and Conquer

Break the problem into smaller independent pieces:
- Binary search
- Merge sort
- Quick sort

### 2. Backtracking

Try options and undo if they don't work:
- Solving mazes
- Sudoku solvers
- Generating permutations

### 3. Tree Processing

Naturally recursive structures:
- Tree traversal
- File system navigation
- Parsing expressions

## Recursion vs Iteration

**Recursion is better when:**
- The problem is naturally recursive (trees, graphs)
- The solution is more readable and maintainable
- Stack space isn't a concern

**Iteration is better when:**
- Performance is critical
- Stack space is limited
- The iterative solution is just as clear

## Common Misconceptions

- **Misconception**: Recursion is always slower than iteration
  - **Reality**: With tail call optimization, recursive functions can be just as fast

- **Misconception**: All recursive functions are hard to understand
  - **Reality**: Good recursive functions are often clearer than iterative versions

## Avoiding Stack Overflow

1. **Ensure base case is reachable**: Every recursive call should move toward the base case
2. **Limit recursion depth**: Add checks for maximum depth
3. **Use tail recursion**: Some languages optimize tail-recursive calls
4. **Consider iteration**: For very deep recursion, iteration might be safer

## Debugging Recursive Functions

1. **Print the inputs**: See what each call receives
2. **Visualize the call tree**: Draw out the recursive calls
3. **Verify the base case**: Make sure it actually stops recursion
4. **Check the reduction**: Ensure each call makes progress

## See Also

- [[Call Stack]]
- [[Tail Recursion]]
- [[Dynamic Programming]]
- [[Memoization]]
- [[Iteration]]

## References

- Structure and Interpretation of Computer Programs (SICP)
- The Little Schemer (Friedman & Felleisen)
