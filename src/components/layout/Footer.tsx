import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>English Reading Mastery — a structured English reading course.</p>
        <nav className="flex gap-5">
          <Link href="/course" className="hover:text-foreground">Course</Link>
          <Link href="/lessons" className="hover:text-foreground">Lessons</Link>
          <Link href="/skills" className="hover:text-foreground">Skills</Link>
        </nav>
      </div>
    </footer>
  );
}
