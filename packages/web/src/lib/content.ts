import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), '../../packages')

export interface ArticleMetadata {
  title: string
  chapter: string
  type?: string
  difficulty?: string
  prerequisites?: string[]
  related?: string[]
  tags?: string[]
  status?: string
  created?: string
  updated?: string
  author?: string
  slug: string
}

export interface Article extends ArticleMetadata {
  content: string
}

export interface Chapter {
  slug: string
  title: string
  description: string
  articleCount: number
  articles: ArticleMetadata[]
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
}

function getChapterContentDir(chapterSlug: string): string {
  return path.join(CONTENT_ROOT, chapterSlug, 'content')
}

export function getAllChapters(): Chapter[] {
  const chapters: Chapter[] = []

  for (const [slug, info] of Object.entries(CHAPTER_INFO)) {
    const contentDir = getChapterContentDir(slug)

    if (!fs.existsSync(contentDir)) {
      chapters.push({
        slug,
        title: info.title,
        description: info.description,
        articleCount: 0,
        articles: [],
      })
      continue
    }

    const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md') && file !== 'README.md')

    const articles: ArticleMetadata[] = files.map((file) => {
      const filePath = path.join(contentDir, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        title: data.title || file.replace('.md', ''),
        chapter: slug,
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
      }
    })

    chapters.push({
      slug,
      title: info.title,
      description: info.description,
      articleCount: files.length,
      articles,
    })
  }

  return chapters
}

export function getChapterBySlug(slug: string): Chapter | null {
  const info = CHAPTER_INFO[slug]
  if (!info) return null

  const contentDir = getChapterContentDir(slug)

  if (!fs.existsSync(contentDir)) {
    return {
      slug,
      title: info.title,
      description: info.description,
      articleCount: 0,
      articles: [],
    }
  }

  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md') && file !== 'README.md')

  const articles: ArticleMetadata[] = files.map((file) => {
    const filePath = path.join(contentDir, file)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return {
      title: data.title || file.replace('.md', ''),
      chapter: slug,
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
    }
  })

  return {
    slug,
    title: info.title,
    description: info.description,
    articleCount: files.length,
    articles,
  }
}

export function getArticleBySlug(chapterSlug: string, articleSlug: string): Article | null {
  const contentDir = getChapterContentDir(chapterSlug)
  const filePath = path.join(contentDir, `${articleSlug}.md`)

  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

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
  }
}

export function getAllArticles(): Article[] {
  const chapters = getAllChapters()
  const articles: Article[] = []

  for (const chapter of chapters) {
    for (const articleMeta of chapter.articles) {
      const article = getArticleBySlug(chapter.slug, articleMeta.slug)
      if (article) {
        articles.push(article)
      }
    }
  }

  return articles
}
