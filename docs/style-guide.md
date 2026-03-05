# Almanac Style Guide

**Version:** 1.0
**Last Updated:** 2026-03-05

This is the editorial constitution for Lintile's Almanac. When style guide rules conflict with your instincts, the style guide wins. When the style guide is silent, use your judgment and propose an amendment.

---

## Core Mission

**Make readers feel smarter and more capable, not intimidated.**

Every article should leave readers thinking "I understand this now" rather than "This is too complex for me." We build confidence through clarity, not through simplification that patronizes.

---

## Front Matter Standards

All articles must begin with YAML front matter containing these required fields:

```yaml
---
title: Article Title
chapter: domain-name
type: content-type
difficulty: beginner|intermediate|advanced
prerequisites:
  - "[[Related Topic]]"
  - "[[Another Topic]]"
related:
  - "[[Related Article 1]]"
  - "[[Related Article 2]]"
tags:
  - tag1
  - tag2
  - tag3
status: draft|in-review|published
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
author: Author Name
---
```

### Field Definitions

**Required Fields:**

- **title**: The article title, in Title Case
- **chapter**: Domain category (computer-science, mathematics, engineering, creativity, game-shows, security, cryptography)
- **type**: Content classification (algorithm, concept, technique, protocol, pattern, theory, etc.)
- **difficulty**: Reader skill level required (beginner, intermediate, advanced)
- **status**: Publication state (draft, in-review, published)
- **created**: ISO date when article was first created
- **updated**: ISO date of last substantial edit
- **author**: Primary author or "Almanac Bot" for generated content

**Recommended Fields:**

- **prerequisites**: Topics readers should understand first (use WikiLink format: `[[Topic Name]]`)
- **related**: Connected topics worth exploring (use WikiLink format)
- **tags**: 3-6 searchable keywords, lowercase with hyphens

---

## Article Structure

Articles should follow this flow pattern (sections may be omitted if not applicable):

### 1. Title (H1)

The article's main title, matching the front matter `title` field exactly.

### 2. Overview

A 1-2 paragraph high-level introduction that answers "What is this and why does it matter?"

**Guidelines:**
- Use an everyday analogy when possible (dictionary search, checking ID, etc.)
- Avoid jargon or define it immediately
- Set expectations for what the article covers
- Make it inviting, not intimidating

**Example:**
> Authentication is the process of verifying that someone (or something) is who they claim to be. It's the digital equivalent of showing ID—proving your identity before being granted access to a system, application, or resource.

### 3. Core Concept

The fundamental principle or idea in clear, plain language.

**Guidelines:**
- Answer the "how does this actually work?" question
- Use concrete metaphors when helpful
- Build from familiar concepts
- Keep it to 2-4 paragraphs

### 4. How It Works / Detailed Explanation

Step-by-step breakdown or deeper dive into the concept.

**Guidelines:**
- Use numbered lists for sequential processes
- Use bullet points for non-sequential information
- Break complex ideas into digestible chunks
- Progressive disclosure: simple first, nuance later

### 5. Example

A concrete, walkable example that demonstrates the concept.

**Guidelines:**
- Use realistic scenarios, not toy examples
- Show the step-by-step process
- Include visual representations where helpful (ASCII art, diagrams)
- Make it easy to follow along mentally

### 6. Implementation

Working code examples in relevant languages.

**Guidelines:**
- Prioritize clarity over cleverness
- Include inline comments for non-obvious logic
- Show best practices, not just "code that works"
- Use realistic variable names
- Demonstrate security considerations when applicable
- Provide multiple language examples when topic is language-agnostic

**Code Comment Style:**
```python
# Clear, explanatory comments above complex logic
result = compute_something()

if condition:
    return value  # Inline comment for non-obvious behavior
```

### 7. Complexity Analysis (for algorithms)

Time and space complexity using Big O notation.

**Format:**
```
**Time Complexity**: O(log n)
- Brief explanation of why
- Concrete example (e.g., "For 1000 items, needs at most 10 comparisons")

**Space Complexity**: O(1)
- Brief explanation
```

### 8. Key Properties / Characteristics

Important facts, guarantees, or characteristics.

**Guidelines:**
- Use bullet points for scannability
- Highlight surprising or counterintuitive properties
- Keep each point to 1-2 sentences

### 9. Common Pitfalls

Things that frequently go wrong or are misunderstood.

**Guidelines:**
- Be specific about the mistake
- Explain why it's a problem
- Provide the correct approach when possible
- Use real-world examples of these pitfalls

### 10. When to Use / When Not to Use

Practical guidance on applicability.

**Format:**
```
Use [topic] when:
- Scenario 1
- Scenario 2

Don't use [topic] when:
- Anti-scenario 1
- Anti-scenario 2
```

### 11. Variations / Methods / Protocols (topic-specific)

Different flavors, approaches, or related implementations.

### 12. Security Considerations (for security topics)

Security-specific guidance, threats, mitigations.

**Guidelines:**
- Separate "Do" and "Don't" lists for clarity
- Link to OWASP, NIST, or other authoritative sources
- Provide concrete attack examples
- Show defensive code, not just theory

### 13. See Also

WikiLinks to related topics.

**Format:**
```markdown
## See Also

- [[Directly Related Topic]]
- [[Prerequisite Topic]]
- [[Advanced Topic]]
- [[Related Concept]]
```

### 14. References

Citations to authoritative sources.

**Guidelines:**
- Prefer primary sources (RFCs, academic papers, official documentation)
- Include OWASP, NIST, and other standards where relevant
- Use consistent citation format:
  - `[Title](URL)` for web resources
  - Full citation for books: "Title (Author), Chapter X"
  - RFC format: `RFC XXXX: Title`

**Example:**
```markdown
## References

- [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- Introduction to Algorithms (CLRS), Chapter 2.3
- RFC 7617: The 'Basic' HTTP Authentication Scheme
```

---

## Voice and Tone

### Writing Principles

**Clear and Direct**
- Use active voice
- Prefer simple words over complex ones (unless the complex word is more precise)
- Short sentences for complex ideas, longer sentences for simple ideas
- Second person ("you") to make content feel applicable

**Confident but Humble**
- Assert facts clearly
- Acknowledge complexity where it exists
- Say "we don't know" when appropriate
- Avoid absolute statements unless truly absolute

**Empowering, Not Condescending**
- Assume intelligence, not knowledge
- Explain without talking down
- "Here's how this works" not "This is very simple"
- Avoid phrases like "just," "simply," "obviously," "clearly" (they're often neither simple nor clear to learners)

**Practical and Grounded**
- Connect concepts to real-world applications
- Show why something matters, not just what it is
- Provide actionable takeaways
- Include "when to use" guidance

### Analogy Guidelines

Good analogies make abstract concepts concrete. Use them liberally, but follow these rules:

**Do:**
- Use everyday experiences (checking ID, searching a dictionary, guessing games)
- Match the structure of the analogy to the concept
- Acknowledge where the analogy breaks down if relevant

**Don't:**
- Mix metaphors within a single explanation
- Use analogies that require specialized knowledge
- Over-extend an analogy past its useful range

---

## Code Examples

### Language Selection

- **Algorithms:** Python (readable, pseudocode-like) or JavaScript
- **Security:** Multiple languages (Python, JavaScript/Node.js, sometimes Go or Rust)
- **Systems concepts:** Show the most relevant language for the context
- **When language-agnostic:** Provide 2-3 examples in popular languages

### Code Quality Standards

All code examples must:
- **Compile/run correctly** (if language-specific)
- **Follow language conventions** (PEP 8 for Python, etc.)
- **Demonstrate best practices** (security, performance, readability)
- **Include error handling** where it would be expected in production
- **Use meaningful variable names** (not `x`, `y`, `temp` unless contextually obvious)
- **Be properly formatted** (consistent indentation, spacing)

### Code Comments

**Do comment:**
- Non-obvious logic
- Security-critical sections
- Complexity trade-offs
- Edge case handling

**Don't comment:**
- Obvious code (`i = 0  # set i to zero`)
- What the code does (the code says that)—comment *why*

### Code Example Structure

```markdown
### [Description of What Code Demonstrates]

```language
# High-level explanation of approach

def function_name(parameters):
    # Comment explaining non-obvious logic
    result = do_something()

    # Another comment for complex section
    if edge_case:
        handle_it()

    return result
```

**Key points:**
- Bullet point 1 explaining important detail
- Bullet point 2 highlighting security consideration
- Bullet point 3 noting performance characteristic
```

---

## Progressive Disclosure

Present information in layers of increasing complexity:

1. **Overview layer**: High-level concept in plain language
2. **Working understanding layer**: Enough detail to use it effectively
3. **Deep understanding layer**: Nuance, edge cases, advanced considerations
4. **Expert layer**: Variations, optimizations, research directions

**Example structure:**
- Overview: "Binary search finds items in sorted lists by repeatedly halving the search space."
- Working: Step-by-step process with example
- Deep: Complexity analysis, implementation details, pitfalls
- Expert: Variations (lower bound, upper bound, search-on-answer)

Not every article needs all layers, but simpler layers should always come before complex ones.

---

## WikiLinks and Cross-References

Use WikiLink syntax for internal references: `[[Topic Name]]`

**When to link:**
- Prerequisites mentioned in Overview or Core Concept
- Related concepts in See Also section
- Technical terms that have their own articles
- Alternative approaches or variations

**When NOT to link:**
- Every mention of a common term (link once per section)
- External resources (use standard markdown links)
- Topics without articles yet (list in See Also but don't format as WikiLink)

**Format:**
```markdown
Binary search works on [[Sorted Arrays]] and uses [[Divide and Conquer]].

## See Also

- [[Linear Search]]
- [[Binary Search Tree]]
- [[Big O Notation]]
```

---

## Quality Checklist

Before marking an article as "in-review" or "published," verify:

### Content Completeness
- [ ] All required front matter fields present
- [ ] Overview provides clear 1-2 paragraph introduction
- [ ] Core concept clearly explained
- [ ] At least one concrete example provided
- [ ] Code examples (if applicable) are tested and correct
- [ ] Common pitfalls addressed
- [ ] "When to use" guidance included
- [ ] See Also section has 3+ relevant links
- [ ] References cite authoritative sources

### Voice and Clarity
- [ ] No condescending language ("simply," "just," "obviously")
- [ ] Active voice used consistently
- [ ] Analogies are clear and accurate
- [ ] Technical jargon defined on first use
- [ ] Reading level appropriate for stated difficulty

### Code Quality (if applicable)
- [ ] Code compiles/runs correctly
- [ ] Follows language conventions
- [ ] Demonstrates best practices
- [ ] Security considerations shown (if relevant)
- [ ] Comments explain "why," not "what"

### Formatting
- [ ] Front matter YAML is valid
- [ ] Headings follow logical hierarchy (H1 → H2 → H3)
- [ ] Code blocks have language specified
- [ ] WikiLinks use correct syntax
- [ ] Lists are properly formatted
- [ ] No trailing whitespace

### Accuracy
- [ ] Technical claims verified against references
- [ ] Complexity analysis correct
- [ ] No unsupported absolute statements
- [ ] Examples match the explanation
- [ ] External links valid and current

---

## Review Process

### Self-Review

Before requesting review:
1. Run through the quality checklist
2. Read the article aloud (catches awkward phrasing)
3. Verify all code examples execute correctly
4. Check all external links
5. Ensure prerequisites are met (or create placeholder articles)

### Peer Review Focus

Reviewers should prioritize:
- **Clarity**: Can a beginner understand this?
- **Accuracy**: Are the technical claims correct?
- **Completeness**: Are common questions answered?
- **Voice**: Does it empower or intimidate?

### Revision Expectations

Articles typically go through 1-3 revision rounds:
- **Draft → In-Review**: Self-review complete, ready for feedback
- **In-Review → Revision**: Reviewer feedback received, changes needed
- **Revision → Published**: Reviewer approves

---

## Content Maintenance

### When to Update

Update articles when:
- Technical details become outdated (new standards, deprecated methods)
- Better examples or analogies are discovered
- Common pitfalls section needs expansion based on reader questions
- Related articles are published that should be cross-referenced
- Errors or inaccuracies are identified

### Update Process

1. Change `status` to `in-review`
2. Update `updated` date in front matter
3. Make revisions
4. Document changes in commit message
5. Self-review against quality checklist
6. Request review if changes are substantial

### Deprecation

If an article becomes obsolete:
- Do NOT delete it
- Add deprecation notice at top: `> **Deprecated:** This article covers [old tech]. See [[New Article]] for current approach.`
- Update `status` to `archived`
- Link to replacement content

---

## Domain-Specific Conventions

### Computer Science

- Show complexity analysis for algorithms
- Include both iterative and recursive implementations when both are common
- Visualize with ASCII diagrams for data structures
- Compare to alternative approaches

### Security

- Always show secure implementations, never vulnerable code as "bad examples"
- Reference OWASP, NIST, and other standards
- Include "Security Considerations" section
- Explain attack vectors and mitigations
- Use real-world breach examples sparingly and respectfully

### Mathematics

- Build from intuition before formalization
- Show worked examples with every step
- Use LaTeX for complex equations (if rendering supported)
- Connect pure math to applied applications

### Engineering

- Emphasize trade-offs (no free lunches)
- Show real-world constraints
- Include failure modes
- Connect theory to practice

---

## Amendment Process

This style guide evolves. To propose changes:

1. Identify the gap or conflict
2. Draft proposed amendment
3. Create issue or discussion with rationale
4. CEO or Content Editor approves
5. Update style guide
6. Announce to team

---

**Questions?** When the style guide is silent, use your best judgment. Document your choice in the article or propose a style guide amendment for future consistency.
