---
title: Probability Fundamentals
chapter: mathematics
type: concept
difficulty: beginner
prerequisites: []
related:
  - "[[Statistics]]"
  - "[[Expected Value]]"
  - "[[Bayes Theorem]]"
  - "[[Random Variables]]"
tags:
  - probability
  - statistics
  - mathematics
  - fundamentals
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Content Writer
---

# Probability Fundamentals

## Overview

Probability is the mathematics of uncertainty. It gives us a way to measure how likely something is to happen—from predicting tomorrow's weather to understanding quantum physics.

Think of probability as a tool for making decisions when you don't have complete information. Should you bring an umbrella? Is this medical treatment effective? Will this investment pay off? Probability helps answer these questions with numbers instead of guesses.

## Core Concept

**Probability** measures the likelihood of an event occurring, expressed as a number between 0 and 1:

- **0** = impossible (will never happen)
- **1** = certain (will always happen)
- **0.5** = equally likely to happen or not

**Formula**: For equally likely outcomes:

```
P(event) = (number of favorable outcomes) / (total number of possible outcomes)
```

**Example**: Rolling a 4 on a standard die
- Favorable outcomes: 1 (just the 4)
- Total outcomes: 6 (faces 1-6)
- P(rolling 4) = 1/6 ≈ 0.167 or 16.7%

## Basic Terminology

### Sample Space

The **sample space** is the set of all possible outcomes.

**Rolling a die**: {1, 2, 3, 4, 5, 6}
**Flipping a coin**: {Heads, Tails}
**Drawing a card**: {52 different cards}

### Event

An **event** is a specific outcome or set of outcomes we care about.

**Rolling an even number**: {2, 4, 6}
**Getting heads**: {Heads}
**Drawing a heart**: {13 heart cards}

### Outcome

An **outcome** is a single result from the sample space.

Rolling a 3, flipping heads, drawing the Ace of Spades.

## Probability Rules

### Rule 1: Probability Range

All probabilities fall between 0 and 1:

```
0 ≤ P(event) ≤ 1
```

### Rule 2: Sum of All Outcomes

The probabilities of all possible outcomes add up to 1:

```
P(all outcomes) = 1
```

**Example**: Rolling a die
```
P(1) + P(2) + P(3) + P(4) + P(5) + P(6) = 1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6 = 1
```

### Rule 3: Complement Rule

The probability of something NOT happening is 1 minus the probability it does happen:

```
P(not A) = 1 - P(A)
```

**Example**: Probability of NOT rolling a 6
```
P(not 6) = 1 - P(6) = 1 - 1/6 = 5/6
```

This is often easier than counting all the ways something doesn't happen!

## Independent vs Dependent Events

### Independent Events

Events are **independent** if one doesn't affect the other.

**Example**: Flipping a coin twice
- First flip: P(Heads) = 1/2
- Second flip: P(Heads) = 1/2 (same, regardless of first flip)

**Multiplication rule for independent events**:
```
P(A and B) = P(A) × P(B)
```

**Example**: Probability of two heads in a row
```
P(H and H) = P(H) × P(H) = 1/2 × 1/2 = 1/4
```

### Dependent Events

Events are **dependent** if one affects the probability of the other.

**Example**: Drawing cards without replacement
- First card is an Ace: P = 4/52
- Second card is an Ace (given first was an Ace): P = 3/51 (only 3 Aces left in 51 cards)

**Example**: Probability of drawing two Aces in a row
```
P(Ace then Ace) = 4/52 × 3/51 ≈ 0.0045 or 0.45%
```

## Conditional Probability

**Conditional probability** is the probability of an event given that another event has occurred.

**Notation**: P(A|B) means "probability of A given B has happened"

**Formula**:
```
P(A|B) = P(A and B) / P(B)
```

**Example**: Drawing cards
- What's the probability a card is a King, given that it's a face card?
- P(King | Face card) = P(King and Face card) / P(Face card)
- P(King and Face card) = 4/52 (all Kings are face cards)
- P(Face card) = 12/52 (J, Q, K in 4 suits)
- P(King | Face card) = (4/52) / (12/52) = 4/12 = 1/3

Think of it like zooming in: once you know it's a face card, you're only looking at those 12 cards, and 4 of them are Kings.

## Bayes' Theorem

**Bayes' theorem** lets you flip conditional probabilities around. If you know P(B|A), you can find P(A|B).

**Formula**:
```
P(A|B) = P(B|A) × P(A) / P(B)
```

**Real-world example**: Medical testing

A disease affects 1% of the population. A test is 95% accurate (correctly identifies positive and negative cases 95% of the time).

You test positive. What's the probability you actually have the disease?

**Given**:
- P(Disease) = 0.01
- P(Positive | Disease) = 0.95
- P(Positive | No disease) = 0.05

**Find**: P(Disease | Positive)

First, find P(Positive):
```
P(Positive) = P(Positive | Disease) × P(Disease) + P(Positive | No disease) × P(No disease)
P(Positive) = 0.95 × 0.01 + 0.05 × 0.99 = 0.0095 + 0.0495 = 0.059
```

Now apply Bayes:
```
P(Disease | Positive) = P(Positive | Disease) × P(Disease) / P(Positive)
P(Disease | Positive) = 0.95 × 0.01 / 0.059 ≈ 0.161 or 16.1%
```

Surprising! Even with a positive test, there's only a 16% chance you have the disease. This is because the disease is rare, so false positives outnumber true positives.

## Expected Value

**Expected value** is the average outcome if you repeat something many times.

**Formula**:
```
E(X) = P(outcome₁) × value₁ + P(outcome₂) × value₂ + ...
```

**Example**: Rolling a die
```
E(die) = 1/6 × 1 + 1/6 × 2 + 1/6 × 3 + 1/6 × 4 + 1/6 × 5 + 1/6 × 6
E(die) = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21/6 = 3.5
```

You'll never roll 3.5, but over many rolls, the average will approach 3.5.

**Example**: Lottery decision
- Ticket costs $1
- Prize: $1,000,000
- Probability of winning: 1/2,000,000

Expected value:
```
E = P(win) × $1,000,000 + P(lose) × $0 - $1 (cost)
E = (1/2,000,000) × $1,000,000 - $1
E = $0.50 - $1 = -$0.50
```

On average, you lose 50 cents per ticket. Not a good bet!

## Common Probability Distributions

### Uniform Distribution

All outcomes are equally likely.

**Example**: Rolling a fair die
```
P(1) = P(2) = P(3) = P(4) = P(5) = P(6) = 1/6
```

### Binomial Distribution

The probability of getting exactly k successes in n independent trials, where each trial has probability p of success.

**Formula**:
```
P(k successes) = C(n,k) × p^k × (1-p)^(n-k)
```

Where C(n,k) is the number of ways to choose k items from n items.

**Example**: Flipping a coin 10 times
- What's the probability of getting exactly 6 heads?
- n = 10, k = 6, p = 0.5

```
C(10,6) = 10!/(6!×4!) = 210
P(6 heads) = 210 × (0.5)^6 × (0.5)^4 = 210 × (0.5)^10 ≈ 0.205 or 20.5%
```

### Normal Distribution

The famous bell curve. Many natural phenomena follow this pattern: heights, test scores, measurement errors.

**Properties**:
- Symmetric around the mean
- Mean = Median = Mode
- About 68% of values within 1 standard deviation of mean
- About 95% within 2 standard deviations
- About 99.7% within 3 standard deviations

**Example**: IQ scores
- Mean: 100
- Standard deviation: 15
- About 68% of people have IQ between 85-115
- About 95% have IQ between 70-130

## Real-World Applications

### Weather Forecasting

"70% chance of rain" means that in similar conditions, it rained 7 out of 10 times historically.

### Risk Assessment

Insurance companies use probability to calculate premiums. Higher risk (higher probability of claims) means higher premiums.

### Machine Learning

Classification algorithms output probabilities: "This email is 92% likely to be spam."

### Game Theory

Poker players calculate pot odds and expected value to make optimal decisions.

### Quality Control

Manufacturing uses probability to decide when to inspect products and set acceptable defect rates.

## Common Pitfalls

### The Gambler's Fallacy

After flipping 5 heads in a row, many people think tails is "due." But each flip is independent—the coin has no memory. P(Heads) is still 50% on the next flip.

### Confusing P(A|B) with P(B|A)

P(Positive test | Disease) is NOT the same as P(Disease | Positive test). Bayes' theorem shows how to convert between them.

### Base Rate Neglect

Ignoring how common something is in the population. In the medical test example, the disease's 1% base rate dramatically affects the final probability.

### Assuming Independence

Events often depend on each other in subtle ways. Drawing cards without replacement, weather patterns, economic indicators—these aren't independent.

## Practical Tips

### Use Complements

Instead of counting all the ways something can happen, sometimes it's easier to count the ways it doesn't happen:

P(at least one head in 3 flips) = 1 - P(no heads) = 1 - (1/2)³ = 1 - 1/8 = 7/8

### Draw It Out

For complex problems, tree diagrams or tables help visualize all possible outcomes.

### Check Your Answer

Probability must be between 0 and 1. If you get 1.2 or -0.3, you made a mistake!

### Simulate

When math gets complex, run simulations. Flip a coin 10,000 times in code and count the results.

```python
import random

def simulate_coin_flips(n_flips, n_trials):
    heads_count = 0
    for _ in range(n_trials):
        if random.random() < 0.5:
            heads_count += 1
    return heads_count / n_trials

# Should be close to 0.5
print(simulate_coin_flips(10000, 10000))
```

## When to Use Probability

Use probability when:
- Making decisions under uncertainty
- Analyzing random processes
- Quantifying risk
- Modeling natural phenomena
- Building statistical models or machine learning algorithms
- Understanding games of chance

## See Also

- [[Statistics]]
- [[Expected Value]]
- [[Bayes Theorem]]
- [[Random Variables]]
- [[Combinatorics]]
- [[Distributions]]
- [[Hypothesis Testing]]

## References

- "Introduction to Probability" by Grinstead and Snell (free online)
- "The Drunkard's Walk: How Randomness Rules Our Lives" by Leonard Mlodinow
- Khan Academy Probability and Statistics
- [Probability (Wikipedia)](https://en.wikipedia.org/wiki/Probability)
- "Thinking, Fast and Slow" by Daniel Kahneman (cognitive biases in probability)
