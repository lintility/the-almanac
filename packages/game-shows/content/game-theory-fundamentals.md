---
title: Game Theory Fundamentals
chapter: game-shows
type: theory
difficulty: beginner
prerequisites:
  - "[[Decision Making]]"
  - "[[Strategic Thinking]]"
related:
  - "[[Prisoner's Dilemma]]"
  - "[[Nash Equilibrium]]"
  - "[[Zero-Sum Games]]"
tags:
  - game-theory
  - strategy
  - decision-making
  - rational-choice
  - economics
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Game Theory Fundamentals

## Overview

Game theory is the mathematical study of strategic decision-making in situations where multiple parties interact. It provides a framework for understanding how rational actors make choices when the outcome depends not just on their own actions, but on the actions of others.

Think of it like chess: your best move depends on what you think your opponent will do, which depends on what they think you'll do. Game theory formalizes this mutual reasoning and helps identify optimal strategies.

## Core Concept

At its heart, game theory asks: **What should you do when your success depends on someone else's choices?**

The framework assumes:
- Multiple **players** (decision makers)
- Each player has available **strategies** (choices)
- Each combination of strategies produces **payoffs** (outcomes)
- Players are **rational** (they prefer better outcomes to worse ones)

Game theory doesn't just describe what players do—it predicts what rational players *should* do to maximize their outcomes given the strategic environment.

## Key Components

### Players

The decision-makers in the game. Can be individuals, companies, countries, or any entity making strategic choices.

**Example**: In a pricing competition, the players are competing companies.

### Strategies

The complete set of actions available to each player.

**Example**: A company's pricing strategies might be "price high," "price medium," or "price low."

### Payoffs

The outcome each player receives for each combination of strategies.

**Example**: Profit, utility, votes, or any measure of value to the player.

### Information

What each player knows when making decisions:
- **Perfect information**: All players know everything (like chess)
- **Imperfect information**: Some information is hidden (like poker)

## Types of Games

### Cooperative vs. Non-Cooperative

**Cooperative games**: Players can form binding agreements and coalitions.
**Non-cooperative games**: Each player acts independently (most game theory focuses here).

### Simultaneous vs. Sequential

**Simultaneous games**: Players choose strategies at the same time without knowing others' choices (like rock-paper-scissors).
**Sequential games**: Players move in order, observing previous actions (like chess).

### Zero-Sum vs. Non-Zero-Sum

**Zero-sum**: One player's gain exactly equals another's loss (like poker—money moves between players but total stays constant).
**Non-zero-sum**: Players can have aligned or partially aligned interests, allowing for mutual benefit or mutual harm.

## Example: The Coordination Game

Two friends want to meet up but lost touch. They can go to the coffee shop or the library. They only succeed if they choose the same location.

**Payoff matrix**:

```
                Friend B
              Coffee | Library
Friend A   +--------+---------+
  Coffee   |  (1,1) |  (0,0)  |
  Library  |  (0,0) |  (1,1)  |
           +--------+---------+
```

Each cell shows (Friend A's payoff, Friend B's payoff).

**Analysis**:
- Two pure strategy equilibria: both choose Coffee, or both choose Library
- Both players prefer coordination over missing each other
- The challenge is selecting which equilibrium without communication

## Normal Form (Matrix) Games

Games with simultaneous moves are often represented as payoff matrices.

**Example: Battle of the Sexes**

A couple wants to spend the evening together. Player 1 prefers the opera, Player 2 prefers the football game, but both prefer being together over being apart.

```
              Player 2
            Opera | Football
Player 1  +-------+---------+
  Opera   | (2,1) |  (0,0)  |
 Football | (0,0) |  (1,2)  |
          +-------+---------+
```

**Key insight**: Multiple equilibria exist. Both going to the opera is an equilibrium (Player 1 is happier), as is both going to football (Player 2 is happier). Neither wants to unilaterally deviate.

## Dominant Strategies

A strategy that is best regardless of what opponents do.

**Example: Advertising Game**

Two companies decide whether to advertise:

```
              Company B
            Advertise | Don't
Company A  +----------+--------+
 Advertise |  (3,3)   | (5,1)  |
   Don't   |  (1,5)   | (4,4)  |
           +----------+--------+
```

**Analysis**:
- If B advertises, A gets 3 from advertising vs. 1 from not → advertise is better
- If B doesn't advertise, A gets 5 from advertising vs. 4 from not → advertise is better
- Advertising is a **dominant strategy** for A (and by symmetry, for B too)
- Both advertise (3,3), even though both not advertising (4,4) would be better for both

This is an example of a collective action problem—individual rationality leads to a worse outcome for everyone.

## Best Response

The best strategy for a player given what they believe others will do.

**Finding equilibria**: Look for combinations where each player's strategy is a best response to the others' strategies.

## Mixed Strategies

When players randomize their choices with specific probabilities.

**Example: Penalty Kicks**

In soccer penalty kicks:
- Kicker chooses left or right
- Goalie chooses left or right
- If both choose the same direction, goalie has advantage

Neither should always choose the same direction (they'd be predictable). The equilibrium involves randomizing—mixing strategies to keep the opponent uncertain.

## Sequential Games and Game Trees

Sequential games are visualized as decision trees showing the order of moves.

**Example: Entry Deterrence**

- Firm 1 decides whether to enter a market
- If they enter, Firm 2 decides whether to fight (price war) or accommodate

```
Firm 1
  |
  +-- Enter
  |     |
  |     Firm 2
  |     |
  |     +-- Fight: (-1, -1)
  |     +-- Accommodate: (2, 1)
  |
  +-- Don't Enter: (0, 3)
```

**Analysis using backward induction**:
1. If Firm 1 enters, what will Firm 2 do? Fighting gives -1, accommodating gives 1 → Firm 2 will accommodate
2. Knowing this, what should Firm 1 do? Entering gives 2 (since Firm 2 will accommodate), not entering gives 0 → Firm 1 should enter

**Prediction**: Firm 1 enters, Firm 2 accommodates.

## Common Solution Concepts

**Dominant strategy equilibrium**: Everyone plays their dominant strategy.

**Nash equilibrium**: No player wants to unilaterally change strategy—everyone is playing a best response.

**Subgame perfect equilibrium**: In sequential games, strategies remain optimal at every decision point (ruling out non-credible threats).

## Real-World Applications

**Economics**: Market competition, auctions, bargaining
**Politics**: Voting systems, international relations, negotiations
**Biology**: Evolutionary strategies, animal behavior
**Computer Science**: Network routing, resource allocation, algorithm design
**Business**: Pricing strategies, product launch timing, partnerships
**Security**: Defense allocation, cybersecurity, deterrence

## Key Principles

**Rationality assumption**: Players choose strategies that maximize their payoffs given their beliefs about others.

**Common knowledge**: Players know the game structure, and they know that others know, and so on.

**Equilibrium thinking**: Focus on stable outcomes where no player wants to deviate.

**Strategic interdependence**: Your best choice depends on what others do.

## Common Pitfalls

**Assuming others are irrational**: Game theory assumes rationality. Real people sometimes aren't, but the framework still provides a baseline.

**Ignoring credibility**: In sequential games, threats must be credible (would you actually follow through?).

**Forgetting mixed strategies**: Sometimes pure strategies have no equilibrium—randomization is necessary.

**Overcomplicating**: Start simple. Not every interaction needs game theory.

## When to Use Game Theory

Game theory is valuable when:
- Multiple parties make interdependent decisions
- Strategic thinking matters (your choice affects others and vice versa)
- You can model the situation with clear players, strategies, and payoffs
- Understanding equilibria helps predict outcomes

Game theory is less useful when:
- Decisions are independent
- Outcomes are primarily random
- Players are clearly irrational or emotional
- The situation is too complex to model meaningfully

## See Also

- [[Prisoner's Dilemma]]
- [[Nash Equilibrium]]
- [[Zero-Sum Games]]
- [[Repeated Games]]
- [[Decision Making Under Uncertainty]]

## References

- "Theory of Games and Economic Behavior" (von Neumann & Morgenstern)
- "Game Theory: An Introduction" (Steven Tadelis)
- "Thinking Strategically" (Dixit & Nalebuff)
- "The Art of Strategy" (Dixit & Nalebuff)
- Nobel Prize lectures by Nash, Schelling, and Aumann
