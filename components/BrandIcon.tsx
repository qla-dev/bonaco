// Ikone za BonEvents i Bonexis kapsule (lucide).
import {
  BarChart3, Briefcase, CalendarDays, Camera, Clapperboard, ClipboardCheck, ClipboardList, Gauge, Lightbulb, Megaphone,
  Mic, PackageCheck, Palette, PartyPopper, PhoneCall, Rocket, Search, Store, Sun, Users, Wrench,
} from 'lucide-react';

const ICONS = {
  calendar: CalendarDays, clapper: Clapperboard, megaphone: Megaphone, users: Users, camera: Camera, palette: Palette,
  briefcase: Briefcase, rocket: Rocket, mic: Mic, sun: Sun, store: Store, party: PartyPopper,
  clipboard: ClipboardList, lightbulb: Lightbulb, wrench: Wrench, chart: BarChart3,
  // Bonexis kapsule 1–5
  k1: Search, k2: PhoneCall, k3: Gauge, k4: PackageCheck, k5: ClipboardCheck,
} as const;

export type IconName = keyof typeof ICONS;

export default function BrandIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
