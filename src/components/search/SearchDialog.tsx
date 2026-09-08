'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import FlexSearch from 'flexsearch';
import { Button } from '@/components/ui/button';
import type { SearchRecord } from '@/app/api/search/route';

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open || loaded) return;
    fetch('/api/search')
      .then((res) => res.json())
      .then((data: { records: SearchRecord[] }) => {
        setRecords(data.records);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  const index = useMemo(() => {
    const idx = new FlexSearch.Document<SearchRecord>({
      document: {
        id: 'number',
        index: ['title', 'description', 'tags', 'skills'],
      },
      tokenize: 'forward',
    });
    records.forEach((r) => idx.add(r));
    return idx;
  }, [records]);

  const results = useMemo(() => {
    if (!query.trim()) return records.slice(0, 8);
    const hits = index.search(query, { limit: 20, enrich: true });
    const seen = new Set<number>();
    const out: SearchRecord[] = [];
    for (const field of hits) {
      for (const result of field.result) {
        const doc = (result as { doc?: SearchRecord }).doc;
        if (doc && !seen.has(doc.number)) {
          seen.add(doc.number);
          out.push(doc);
        }
      }
    }
    return out;
  }, [query, index, records]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery('');
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 text-muted-foreground sm:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        Search lessons
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[90vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <Dialog.Title className="sr-only">Search lessons</Dialog.Title>
            <Command shouldFilter={false} className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search lesson titles, concepts, vocabulary…"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                {!loaded && <div className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</div>}
                {loaded && results.length === 0 && (
                  <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No lessons yet, or none match &ldquo;{query}&rdquo;.
                  </Command.Empty>
                )}
                {results.map((r) => (
                  <Command.Item
                    key={r.number}
                    value={String(r.number)}
                    onSelect={() => go(r.href)}
                    className="flex cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2 text-sm data-[selected=true]:bg-muted"
                  >
                    <span className="font-medium text-foreground">
                      Lesson {r.number} · {r.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{r.description}</span>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
