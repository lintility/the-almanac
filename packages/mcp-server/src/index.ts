#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import chokidar from 'chokidar';
import path from 'path';
import {
  getAllChapters,
  getArticlesByChapter,
  getArticle,
  searchArticles,
} from './content.js';

// MCP Server for Lintile's Almanac
const server = new Server(
  {
    name: 'almanac-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Content cache
let contentCache = {
  lastUpdate: Date.now(),
};

// Watch for content changes
const CONTENT_ROOT = path.join(process.cwd(), '../..');
const watcher = chokidar.watch(`${CONTENT_ROOT}/*/content/**/*.md`, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

watcher.on('change', (filepath) => {
  console.error(`Content changed: ${filepath}`);
  contentCache.lastUpdate = Date.now();
  // Notify clients about resource changes
  server.notification({
    method: 'notifications/resources/updated',
    params: {},
  });
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const chapters = getAllChapters();
  const resources = [];

  // Add chapter overview resource
  resources.push({
    uri: 'almanac://chapters',
    mimeType: 'application/json',
    name: 'All Chapters',
    description: 'Overview of all almanac chapters',
  });

  // Add resources for each chapter
  for (const chapter of chapters) {
    resources.push({
      uri: `almanac://chapter/${chapter.slug}`,
      mimeType: 'application/json',
      name: chapter.title,
      description: `Articles in ${chapter.title}: ${chapter.description}`,
    });

    // Add resources for each article
    const articles = getArticlesByChapter(chapter.slug);
    for (const article of articles) {
      resources.push({
        uri: `almanac://article/${chapter.slug}/${article.slug}`,
        mimeType: 'text/markdown',
        name: article.title,
        description: `${article.title} (${chapter.title}${article.difficulty ? `, ${article.difficulty}` : ''})`,
      });
    }
  }

  return { resources };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'almanac://chapters') {
    const chapters = getAllChapters();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(chapters, null, 2),
        },
      ],
    };
  }

  if (uri.startsWith('almanac://chapter/')) {
    const chapterSlug = uri.replace('almanac://chapter/', '');
    const articles = getArticlesByChapter(chapterSlug);
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(articles, null, 2),
        },
      ],
    };
  }

  if (uri.startsWith('almanac://article/')) {
    const parts = uri.replace('almanac://article/', '').split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid article URI format');
    }

    const [chapterSlug, articleSlug] = parts;
    const article = getArticle(chapterSlug, articleSlug);

    if (!article) {
      throw new Error(`Article not found: ${chapterSlug}/${articleSlug}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `---
title: ${article.title}
chapter: ${article.chapter}
${article.difficulty ? `difficulty: ${article.difficulty}` : ''}
${article.type ? `type: ${article.type}` : ''}
${article.tags ? `tags: ${article.tags.join(', ')}` : ''}
---

${article.content}`,
        },
      ],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_almanac',
        description: 'Search for articles in the almanac by keyword',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to find relevant articles',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_article',
        description: 'Get the full content of a specific article',
        inputSchema: {
          type: 'object',
          properties: {
            chapter: {
              type: 'string',
              description: 'Chapter slug (e.g., "computer-science")',
            },
            article: {
              type: 'string',
              description: 'Article slug (e.g., "binary-search")',
            },
          },
          required: ['chapter', 'article'],
        },
      },
      {
        name: 'list_chapters',
        description: 'List all available chapters in the almanac',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('Arguments are required');
  }

  if (name === 'search_almanac') {
    const query = args.query as string;
    if (!query) {
      throw new Error('Query parameter is required');
    }

    const results = searchArticles(query);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            results.map((article) => ({
              title: article.title,
              chapter: article.chapter,
              slug: article.slug,
              difficulty: article.difficulty,
              type: article.type,
              tags: article.tags,
              uri: `almanac://article/${article.chapter}/${article.slug}`,
            })),
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'get_article') {
    const chapter = args.chapter as string;
    const articleSlug = args.article as string;

    if (!chapter || !articleSlug) {
      throw new Error('Both chapter and article parameters are required');
    }

    const article = getArticle(chapter, articleSlug);
    if (!article) {
      throw new Error(`Article not found: ${chapter}/${articleSlug}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `# ${article.title}\n\n${article.content}`,
        },
      ],
    };
  }

  if (name === 'list_chapters') {
    const chapters = getAllChapters();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(chapters, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Almanac MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
