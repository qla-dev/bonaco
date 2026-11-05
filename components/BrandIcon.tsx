// Ikone za BonEvents i Bonexis kapsule (lucide).
import {
  BarChart3, Briefcase, CalendarDays, Camera, Clapperboard, ClipboardCheck, ClipboardList, Gauge, Lightbulb, Megaphone,
  Mic, PackageCheck, Palette, PartyPopper, PenLine, PhoneCall, Rocket, Search, Share2, Store, Sun, Users, Wrench,
} from 'lucide-react';

const ICONS = {
  calendar: CalendarDays, clapper: Clapperboard, megaphone: Megaphone, users: Users, camera: Camera, palette: Palette,
  briefcase: Briefcase, rocket: Rocket, mic: Mic, sun: Sun, store: Store, party: PartyPopper,
  clipboard: ClipboardList, lightbulb: Lightbulb, wrench: Wrench, chart: BarChart3,
  // Bonexis kapsule 1–7
  k1: Share2, k2: Search, k3: PenLine, k4: PhoneCall, k5: Gauge, k6: PackageCheck, k7: ClipboardCheck,
} as const;

export type IconName = keyof typeof ICONS;

export default function BrandIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
