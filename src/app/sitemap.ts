import type { MetadataRoute } from 'next';
import { getPublishedLessons } from '@/lib/content/lessons';
import { levels } from '@content/curriculum/levels';
import { modules } from '@content/curriculum/modules';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/course', '/levels', '/modules', '/lessons', '/vocabulary', '/skills', '/progress'].map(
    (route) => ({ url: `${SITE_URL}${route}`, lastModified: new Date() })
  );

  const levelRoutes = levels.map((l) => ({ url: `${SITE_URL}/levels/${l.slug}`, lastModified: new Date() }));
  const moduleRoutes = modules.map((m) => ({ url: `${SITE_URL}/modules/${m.slug}`, lastModified: new Date() }));
  const lessonRoutes = getPublishedLessons().map((l) => ({
    url: `${SITE_URL}/lessons/${l.frontmatter.number}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...levelRoutes, ...moduleRoutes, ...lessonRoutes];
}
