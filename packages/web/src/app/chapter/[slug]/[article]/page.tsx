import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticles, getChapterBySlug } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import 'highlight.js/styles/github-dark.css'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.chapter,
    article: article.slug,
  }))
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string; article: string }
}) {
  const article = getArticleBySlug(params.slug, params.article)

  if (!article) {
    notFound()
  }

  const chapter = getChapterBySlug(params.slug)
  const htmlContent = await markdownToHtml(article.content)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href={`/chapter/${params.slug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to {chapter?.title}
        </Link>
      </div>

      <article className="prose prose-lg dark:prose-dark max-w-none">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {article.difficulty && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full capitalize">
                {article.difficulty}
              </span>
            )}
            {article.type && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full capitalize">
                {article.type}
              </span>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="prose dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {(article.prerequisites || article.related) && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            {article.prerequisites && article.prerequisites.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Prerequisites
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {article.prerequisites.map((prereq, i) => (
                    <li key={i}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.related && article.related.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Related Topics
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {article.related.map((related, i) => (
                    <li key={i}>{related}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
