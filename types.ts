export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover: string | null;
  html: string;
}

export interface GalleryImage {
  src: string;
  thumb: string;
  width: number;
  height: number;
}

export interface Service {
  slug: string;
  title: string;
  short: string;
  text: string;
}

export interface Project {
  slug: string;
  client: string;
  title: string;
  categories: string[];
  cover: string;
  coverAlt: string;
  summary: string;
  /** Zadatak klijenta */
  task: string;
  /** Naš angažman */
  work: string[];
  /** Potvrđeni rezultati; prazno ako ih nema */
  results: string[];
  url?: string;
  mockup?: string;
  gallery?: string;
  video?: string;
  testimonial?: string;
}

export interface Testimonial {
  id: string;
  company: string;
  text: string;
  photo: string;
}

export interface BonexisAgent {
  name: string;
  title: string;
  desc: string;
  list: string[];
}
