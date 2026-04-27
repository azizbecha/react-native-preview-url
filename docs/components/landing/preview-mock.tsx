import {
  SiExpo,
  SiFigma,
  SiGithub,
  SiLinear,
  SiYcombinator,
  SiStripe,
  SiVercel,
  SiWikipedia,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface Props {
  title: string;
  description: string;
  domain: string;
  icon: IconComponent;
  /** Tailwind classes for the image stripe (background + text color). */
  gradient: string;
  rotate?: number;
  className?: string;
}

/**
 * A static, decorative replica of a LinkPreview card. Used in marquees and
 * background decoration so the page can show a "wall of previews" without
 * firing dozens of network requests on every visit.
 */
export function PreviewMock({
  title,
  description,
  domain,
  icon: Icon,
  gradient,
  rotate = 0,
  className = '',
}: Props) {
  return (
    <div
      className={`flex w-72 shrink-0 flex-col gap-2 rounded-2xl border border-fd-border bg-fd-card p-3 shadow-lg shadow-black/5 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl ${gradient}`}
      >
        <Icon
          color="currentColor"
          className="size-12 drop-shadow-sm"
          aria-hidden
        />
      </div>
      <div className="px-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">
          {title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-fd-muted-foreground">
          {description}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-fd-muted-foreground/70">
          {domain}
        </p>
      </div>
    </div>
  );
}

export const SHOWCASE_PREVIEWS: Array<Omit<Props, 'rotate' | 'className'>> = [
  {
    title: 'GitHub · Where the world builds software',
    description:
      'Millions of developers build, ship, and maintain their software on GitHub.',
    domain: 'github.com',
    icon: SiGithub,
    gradient: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white',
  },
  {
    title: 'Vercel: Build and deploy the best web experiences',
    description:
      'Vercel gives you the developer tools and cloud infrastructure to build, scale, and secure faster.',
    domain: 'vercel.com',
    icon: SiVercel,
    gradient: 'bg-gradient-to-br from-zinc-900 to-black text-white',
  },
  {
    title: 'Linear · The new standard for modern software development',
    description:
      'Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps.',
    domain: 'linear.app',
    icon: SiLinear,
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-700 text-white',
  },
  {
    title: 'Figma — The Collaborative Interface Design Tool',
    description:
      'Build better products as a team. Design, prototype, and gather feedback all in one place.',
    domain: 'figma.com',
    icon: SiFigma,
    gradient:
      'bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300 text-white',
  },
  {
    title: 'Stripe | Payment processing platform for the internet',
    description:
      'Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.',
    domain: 'stripe.com',
    icon: SiStripe,
    gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white',
  },
  {
    title: 'Expo: Make any app. Run it everywhere.',
    description:
      'Create universal native apps with React that run on Android, iOS, and the web.',
    domain: 'expo.dev',
    icon: SiExpo,
    gradient: 'bg-gradient-to-br from-teal-400 to-cyan-600 text-white',
  },
  {
    title: 'Wikipedia, the free encyclopedia',
    description:
      'Welcome to Wikipedia, the free encyclopedia that anyone can edit. 6,800,000+ articles.',
    domain: 'wikipedia.org',
    icon: SiWikipedia,
    gradient: 'bg-gradient-to-br from-stone-100 to-stone-300 text-stone-900',
  },
  {
    title: 'Hacker News',
    description:
      'Hacker News is a social news website focusing on computer science and entrepreneurship.',
    domain: 'news.ycombinator.com',
    icon: SiYcombinator,
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-700 text-white',
  },
  {
    title: 'YouTube — Broadcast yourself',
    description:
      'Enjoy the videos and music you love, upload original content, and share it all.',
    domain: 'youtube.com',
    icon: SiYoutube,
    gradient: 'bg-gradient-to-br from-red-500 to-red-700 text-white',
  },
];
