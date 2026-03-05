# Almanac MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to Lintile's Almanac content.

## Features

- **Resources**: Browse chapters and read articles through structured URIs
- **Tools**: Search articles, get specific content, and list chapters
- **Auto-reload**: Watches for content changes and notifies clients
- **Efficient**: Lightweight TypeScript implementation with minimal dependencies

## Installation

```bash
# Install dependencies
pnpm install

# Build the server
pnpm build
```

## Usage

### As a Standalone Server

```bash
# Start the server
pnpm start
```

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "almanac": {
      "command": "node",
      "args": ["/path/to/almanac/packages/mcp-server/dist/index.js"],
      "cwd": "/path/to/almanac/packages/mcp-server"
    }
  }
}
```

### With Claude Code

Add to your MCP settings (`.claude/mcp_settings.json`):

```json
{
  "mcpServers": {
    "almanac": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "cwd": "packages/mcp-server"
    }
  }
}
```

## Resources

The server exposes almanac content through structured URIs:

- `almanac://chapters` - List all chapters
- `almanac://chapter/{slug}` - Get articles in a chapter
- `almanac://article/{chapter}/{article}` - Read a specific article

## Tools

### search_almanac

Search for articles by keyword.

**Parameters:**
- `query` (string): Search query

**Example:**
```json
{
  "query": "binary search"
}
```

### get_article

Get the full content of a specific article.

**Parameters:**
- `chapter` (string): Chapter slug (e.g., "computer-science")
- `article` (string): Article slug (e.g., "binary-search")

**Example:**
```json
{
  "chapter": "computer-science",
  "article": "binary-search"
}
```

### list_chapters

List all available chapters.

**Example:**
```json
{}
```

## Content Reloading

The server automatically watches for changes to markdown files in the content directories. When a file changes:

1. The internal cache is invalidated
2. Clients are notified via `notifications/resources/updated`
3. Subsequent requests will reflect the updated content

This makes the server ideal for development workflows where content is actively being edited.

## Architecture

```
packages/mcp-server/
├── src/
│   ├── index.ts       # MCP server implementation
│   └── content.ts     # Content loading utilities
├── dist/              # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Watch mode for development
pnpm dev

# Clean build artifacts
pnpm clean
```

## Deployment

### Local Development

The server runs on stdio and is designed to be launched by MCP clients (like Claude Desktop).

### Production

For production deployments:

1. Build the server: `pnpm build`
2. Configure your MCP client with the absolute path to `dist/index.js`
3. Ensure the content files are accessible at the expected relative paths

### Docker (Optional)

You can also containerize the server for deployment:

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY packages/mcp-server/ ./mcp-server/
COPY packages/*/content/ ./

WORKDIR /app/mcp-server
RUN npm install -g pnpm && pnpm install && pnpm build

CMD ["node", "dist/index.js"]
```

## Troubleshooting

### Content not found

Ensure the server is run from the correct working directory. The content loader expects to find packages at `../../{chapter}/content/`.

### Changes not reflected

The file watcher may need a moment to detect changes. If issues persist, restart the server.

## License

MIT
