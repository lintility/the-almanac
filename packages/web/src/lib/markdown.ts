import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

function remarkWikilinks() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return

      const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
      const text = node.value
      const matches: RegExpMatchArray[] = Array.from(text.matchAll(wikiLinkRegex))

      if (matches.length === 0) return

      const newNodes: any[] = []
      let lastIndex = 0

      for (const match of matches) {
        const fullMatch = match[0]
        const linkText = match[1]
        const matchIndex = match.index!

        if (matchIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, matchIndex),
          })
        }

        const slug = linkText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        newNodes.push({
          type: 'link',
          url: `/search?q=${encodeURIComponent(linkText)}`,
          title: linkText,
          children: [{ type: 'text', value: linkText }],
        })

        lastIndex = matchIndex + fullMatch.length
      }

      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        })
      }

      parent.children.splice(index, 1, ...newNodes)
    })
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinks)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
    })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
