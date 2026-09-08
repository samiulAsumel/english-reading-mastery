import GithubSlugger from 'github-slugger';

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  slug: string;
}

/**
 * Extracts ## and ### headings from raw MDX source for the sticky lesson
 * TOC. Uses the same slug algorithm as `rehype-slug` (which stamps the
 * actual heading `id`s at render time) so TOC links land correctly.
 */
export function extractToc(mdxSource: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const lines = mdxSource.split('\n');
  const entries: TocEntry[] = [];
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);
    const match = h2 ?? h3;
    if (!match) continue;
    const text = match[1].trim();
    entries.push({ depth: h2 ? 2 : 3, text, slug: slugger.slug(text) });
  }
  return entries;
}
