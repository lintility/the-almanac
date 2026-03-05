import Link from 'next/link'
import { getAllChapters } from '@/lib/content'

export default function Home() {
  const chapters = getAllChapters()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Lintile's Almanac
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A comprehensive educational reference work covering fundamental and advanced concepts
        </p>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 italic">
          Core Mission: Make readers feel smarter and more capable, not intimidated.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/chapter/${chapter.slug}`}
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {chapter.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{chapter.description}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              {chapter.articleCount} {chapter.articleCount === 1 ? 'article' : 'articles'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
