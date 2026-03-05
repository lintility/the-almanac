import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getChapterBySlug, getAllChapters } from '@/lib/content'

export async function generateStaticParams() {
  const chapters = getAllChapters()
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }))
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug)

  if (!chapter) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {chapter.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        {chapter.description}
      </p>

      {chapter.articleCount === 0 ? (
        <p className="text-gray-500 dark:text-gray-500">
          No articles available yet.
        </p>
      ) : (
        <div className="space-y-4">
          {chapter.articles.map((article) => (
            <Link
              key={article.slug}
              href={`/chapter/${chapter.slug}/${article.slug}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {article.title}
              </h2>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                {article.difficulty && (
                  <span className="capitalize">{article.difficulty}</span>
                )}
                {article.type && (
                  <span className="capitalize">{article.type}</span>
                )}
                {article.tags && article.tags.length > 0 && (
                  <span>{article.tags.slice(0, 3).join(', ')}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
