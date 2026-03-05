---
title: The Monty Hall Problem
chapter: game-shows
type: concept
difficulty: beginner
prerequisites:
  - "[[Probability Basics]]"
related:
  - "[[Decision Making Under Uncertainty]]"
  - "[[Conditional Probability]]"
  - "[[Game Theory]]"
tags:
  - probability
  - counterintuitive
  - decision-making
  - famous-problems
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# The Monty Hall Problem

## Overview

The Monty Hall Problem is one of the most famous counterintuitive probability puzzles. Named after the host of "Let's Make a Deal," it demonstrates how our intuitions about probability can lead us astray. The puzzle reveals that switching your choice improves your odds of winning—even though it feels like it shouldn't matter.

This problem has sparked fierce debates, stumped mathematicians, and generated thousands of letters when it appeared in Parade magazine in 1990. It's a perfect example of how probability can surprise us.

## The Problem

You're on a game show. The host, Monty Hall, shows you three doors. Behind one door is a car. Behind the other two are goats. You want the car.

**The game proceeds:**

1. You pick a door (say, Door 1)
2. Monty, who knows what's behind each door, opens a different door (say, Door 3) revealing a goat
3. Monty asks: "Do you want to switch to Door 2, or stick with Door 1?"

**The question**: Should you switch, stick, or does it not matter?

**The surprising answer**: You should always switch. Switching doubles your chances of winning.

## Why It Feels Wrong

Your intuition probably says: "There are two doors left. The car is behind one of them. So it's 50/50—switching doesn't matter."

This intuition is incorrect, and understanding why reveals something profound about probability.

## How It Actually Works

When you first pick a door, you have a 1/3 chance of being right and a 2/3 chance of being wrong.

**Crucially, Monty's action gives you new information**, but not in the way you might think.

### Case 1: You initially picked the car (probability 1/3)

- Monty opens either remaining door (both have goats)
- If you switch, you lose

### Case 2: You initially picked Goat A (probability 1/3)

- Monty must open the door with Goat B (the only other goat door)
- If you switch, you get the car

### Case 3: You initially picked Goat B (probability 1/3)

- Monty must open the door with Goat A (the only other goat door)
- If you switch, you get the car

**Result**: Switching wins in 2 out of 3 cases (Cases 2 and 3). Staying wins only in Case 1.

## Detailed Example

Let's walk through all possibilities when the car is behind Door 1:

**Scenario A: You pick Door 1 (the car)**
- Monty can open Door 2 or Door 3 (both have goats)
- If you switch, you get a goat
- If you stay, you get the car ✓

**Scenario B: You pick Door 2 (goat)**
- Monty must open Door 3 (the other goat)
- If you switch to Door 1, you get the car ✓
- If you stay, you get the goat

**Scenario C: You pick Door 3 (goat)**
- Monty must open Door 2 (the other goat)
- If you switch to Door 1, you get the car ✓
- If you stay, you get the goat

**Switching wins**: 2 out of 3 scenarios (66.7%)
**Staying wins**: 1 out of 3 scenarios (33.3%)

## Why This Happens

The key insight: **Monty's knowledge changes everything**.

When you first pick a door, you're probably wrong (2/3 chance). Monty then eliminates one of the wrong doors for you—but he can only eliminate doors you didn't choose.

By switching, you're essentially betting that your first choice was wrong, which it usually is (2/3 of the time).

**Another way to think about it**: When you switch, you're getting both remaining doors, not just one. Monty has eliminated the goat from those two doors, so you get whatever was good about that pair—which is usually the car.

## Simulation

Here's a simple Python simulation to verify:

```python
import random

def monty_hall_game(switch_strategy):
    # Randomly place car behind one of three doors
    car_door = random.randint(0, 2)

    # Player picks a random door
    player_choice = random.randint(0, 2)

    # Monty opens a door that isn't the car and isn't the player's choice
    doors = [0, 1, 2]
    doors.remove(player_choice)
    if car_door in doors:
        doors.remove(car_door)
    monty_opens = random.choice(doors)

    # Player decides to switch or stay
    if switch_strategy:
        remaining_doors = [0, 1, 2]
        remaining_doors.remove(player_choice)
        remaining_doors.remove(monty_opens)
        player_choice = remaining_doors[0]

    # Did the player win?
    return player_choice == car_door

# Run simulation
switch_wins = sum(monty_hall_game(True) for _ in range(10000))
stay_wins = sum(monty_hall_game(False) for _ in range(10000))

print(f"Switching wins: {switch_wins/10000:.1%}")  # ~66.7%
print(f"Staying wins: {stay_wins/10000:.1%}")      # ~33.3%
```

**Expected output:**
```
Switching wins: 66.7%
Staying wins: 33.3%
```

## Common Misconceptions

**"But there are two doors left, so it's 50/50"**: The probabilities don't reset when Monty opens a door. Your initial 1/3 vs. 2/3 split remains, but now the 2/3 probability is concentrated on the one remaining door you didn't pick.

**"Monty's choice doesn't matter"**: Monty's knowledge is crucial. If Monty opened a random door (and sometimes revealed the car), then switching wouldn't help. But Monty always reveals a goat, which transfers information.

**"I tried it once and switching lost"**: Probability tells you what happens on average. Individual trials can vary. Run 100 games and you'll see the pattern.

## Variations

**100 doors**: Imagine 100 doors, you pick one, and Monty opens 98 doors with goats. Should you switch to the remaining door? Absolutely—your first pick had a 1/100 chance, so the remaining door has 99/100.

**Multiple contestants**: If two players pick different doors before Monty opens doors, the analysis changes.

**No information version**: If Monty opens a random door (and just happens to reveal a goat), then switching doesn't help—it truly is 50/50.

## Real-World Applications

The Monty Hall Problem illustrates principles that appear in:
- **Medical testing**: How prior probability affects test result interpretation
- **Information theory**: How additional information changes probability distributions
- **Strategic thinking**: Why context matters in decision-making
- **Bayesian reasoning**: Updating beliefs based on new evidence

## Key Takeaways

- **Prior probability persists**: Your initial 1/3 vs. 2/3 split doesn't disappear
- **Information matters**: Monty's constrained choice provides information
- **Counterintuitive doesn't mean wrong**: Math can contradict intuition and be correct
- **Simulation convinces**: When intuition fails, empirical testing helps

## See Also

- [[Conditional Probability]]
- [[Bayesian Reasoning]]
- [[Decision Making Under Uncertainty]]
- [[Game Theory Fundamentals]]

## References

- vos Savant, Marilyn. "Ask Marilyn" column, Parade Magazine (1990)
- Selvin, Steve. "A problem in probability" (letter), American Statistician (1975)
- "The Monty Hall Problem: The Remarkable Story of Math's Most Contentious Brain Teaser" (Jason Rosenhouse)
- [Monty Hall Problem - Wikipedia](https://en.wikipedia.org/wiki/Monty_Hall_problem)
