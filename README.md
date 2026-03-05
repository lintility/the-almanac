# Lintile's Almanac

A comprehensive educational reference work covering fundamental and advanced concepts across multiple domains of knowledge.

## Philosophy

The Almanac is designed to be a living knowledge base that captures deep understanding across computer science, mathematics, engineering, creativity, and game shows. Each entry aims to provide clear explanations, practical examples, and connections between related concepts.

**Core Mission:** Make readers feel smarter and more capable, not intimidated.

## Structure

The Almanac is organized into thematic chapters:

- **`computer-science/`** - Algorithms, data structures, programming paradigms, computational theory
- **`mathematics/`** - Pure and applied mathematics, foundational to advanced topics
- **`engineering/`** - Engineering principles, design patterns, practical implementations
- **`creativity/`** - Creative processes, techniques, theoretical frameworks
- **`game-shows/`** - Game theory, strategy, decision-making in competitive formats
- **`security/`** - Security concepts, vulnerabilities, attack patterns
- **`cryptography/`** - Cryptographic primitives, protocols, implementations

## Development

This is a TypeScript monorepo managed with pnpm and Turbo.

### Prerequisites

- Node.js 18+
- pnpm 8+

### Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format
```

### Monorepo Structure

```
packages/
├── computer-science/
├── mathematics/
├── engineering/
├── creativity/
├── game-shows/
├── security/
└── cryptography/
```

Each package contains:
- `content/` - Markdown files with educational content
- `src/` - TypeScript source code for processing and exporting
- `package.json` - Package configuration

### Contributing

Content should be:
- Clear and accessible
- Well-structured with examples
- Cross-referenced with related topics
- Technically accurate

## License

MIT
