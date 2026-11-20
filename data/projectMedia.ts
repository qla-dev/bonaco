import type { Project } from '../types';
import { PROJECT_PHOTOS, PROJECT_FILMS, type ProjectFilm } from './portfolio2026.ts';
import { GALLERIES } from './galleries.generated.ts';
export type ProjectExample = { kind: 'image'; src: string; position?: string } | { kind: 'video'; src: string; film: ProjectFilm; position?: string };
export const PRIVATE_PROJECT_MEDIA = new Set(['medicana']);
export const PHOTO_POSITIONS: Record<string, string> = {};
export function projectExamples(project: Project): ProjectExample[] {
  if (PRIVATE_PROJECT_MEDIA.has(project.slug)) return [];
  const film = PROJECT_FILMS[project.slug];
  // A cover or film poster appears once; a project need not fill three slots.
  const sources = [...new Set(PROJECT_PHOTOS[project.slug] ?? (project.gallery ? (GALLERIES[project.gallery] ?? []).map(item => item.src) : []))].filter(src => src !== project.cover && src !== film?.poster);
  const examples: ProjectExample[] = sources.slice(0, film ? 2 : 3).map(src => ({ kind: 'image', src, position: PHOTO_POSITIONS[src] }));
  if (film) examples.push({ kind: 'video', src: film.poster, film, position: film.posterPosition });
  return examples;
}
