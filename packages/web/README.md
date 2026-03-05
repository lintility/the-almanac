# Almanac Web

A clean, reader-friendly web interface for browsing Lintile's Almanac.

## Features

- **Clean Reader-Like Aesthetics**: Distraction-free reading experience with typography optimized for long-form content
- **Theme Support**: Light and dark mode with system preference detection
- **Markdown Rendering**: Full support for GitHub-flavored markdown with syntax highlighting
- **Wikilink Support**: Internal cross-references using `[[Topic]]` syntax
- **Navigation**: Browse by chapter and easily navigate between related topics
- **Static Export**: Fully exportable as static HTML for hosting anywhere

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Architecture

- **Next.js 14** with App Router for optimal performance
- **Tailwind CSS** + **Typography plugin** for beautiful, accessible styling
- **Unified/Remark/Rehype** for markdown processing
- **Highlight.js** for syntax highlighting
- **Gray Matter** for frontmatter parsing

## Content Structure

The web app reads markdown files from sibling packages:

```
packages/
├── computer-science/content/
├── mathematics/content/
├── engineering/content/
└── ...
```

Each markdown file includes YAML frontmatter with metadata like title, difficulty, tags, and related topics.

## Customization

### Themes

Themes are implemented using Tailwind's dark mode with class strategy. The theme preference is stored in localStorage and respects system preferences by default.

### Styling

The typography is customized in `tailwind.config.js` with specific overrides for both light and dark modes to ensure optimal readability.
