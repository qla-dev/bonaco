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

export interface ScenarioMessage { from: "client" | "agent"; text: string }
export interface ScenarioRow { label: string; value: string; tone: "ok" | "warn" | "bad" | "info" }

export interface BonexisAgent {
  /** Ime agenta (Vida, Selma, Lejla, Kenan, Dino, Sara) */
  persona: string;
  /** Broj kapsule (1–5); Sara je dio kapsule 2 */
  capsule: number;
  /** owner = admin kapsule; assistant = pomoćni agent unutar kapsule */
  role: 'owner' | 'assistant';
  name: string;
  title: string;
  desc: string;
  list: string[];
  /** Kratka "misao" agenta za mozak u heroju */
  thought: string;
  scenario: {
    title: string;
    desc: string;
    clientLabel: string;
    messages: ScenarioMessage[];
    result: { title: string; rows: ScenarioRow[]; status: string };
  };
}
