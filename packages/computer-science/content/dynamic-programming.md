---
title: Dynamic Programming
chapter: computer-science
type: technique
difficulty: intermediate
prerequisites:
  - "[[Recursion]]"
  - "[[Arrays]]"
related:
  - "[[Memoization]]"
  - "[[Divide and Conquer]]"
  - "[[Greedy Algorithms]]"
  - "[[Optimization]]"
tags:
  - algorithms
  - optimization
  - dynamic-programming
  - problem-solving
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Content Writer
---

# Dynamic Programming

## Overview

Dynamic Programming (DP) is a problem-solving technique that turns exponential-time recursive solutions into polynomial-time solutions by remembering what you've already calculated. Instead of recalculating the same subproblems over and over, you solve each one once and store the result.

Think of it like taking notes during a math exam instead of redoing the same calculation every time you need it. The first time might take work, but every time after that is instant.

## Core Concept

Dynamic Programming applies when a problem has two key properties:

1. **Overlapping Subproblems**: The same smaller problems appear multiple times
2. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems

If your recursive solution keeps calculating the same values repeatedly, dynamic programming can help.

**The key insight**: Trade memory for speed. Store results of subproblems to avoid recalculating them.

## Why "Dynamic Programming"?

The name is somewhat misleading—it has nothing to do with "programming" in the coding sense. The term was coined by Richard Bellman in the 1950s. "Dynamic" refers to time-varying processes, and "programming" means optimization (like "linear programming"). A more accurate name would be "optimized recursion with memoization."

## The Problem: Naive Recursion

Let's see why we need DP with the Fibonacci sequence:

```python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

This looks elegant, but calculating `fib(5)` requires:

```
                  fib(5)
                /        \
           fib(4)          fib(3)
          /      \        /      \
      fib(3)   fib(2)  fib(2)  fib(1)
      /   \    /   \   /   \
  fib(2) fib(1) fib(1) fib(0) fib(1) fib(0)
  /   \
fib(1) fib(0)
```

Notice `fib(3)` is calculated twice, `fib(2)` three times, and `fib(1)` five times. The number of calls grows exponentially—`fib(40)` makes over a billion calls!

**Time Complexity**: O(2^n) — completely impractical for large n

## Two Approaches to Dynamic Programming

### 1. Memoization (Top-Down)

Start with the recursive solution and add a cache to store results.

```python
def fib_memo(n, memo=None):
    # Initialize cache
    if memo is None:
        memo = {}

    # Check if already calculated
    if n in memo:
        return memo[n]

    # Base cases
    if n <= 1:
        return n

    # Calculate and store
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]
```

**How it works**:
1. Before computing, check if we've already solved this subproblem
2. If yes, return the cached result
3. If no, compute it, store it, and return it

**Pros**:
- Easy to convert from naive recursion
- Only computes subproblems actually needed
- Code mirrors the recursive structure

**Cons**:
- Uses call stack (can overflow for very deep recursion)
- Slightly slower due to function call overhead

**Time Complexity**: O(n) — each subproblem solved once
**Space Complexity**: O(n) — stores n values plus recursion stack

### 2. Tabulation (Bottom-Up)

Build up the solution iteratively, starting from the smallest subproblems.

```python
def fib_tab(n):
    # Base cases
    if n <= 1:
        return n

    # Create table
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1

    # Fill table bottom-up
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
```

**How it works**:
1. Create a table (usually an array) to store subproblem results
2. Fill in the base cases
3. Iteratively compute larger problems using smaller ones
4. Return the final answer

**Pros**:
- No recursion stack overhead
- Easier to optimize space (see below)
- Usually faster than memoization

**Cons**:
- Computes all subproblems, even if not needed
- Requires visualizing the dependency order

**Time Complexity**: O(n)
**Space Complexity**: O(n)

### Space Optimization

For Fibonacci, we only need the last two values:

```python
def fib_optimized(n):
    if n <= 1:
        return n

    prev2 = 0  # fib(i-2)
    prev1 = 1  # fib(i-1)

    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
```

**Space Complexity**: O(1) — only stores two values!

## Identifying DP Problems

Ask yourself these questions:

1. **Can I break this into smaller similar problems?**
   - If yes, recursion might work

2. **Do I solve the same subproblems multiple times?**
   - If yes, DP can help

3. **Can I express the answer in terms of smaller instances?**
   - If yes, there's likely a recurrence relation

**Common clues**:
- "Find the optimal..." (max/min/best)
- "Count the number of ways..."
- "Is it possible to..."
- Input includes constraints (capacity, length, etc.)

## Classic Dynamic Programming Problems

### Problem 1: Climbing Stairs

**Problem**: You can climb 1 or 2 steps at a time. How many ways to climb n steps?

**Insight**: To reach step n, you either:
- Came from step n-1 (took 1 step)
- Came from step n-2 (took 2 steps)

**Recurrence**: `ways(n) = ways(n-1) + ways(n-2)`

This is exactly Fibonacci!

```python
def climb_stairs(n):
    if n <= 2:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1  # 1 way to reach step 1
    dp[2] = 2  # 2 ways to reach step 2

    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
```

### Problem 2: 0/1 Knapsack

**Problem**: You have a knapsack with capacity W and n items with weights and values. Maximize value without exceeding capacity. Each item can be taken once.

**Items**:
- Item 1: weight=2, value=3
- Item 2: weight=3, value=4
- Item 3: weight=4, value=5
- Capacity: 5

**Recurrence**: For each item, either take it or leave it:
```
dp[i][w] = max(
    dp[i-1][w],              # don't take item i
    dp[i-1][w-weight[i]] + value[i]  # take item i (if it fits)
)
```

**Implementation**:

```python
def knapsack(weights, values, capacity):
    n = len(weights)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Option 1: don't take item i-1
            dp[i][w] = dp[i-1][w]

            # Option 2: take item i-1 (if it fits)
            if weights[i-1] <= w:
                take_value = dp[i-1][w - weights[i-1]] + values[i-1]
                dp[i][w] = max(dp[i][w], take_value)

    return dp[n][capacity]

# Example
weights = [2, 3, 4]
values = [3, 4, 5]
print(knapsack(weights, values, 5))  # Output: 7 (items 1 and 2)
```

**Time Complexity**: O(n × capacity)
**Space Complexity**: O(n × capacity)

### Problem 3: Longest Common Subsequence (LCS)

**Problem**: Find the longest subsequence common to two strings.

**Example**:
- String 1: "ABCDGH"
- String 2: "AEDFHR"
- LCS: "ADH" (length 3)

**Insight**: Compare characters from the end:
- If they match, include them: `1 + LCS(s1[:-1], s2[:-1])`
- If not, try both options: `max(LCS(s1[:-1], s2), LCS(s1, s2[:-1]))`

**Recurrence**:
```
if s1[i] == s2[j]:
    dp[i][j] = 1 + dp[i-1][j-1]
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

**Implementation**:

```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

print(lcs("ABCDGH", "AEDFHR"))  # Output: 3
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(m × n)

## Dynamic Programming vs Other Techniques

### DP vs Divide and Conquer

**Divide and Conquer** (like merge sort):
- Breaks problem into independent subproblems
- Solves each once
- Combines results
- Example: Merge sort, binary search

**Dynamic Programming**:
- Subproblems overlap (same problems reappear)
- Must avoid recalculating
- Example: Fibonacci, knapsack

### DP vs Greedy

**Greedy Algorithms**:
- Make locally optimal choice at each step
- Never reconsider choices
- Fast but doesn't always work
- Example: Making change with certain coin sets

**Dynamic Programming**:
- Considers all possibilities
- Finds globally optimal solution
- Slower but guarantees correctness
- Example: Making change with arbitrary coin sets

**When to use which**:

| Greedy Works | Needs DP |
|--------------|----------|
| US coins (1¢, 5¢, 10¢, 25¢) | Arbitrary coins (1¢, 3¢, 4¢) |
| Activity scheduling | Weighted scheduling |
| Huffman coding | Optimal BST |

### DP vs Backtracking

**Backtracking**:
- Explores all possible solutions
- Prunes bad branches early
- Example: N-Queens, Sudoku

**Dynamic Programming**:
- Only works when subproblems overlap
- Stores results to avoid recomputation
- Example: Fibonacci, knapsack

## Implementation Patterns

### Pattern 1: 1D DP (Linear)

Use when state depends on previous values in a sequence.

```python
# Template
dp = [base_value] * (n + 1)
dp[0] = base_case

for i in range(1, n + 1):
    dp[i] = f(dp[i-1], dp[i-2], ...)
```

**Examples**: Fibonacci, climbing stairs, house robber

### Pattern 2: 2D DP (Grid)

Use when state depends on two parameters.

```python
# Template
dp = [[0] * (n + 1) for _ in range(m + 1)]

# Initialize base cases
for i in range(m + 1):
    dp[i][0] = base_value
for j in range(n + 1):
    dp[0][j] = base_value

for i in range(1, m + 1):
    for j in range(1, n + 1):
        dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)
```

**Examples**: Knapsack, LCS, edit distance, grid path counting

### Pattern 3: State Machine

Use when problem has distinct states with transitions.

```python
# Example: Best time to buy/sell stock
hold = -prices[0]  # State: holding stock
sold = 0           # State: not holding stock

for price in prices[1:]:
    new_hold = max(hold, sold - price)
    new_sold = max(sold, hold + price)
    hold, sold = new_hold, new_sold
```

**Examples**: Stock trading, string transitions

## Common Pitfalls

### Off-by-One Errors

Make sure array indices match your problem definition. Draw out small examples.

### Wrong Base Cases

Incorrect base cases propagate errors through the entire solution. Test them carefully.

### Missing State Variables

If your DP solution gives wrong answers, you might be missing a state variable. The state should fully describe the subproblem.

### Incorrect Recurrence Relation

Carefully derive the recurrence from the problem. Test it on small examples by hand.

## Steps to Solve DP Problems

1. **Define the state**: What do you need to track? `dp[i]` or `dp[i][j]` means...?

2. **Write the recurrence**: How does `dp[i]` relate to smaller subproblems?

3. **Identify base cases**: What are the smallest subproblems you know the answer to?

4. **Determine the order**: Which subproblems must be solved first?

5. **Implement**: Start with memoization (easier), optimize to tabulation if needed.

6. **Optimize space**: Can you reduce dimensions? Keep only what you need.

## Practice Problems

**Beginner**:
- Fibonacci Numbers
- Climbing Stairs
- Min Cost Climbing Stairs

**Intermediate**:
- Coin Change
- Longest Increasing Subsequence
- House Robber
- Unique Paths

**Advanced**:
- Edit Distance
- Longest Palindromic Subsequence
- Regular Expression Matching
- Burst Balloons

## Real-World Applications

**Bioinformatics**: DNA sequence alignment uses DP to find similarities between genetic sequences.

**Natural Language Processing**: Spell checkers use edit distance (a DP algorithm) to suggest corrections.

**Operations Research**: Resource allocation, scheduling, and optimization problems.

**Finance**: Portfolio optimization, option pricing models.

**Computer Graphics**: Seam carving for content-aware image resizing.

## When to Use Dynamic Programming

Use DP when:
- You have a recursive solution that's too slow
- The same subproblems appear multiple times
- You're finding optimal solutions (max/min/count)
- The problem has overlapping subproblems and optimal substructure

Don't use DP when:
- Subproblems are independent (use divide and conquer)
- Greedy works (it's simpler and faster)
- The state space is too large (exponential in input size)

## See Also

- [[Recursion]]
- [[Memoization]]
- [[Divide and Conquer]]
- [[Greedy Algorithms]]
- [[Backtracking]]
- [[Time Complexity]]
- [[Space Complexity]]

## References

- "Introduction to Algorithms" (CLRS) - Chapter 15
- "Dynamic Programming for Coding Interviews" by Meenakshi & Kamal Rawat
- [Dynamic Programming Patterns](https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns)
- "The Algorithm Design Manual" by Steven Skiena
- TopCoder Dynamic Programming Tutorials
