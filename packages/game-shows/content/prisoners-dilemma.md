---
title: Prisoner's Dilemma
chapter: game-shows
type: concept
difficulty: beginner
prerequisites:
  - "[[Game Theory Fundamentals]]"
related:
  - "[[Nash Equilibrium]]"
  - "[[Cooperation vs Competition]]"
  - "[[Repeated Games]]"
tags:
  - game-theory
  - cooperation
  - strategy
  - social-dilemma
  - rational-choice
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Prisoner's Dilemma

## Overview

The Prisoner's Dilemma is the most famous problem in game theory. It reveals a fundamental tension: what's best for individuals can be terrible for the group. Two rational players, each acting in their own self-interest, end up worse off than if they had cooperated.

This simple game has profound implications for understanding cooperation, trust, arms races, environmental policy, business competition, and countless other situations where individual incentives conflict with collective welfare.

## The Classic Story

Two criminals are arrested and interrogated separately. The prosecutor doesn't have enough evidence to convict either one on the main charge without a confession. Each prisoner faces a choice: stay silent (cooperate with each other) or betray the other (defect).

**The offers**:
- If both stay silent: Both get 1 year in prison (minor charge)
- If both betray each other: Both get 3 years in prison
- If one betrays and the other stays silent: The betrayer goes free (0 years), the silent one gets 5 years

**The dilemma**: From each prisoner's individual perspective, betraying is always better—but when both betray, both are worse off than if both had stayed silent.

## The Payoff Matrix

```
              Prisoner B
            Cooperate | Defect
Prisoner A +----------+--------+
 Cooperate |  (-1,-1) | (-5,0) |
  Defect   |  (0,-5)  | (-3,-3)|
           +----------+--------+
```

Numbers represent years in prison (negative because they're bad). Each cell shows (Prisoner A's outcome, Prisoner B's outcome).

## Why It's a Dilemma

**From Prisoner A's perspective**:

*If Prisoner B cooperates (stays silent):*
- I cooperate → 1 year
- I defect → 0 years
- **Defecting is better**

*If Prisoner B defects (betrays):*
- I cooperate → 5 years
- I defect → 3 years
- **Defecting is better**

**Conclusion**: No matter what B does, A is better off defecting. By symmetry, the same logic applies to B.

**The paradox**: Both prisoners rationally choose to defect, getting 3 years each, even though both cooperating would give them only 1 year each.

## The Nash Equilibrium

(Defect, Defect) is a Nash equilibrium—neither player can improve their outcome by unilaterally changing strategy. If you're defecting and your partner is defecting, switching to cooperation makes you worse off (3 years → 5 years).

But it's a bad equilibrium—both players would prefer (Cooperate, Cooperate), yet neither can reach it through individual rational choice without trust.

## Why This Matters

The Prisoner's Dilemma structure appears everywhere:

### Arms Races

Two countries deciding whether to build weapons:
- Both building weapons: Expensive, no security advantage
- One builds, one doesn't: The builder has advantage
- Neither builds: Cheaper, same relative security

Result: Both build weapons, even though both would prefer peace.

### Environmental Issues

Companies deciding whether to pollute:
- Pollution is cheaper than environmental controls
- If everyone pollutes, everyone suffers
- Individual incentive: pollute (save money)
- Collective interest: don't pollute (clean environment)

Result: Tragedy of the commons—everyone pollutes.

### Business Competition

Two companies deciding whether to advertise heavily:
- Heavy advertising is expensive
- If one advertises and the other doesn't, the advertiser gains market share
- If both advertise, market share stays the same but costs are higher
- If neither advertises, market share stays the same and costs are lower

Result: Both advertise heavily, burning money without gaining advantage.

### Software Development

Team members deciding whether to write tests:
- Writing tests takes time (short-term cost)
- If I skip tests but others don't, I ship faster
- If everyone skips tests, codebase becomes unmaintainable
- If everyone writes tests, codebase is healthy

Result: Pressure to skip tests, leading to technical debt.

## Escaping the Dilemma

Real-world actors often achieve cooperation despite the dilemma. How?

### 1. Repeated Interaction

When the game repeats, new strategies emerge. The "tit-for-tat" strategy (cooperate first, then copy opponent's last move) performs remarkably well in iterated Prisoner's Dilemmas.

**Why it works**: Defecting now costs you future cooperation. The shadow of the future changes incentives.

### 2. Reputation

If others can observe your choices, defecting damages your reputation, making others less likely to cooperate with you later.

### 3. Communication

Talking before deciding helps. Not because it changes the payoff matrix, but because:
- It builds rapport and trust
- It establishes expectations
- It enables coordination

### 4. Changing Payoffs

Alter the incentives:
- Penalties for defection
- Rewards for cooperation
- Contracts with enforcement mechanisms

**Example**: Environmental regulations change the payoff matrix so polluting becomes expensive enough that cooperation is rational.

### 5. Group Identity

Shared identity or norms can shift how players value outcomes. If both prisoners are gang members with a code of silence, the "payoff" for cooperating includes maintaining gang standing.

## Variations

### Iterated Prisoner's Dilemma

Playing repeatedly changes everything. Successful strategies include:
- **Tit-for-tat**: Cooperate first, then copy opponent's previous move
- **Generous tit-for-tat**: Occasionally forgive defections
- **Grim trigger**: Cooperate until opponent defects once, then defect forever

### Continuous Prisoner's Dilemma

Instead of binary cooperate/defect, players choose contribution levels. More realistic for many real-world situations.

### Multi-Player Prisoner's Dilemma

Often called "public goods games" or "tragedy of the commons." Everyone benefits if most cooperate, but each individual is tempted to free-ride.

### Stag Hunt

A related game where cooperation is riskier but better if achieved. Differs from Prisoner's Dilemma in having cooperation as a stable equilibrium.

## Experimental Evidence

When real people play Prisoner's Dilemma in experiments:
- **Single-shot**: About 40-50% cooperate (not 0% as pure rationality predicts)
- **Repeated**: Cooperation rates rise significantly
- **With communication**: Cooperation jumps to 70-90%
- **Anonymous**: Cooperation falls

This suggests humans have cooperative instincts that extend beyond pure self-interest calculations.

## Key Insights

**Individual rationality ≠ collective rationality**: What's best for each person separately can be disastrous for everyone together.

**Trust is valuable**: The ability to credibly commit to cooperation creates value.

**Institutions matter**: Rules, norms, and enforcement mechanisms that support cooperation generate mutual benefit.

**Context changes behavior**: One-shot interactions favor defection; repeated interactions favor cooperation.

## Common Misconceptions

**"Cooperating is irrational"**: In one-shot anonymous games with no enforcement, yes. In real-world contexts with repetition and reputation, often no.

**"The dilemma means cooperation never happens"**: It explains why cooperation is hard, not impossible. Understanding the dilemma helps us design systems that enable cooperation.

**"Only selfish people defect"**: The structure creates the problem. Even well-meaning people face genuine dilemmas about when to cooperate.

## See Also

- [[Game Theory Fundamentals]]
- [[Nash Equilibrium]]
- [[Tragedy of the Commons]]
- [[Repeated Games]]
- [[Tit-for-Tat Strategy]]

## References

- "The Evolution of Cooperation" (Robert Axelrod)
- "Prisoner's Dilemma" (William Poundstone)
- "Thinking Strategically" (Dixit & Nalebuff)
- Tucker, Albert W. (1950). "A Two-Person Dilemma" (original formulation)
- Rapoport, Anatol. "Prisoner's Dilemma—Recollections and Observations"
