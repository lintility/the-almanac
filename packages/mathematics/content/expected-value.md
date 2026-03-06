---
title: Expected Value
chapter: mathematics
type: concept
difficulty: intermediate
prerequisites:
  - "[[Probability Fundamentals]]"
related:
  - "[[Statistics]]"
  - "[[Law of Large Numbers]]"
  - "[[Random Variables]]"
  - "[[Decision Theory]]"
  - "[[Game Theory]]"
tags:
  - probability
  - statistics
  - expected-value
  - decision-making
  - mathematics
status: draft
created: "2026-03-06"
updated: "2026-03-06"
author: Content Writer
---

# Expected Value

## Overview

Expected value is the long-run average outcome of a random event. If you could repeat something thousands of times, the expected value tells you what the average result would be.

Think of it as the "center of gravity" for all possible outcomes. It's not what you expect to happen on any single try—you might never get exactly that value. Instead, it's the weighted average of all possibilities, where each outcome is weighted by how likely it is to occur.

Expected value powers critical decisions in business, finance, medicine, and everyday life:
- **Insurance pricing:** How much should a policy cost based on risk?
- **Investment analysis:** What's the average return on this risky venture?
- **Medical decisions:** Which treatment has the best expected outcome?
- **Product launches:** Should we invest in this new feature?
- **A/B testing:** Which version performs better on average?

## Core Concept

**Expected value** is the sum of all possible outcomes, each multiplied by its probability.

**Formula:**
```
E(X) = P(x₁) × x₁ + P(x₂) × x₂ + P(x₃) × x₃ + ... + P(xₙ) × xₙ
```

Where:
- E(X) = expected value
- xᵢ = each possible outcome
- P(xᵢ) = probability of that outcome

**In plain English:** Take each outcome, multiply by how likely it is, then add them all up.

### Simple Example: Rolling a Die

```
Outcomes: 1, 2, 3, 4, 5, 6
Probability of each: 1/6

E(die) = 1/6 × 1 + 1/6 × 2 + 1/6 × 3 + 1/6 × 4 + 1/6 × 5 + 1/6 × 6
E(die) = (1 + 2 + 3 + 4 + 5 + 6) / 6
E(die) = 21 / 6 = 3.5
```

You'll never roll a 3.5, but over many rolls, the average approaches 3.5.

### Why It Matters

Expected value turns uncertainty into a number you can reason about. Instead of saying "this might work or it might not," you can say "on average, this is worth $50,000."

## Intuitive Understanding

### The Weighted Average

Expected value is a weighted average where probabilities are the weights.

**Example:** Test scores in a class
- 20% scored 60
- 50% scored 75
- 30% scored 90

Average score (expected value):
```
E = 0.20 × 60 + 0.50 × 75 + 0.30 × 90
E = 12 + 37.5 + 27
E = 76.5
```

More students scored 75, so it pulls the average toward 75, even though scores range from 60 to 90.

### Expected Value vs. Most Likely Outcome

These are different!

**Lottery example:**
- Win $1,000,000 with probability 1/1,000,000
- Win $0 with probability 999,999/1,000,000
- Ticket costs $2

Most likely outcome: $0 (you almost certainly lose)

Expected value:
```
E = (1/1,000,000) × $1,000,000 + (999,999/1,000,000) × $0 - $2
E = $1 - $2
E = -$1
```

You'll most likely get $0, but on average you lose $1 per ticket.

## Examples

### Dice Games

**Game:** Roll a die. You win the dollar amount shown.

```
E = 1/6 × $1 + 1/6 × $2 + 1/6 × $3 + 1/6 × $4 + 1/6 × $5 + 1/6 × $6
E = $3.50
```

**Fair price to play:** $3.50. Pay more and you lose on average. Pay less and you win on average.

**Modified game:** Roll a die. Win $10 if you roll a 6, $0 otherwise.

```
E = 1/6 × $10 + 5/6 × $0
E = $1.67
```

Fair price: $1.67 per roll.

### Casino Games

Casinos make money because every game has a negative expected value for players.

**Roulette (American):**
- Bet $1 on red
- 18 red slots, 18 black slots, 2 green slots (38 total)
- Win $1 if red, lose $1 otherwise

```
E = (18/38) × $1 + (20/38) × (-$1)
E = 0.474 - 0.526
E = -$0.053
```

You lose an average of 5.3 cents per $1 bet. Over thousands of spins, the casino's profit is almost guaranteed.

**Slot machines:** Typically have expected values between -$0.02 and -$0.15 per dollar wagered. The machine pays out less than it takes in, ensuring casino profit.

### Insurance

Insurance is expected value in action.

**Car insurance example:**
- 1% chance of $10,000 accident
- 99% chance of no accident
- Policy costs $150/year

**Your expected loss without insurance:**
```
E = 0.01 × $10,000 + 0.99 × $0
E = $100
```

**Your expected loss with insurance:**
```
E = $150 (premium)
```

You pay $50 more than expected value for peace of mind and protection against catastrophic loss. The insurance company profits from this difference.

**Insurance company's perspective:**
- Collect $150 from 100 customers = $15,000
- Expected payout: 1 claim × $10,000 = $10,000
- Expected profit: $5,000

With thousands of customers, the law of large numbers makes this profit nearly certain.

### Investment Decisions

**Startup investment:**
- Invest $10,000
- 70% chance the startup fails: lose $10,000
- 20% chance moderate success: gain $20,000
- 10% chance huge success: gain $100,000

```
E = 0.70 × (-$10,000) + 0.20 × $20,000 + 0.10 × $100,000
E = -$7,000 + $4,000 + $10,000
E = $7,000
```

Expected value is positive $7,000, even though failure is most likely. This is why venture capitalists invest in risky startups—they need just a few big wins to offset many failures.

### A/B Testing

**Website redesign:**
- Current site: 100 visitors/day, 2% conversion = 2 sales/day
- New design A: 85% chance it's worse (1.5% conversion), 15% chance better (3% conversion)

**Expected conversions with new design:**
```
E = 0.85 × (100 × 0.015) + 0.15 × (100 × 0.03)
E = 0.85 × 1.5 + 0.15 × 3
E = 1.275 + 0.45
E = 1.725 conversions/day
```

Current site: 2/day, New design: 1.725/day expected

**Decision:** Keep current design. The risk isn't worth the expected loss.

### Business Decisions

**Should we launch this product?**
- Development cost: $100,000
- 40% chance of failure: $0 revenue
- 40% chance of modest success: $150,000 revenue
- 20% chance of big success: $500,000 revenue

```
E(revenue) = 0.40 × $0 + 0.40 × $150,000 + 0.20 × $500,000
E(revenue) = $0 + $60,000 + $100,000
E(revenue) = $160,000

E(profit) = $160,000 - $100,000 = $60,000
```

Positive expected profit suggests launching, but consider:
- Risk tolerance (40% chance of losing $100,000)
- Opportunity cost (what else could you do with $100,000?)
- Company's financial situation (can you afford a loss?)

Expected value is one input, not the only decision factor.

## Expected Value vs. Actual Outcomes

**Critical insight:** Expected value is not a prediction of what will happen. It's the average over many repetitions.

### Single Trial vs. Many Trials

**Flip a coin, win $1 for heads, lose $1 for tails:**

Single flip: You get either +$1 or -$1, never $0.

Expected value:
```
E = 0.5 × $1 + 0.5 × (-$1) = $0
```

1,000 flips: You'll get very close to $0 total (approximately 500 heads, 500 tails).

### Variance Matters Too

Two scenarios with the same expected value can feel very different.

**Scenario A:**
- 100% chance of $50

**Scenario B:**
- 50% chance of $100
- 50% chance of $0

Both have E = $50, but:
- Scenario A: Guaranteed $50 (no risk)
- Scenario B: High variance (might get nothing)

Most people prefer Scenario A—this is **risk aversion**. Expected value ignores risk tolerance.

### The Law of Large Numbers

The **Law of Large Numbers** says that as you repeat something more times, the average result gets closer to the expected value.

**Example:** Flipping coins
- 10 flips: Might get 7 heads (70%)
- 100 flips: Might get 57 heads (57%)
- 1,000 flips: Might get 512 heads (51.2%)
- 10,000 flips: Might get 5,040 heads (50.4%)
- 100,000 flips: Very close to 50%

This is why:
- **Casinos always profit** (millions of bets make expected value almost certain)
- **Insurance companies profit** (thousands of policies average out)
- **Individual bets are risky** (small sample, high variance)

**Key point:** Expected value is reliable for repeated events, not single occurrences.

## Decision-Making Under Uncertainty

Expected value is a powerful decision-making tool, but it has limits.

### When Expected Value Guides Decisions

**Good for:**
- Repeated decisions (betting strategy over many hands)
- Large portfolios (investing in 100 startups)
- Long-term planning (insurance business model)
- Comparing options with similar risk profiles

**Example:** Which marketing campaign?
- Campaign A: $10,000 cost, expected return $15,000
- Campaign B: $10,000 cost, expected return $12,000

Choose A (higher expected value).

### When Expected Value Isn't Enough

**1. Catastrophic risk**

Bet your life savings on a coin flip to double your money:
```
E = 0.5 × (2×savings) + 0.5 × $0 = savings
```

Expected value is neutral, but the risk of losing everything is unacceptable. **Don't bet what you can't afford to lose.**

**2. Rare, high-impact events**

Nuclear reactor safety:
- 99.999% chance: $10 million profit
- 0.001% chance: $100 billion disaster

```
E = 0.99999 × $10,000,000 + 0.00001 × (-$100,000,000,000)
E = $9,999,900 - $1,000,000
E = $8,999,900 positive
```

Positive expected value, but the 0.001% risk is unacceptable. Some risks are too large, no matter how unlikely.

**3. Risk tolerance varies**

$100 matters more to someone with $1,000 than to someone with $1,000,000. **Utility** (personal value) isn't always linear with money.

**4. One-time decisions**

Starting a business has expected value considerations, but you only get one shot. Unlike a casino that can make billions of bets, your single attempt might be the 70% failure case.

### Expected Value + Other Factors

**Better decision framework:**
1. Calculate expected value
2. Consider variance and risk
3. Evaluate worst-case scenarios
4. Factor in your risk tolerance
5. Think about the decision frequency (one-time vs. repeated)

## Calculating Expected Value

### Discrete Outcomes

When you can list all possible outcomes:

```
E(X) = Σ [P(xᵢ) × xᵢ]
```

**Example:** Number of heads in 2 coin flips

Outcomes:
- 0 heads (TT): P = 1/4, value = 0
- 1 head (HT, TH): P = 2/4, value = 1
- 2 heads (HH): P = 1/4, value = 2

```
E = 1/4 × 0 + 2/4 × 1 + 1/4 × 2
E = 0 + 0.5 + 0.5
E = 1
```

Expected number of heads: 1 (makes sense—50% chance per flip, 2 flips).

### Continuous Outcomes

When outcomes are continuous (not discrete), use integration:

```
E(X) = ∫ x × f(x) dx
```

Where f(x) is the probability density function.

**Example:** Uniform distribution between 0 and 10
```
E(X) = ∫₀¹⁰ x × (1/10) dx = 5
```

The midpoint of the range.

### Linearity of Expectation

**Important property:** Expected value is linear.

```
E(X + Y) = E(X) + E(Y)
E(cX) = c × E(X)
```

This holds **even if X and Y are not independent!**

**Example:** Roll two dice. What's the expected sum?

Long way:
- List all 36 outcomes: (1,1), (1,2), ... (6,6)
- Calculate average

Short way:
```
E(die₁ + die₂) = E(die₁) + E(die₂)
E(die₁ + die₂) = 3.5 + 3.5 = 7
```

Much easier!

## Common Pitfalls

### Mistaking Expected Value for Most Likely Outcome

Expected value might never actually occur.

**Example:** Rolling a die → E = 3.5 (impossible outcome)

### Ignoring Variance

Same expected value doesn't mean same risk.
- Guaranteed $100 ≠ 50% chance of $200, 50% chance of $0

### Assuming Linearity for Non-Linear Functions

E(X²) ≠ [E(X)]²

**Example:** E(die) = 3.5, but E(die²) = 15.17, not 3.5² = 12.25

### Forgetting About Costs

When calculating expected profit, don't forget to subtract costs!

**Wrong:**
```
E(revenue) = 0.5 × $100 + 0.5 × $200 = $150
```

**Right:**
```
E(profit) = E(revenue) - cost
E(profit) = $150 - $80 = $70
```

### Treating Small Probabilities as Zero

1% isn't 0%. Over 100 trials, a 1% event is likely to happen.

### Applying to One-Time Events

Expected value is most reliable over many repetitions. Be cautious with unique, high-stakes decisions.

## Practical Applications

### Medical Treatment Decisions

**Treatment A:**
- 80% chance full recovery
- 15% chance partial recovery
- 5% chance no improvement

**Treatment B:**
- 60% chance full recovery
- 30% chance partial recovery
- 10% chance worsening

Assign quality-of-life scores (0-100):
```
E(A) = 0.80 × 100 + 0.15 × 60 + 0.05 × 40 = 91
E(B) = 0.60 × 100 + 0.30 × 60 + 0.10 × 20 = 80
```

Treatment A has higher expected outcome.

### Sports and Gambling

**Poker:** Professional players calculate expected value for each decision.

**Example:** Call a $100 bet with a flush draw
- 35% chance of hitting flush: win $300 pot
- 65% chance of missing: lose $100

```
E = 0.35 × $300 + 0.65 × (-$100)
E = $105 - $65
E = $40
```

Positive expected value → call the bet.

### Product Pricing

**Freemium model:**
- 95% free users: $0 revenue
- 4% basic plan: $10/month
- 1% premium plan: $50/month

Expected revenue per user:
```
E = 0.95 × $0 + 0.04 × $10 + 0.01 × $50
E = $0 + $0.40 + $0.50
E = $0.90/month per user
```

Need 111,112 users to make $100,000/month.

### Quality Control

**Defective product costs:**
- Inspection cost: $1 per item
- If defective item ships: $100 cost (returns, reputation)
- Defect rate: 2%

**Don't inspect:**
```
E(cost) = 0.02 × $100 = $2 per item
```

**Inspect everything:**
```
E(cost) = $1 per item (inspection) + 0 (no defects shipped)
```

Inspect everything saves $1 per item on average.

## See Also

- [[Probability Fundamentals]] - Foundation concepts
- [[Law of Large Numbers]] - Why expected value becomes reliable
- [[Random Variables]] - Formal treatment of randomness
- [[Variance]] - Measuring spread around expected value
- [[Decision Theory]] - Making optimal choices under uncertainty
- [[Game Theory]] - Strategic decision-making
- [[Utility Theory]] - Non-linear value functions
- [[Risk Management]] - Handling uncertainty in practice

## References

- "Introduction to Probability" by Bertsekas and Tsitsiklis
- "Thinking in Bets" by Annie Duke (expected value in decision-making)
- "The Signal and the Noise" by Nate Silver (prediction and probability)
- [Expected Value (Khan Academy)](https://www.khanacademy.org/math/statistics-probability)
- "Against the Gods: The Remarkable Story of Risk" by Peter L. Bernstein
