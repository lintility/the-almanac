import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), '../..');

export interface ArticleMetadata {
  title: string;
  chapter: string;
  type?: string;
  difficulty?: string;
  prerequisites?: string[];
  related?: string[];
  tags?: string[];
  status?: string;
  created?: string;
  updated?: string;
  author?: string;
  slug: string;
}

export interface Article extends ArticleMetadata {
  content: string;
}

export interface Chapter {
  slug: string;
  title: string;
  description: string;
  articleCount: number;
}

const CHAPTER_INFO: Record<string, { title: string; description: string }> = {
  'computer-science': {
    title: 'Computer Science',
    description: 'Algorithms, data structures, programming paradigms, computational theory',
  },
  mathematics: {
    title: 'Mathematics',
    description: 'Pure and applied mathematics, foundational to advanced topics',
  },
  engineering: {
    title: 'Engineering',
    description: 'Engineering principles, design patterns, practical implementations',
  },
  creativity: {
    title: 'Creativity',
    description: 'Creative processes, techniques, theoretical frameworks',
  },
  'game-shows': {
    title: 'Game Shows',
    description: 'Game theory, strategy, decision-making in competitive formats',
  },
  security: {
    title: 'Security',
    description: 'Security concepts, vulnerabilities, attack patterns',
  },
  cryptography: {
    title: 'Cryptography',
    description: 'Cryptographic primitives, protocols, implementations',
  },
};

function getChapterContentDir(chapterSlug: string): string {
  return path.join(CONTENT_ROOT, chapterSlug, 'content');
}

export function getAllChapters(): Chapter[] {
  const chapters: Chapter[] = [];

  for (const [slug, info] of Object.entries(CHAPTER_INFO)) {
    const contentDir = getChapterContentDir(slug);

    if (!fs.existsSync(contentDir)) {
      chapters.push({
        slug,
        title: info.title,
        description: info.description,
        articleCount: 0,
      });
      continue;
    }

    const files = fs.readdirSync(contentDir).filter(
      (file) => file.endsWith('.md') && file !== 'README.md'
    );

    chapters.push({
      slug,
      title: info.title,
      description: info.description,
      articleCount: files.length,
    });
  }

  return chapters;
}

export function getArticlesByChapter(chapterSlug: string): ArticleMetadata[] {
  const contentDir = getChapterContentDir(chapterSlug);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir).filter(
    (file) => file.endsWith('.md') && file !== 'README.md'
  );

  return files.map((file) => {
    const filePath = path.join(contentDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title || file.replace('.md', ''),
      chapter: chapterSlug,
      type: data.type,
      difficulty: data.difficulty,
      prerequisites: data.prerequisites,
      related: data.related,
      tags: data.tags,
      status: data.status,
      created: data.created,
      updated: data.updated,
      author: data.author,
      slug: file.replace('.md', ''),
    };
  });
}

export function getArticle(chapterSlug: string, articleSlug: string): Article | null {
  const contentDir = getChapterContentDir(chapterSlug);
  const filePath = path.join(contentDir, `${articleSlug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title || articleSlug,
    chapter: chapterSlug,
    type: data.type,
    difficulty: data.difficulty,
    prerequisites: data.prerequisites,
    related: data.related,
    tags: data.tags,
    status: data.status,
    created: data.created,
    updated: data.updated,
    author: data.author,
    slug: articleSlug,
    content,
  };
}

export function searchArticles(query: string): Article[] {
  const chapters = getAllChapters();
  const results: Article[] = [];
  const lowerQuery = query.toLowerCase();

  for (const chapter of chapters) {
    const articles = getArticlesByChapter(chapter.slug);

    for (const articleMeta of articles) {
      const article = getArticle(chapter.slug, articleMeta.slug);
      if (!article) continue;

      // Search in title, content, and tags
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);
      const contentMatch = article.content.toLowerCase().includes(lowerQuery);
      const tagsMatch = article.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));

      if (titleMatch || contentMatch || tagsMatch) {
        results.push(article);
      }
    }
  }

  return results;
}
