import { Bot, CalendarDays, Camera, MonitorSmartphone, PenTool, Search, Share2 } from 'lucide-react';

const ICONS = {
  'drustvene-mreze': Share2,
  seo: Search,
  'web-dizajn': MonitorSmartphone,
  'graficki-dizajn': PenTool,
  'event-management': CalendarDays,
  'foto-video': Camera,
  bonexis: Bot,
} as const;

export default function ServiceIcon({ slug, size = 24 }: { slug: string; size?: number }) {
  const Icon = ICONS[slug as keyof typeof ICONS] ?? Share2;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
