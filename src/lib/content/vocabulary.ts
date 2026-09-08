import { getPublishedLessons } from './lessons';

export interface VocabularyEntry {
  word: string;
  partOfSpeech?: string;
  meaning: string;
  example?: string;
  lessonNumbers: number[];
}

const TAG_RE = /<Vocabulary\s+([^>]*?)\/>/g;
const ATTR_RE = /(\w+)="([^"]*)"/g;

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let match: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((match = ATTR_RE.exec(raw))) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

/**
 * Aggregates every <Vocabulary /> block across all published lessons.
 * Single source of truth: authors only write the tag once in the lesson
 * body — this index is derived, not hand-maintained. Only matches
 * self-closing tags with plain string attributes (the pattern documented
 * in CONTENT_GUIDE.md); JSX-expression attribute values are skipped.
 */
export function getAllVocabulary(): VocabularyEntry[] {
  const byWord = new Map<string, VocabularyEntry>();

  for (const lesson of getPublishedLessons()) {
    TAG_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = TAG_RE.exec(lesson.content))) {
      const attrs = parseAttrs(match[1]);
      if (!attrs.word || !attrs.meaning) continue;
      const key = attrs.word.toLowerCase();
      const existing = byWord.get(key);
      if (existing) {
        if (!existing.lessonNumbers.includes(lesson.frontmatter.number)) {
          existing.lessonNumbers.push(lesson.frontmatter.number);
        }
      } else {
        byWord.set(key, {
          word: attrs.word,
          partOfSpeech: attrs.partOfSpeech,
          meaning: attrs.meaning,
          example: attrs.example,
          lessonNumbers: [lesson.frontmatter.number],
        });
      }
    }
  }

  return Array.from(byWord.values()).sort((a, b) => a.word.localeCompare(b.word));
}
