# Contributing to Lintile's Almanac

Thank you for your interest in contributing to the Almanac! This document provides guidelines for contributing content and code.

## Content Guidelines

### Philosophy

- **Clarity over complexity**: Explanations should be clear and accessible
- **Examples matter**: Include practical examples for every concept
- **Connect ideas**: Cross-reference related topics
- **Accuracy first**: Technical correctness is paramount

### Structure

Each topic should include:

1. **Overview**: High-level explanation
2. **Core Concepts**: Fundamental building blocks
3. **Examples**: Practical demonstrations
4. **Related Topics**: Cross-references
5. **Further Reading**: External resources

### Writing Style

- Use active voice
- Define technical terms
- Include code examples where relevant
- Make readers feel empowered, not intimidated

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
pnpm install
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Formatting

```bash
pnpm format
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-content`)
3. Make your changes
4. Format your code (`pnpm format`)
5. Commit with descriptive messages
6. Push to your fork
7. Open a Pull Request

### PR Requirements

- Pass all CI checks
- Include clear descriptions
- Reference related issues
- Follow existing patterns

## Package Organization

Each almanac chapter is a separate package under `packages/`:

- `content/` - Markdown files with educational content
- `src/` - TypeScript code for processing
- `package.json` - Package configuration

## Questions?

Open an issue for questions, suggestions, or discussions.
