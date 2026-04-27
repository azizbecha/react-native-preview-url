import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { LinkPreviewDemo } from '@/components/link-preview-demo';
import { TiltCard } from '@/components/landing/tilt-card';
import { Marquee } from '@/components/landing/marquee';
import { FloatingCards } from '@/components/landing/floating-cards';
import {
  PreviewMock,
  SHOWCASE_PREVIEWS,
} from '@/components/landing/preview-mock';
import {
  ZapIcon,
  PuzzleIcon,
  DatabaseIcon,
  GlobeIcon,
  SparkleIcon,
} from '@/components/landing/feature-icons';

const THREE_LINES = `import { LinkPreview } from 'react-native-preview-url';

export const Card = () => (
  <LinkPreview url="https://github.com" />
);`;

const FEATURES = [
  {
    icon: ZapIcon,
    title: 'Drop-in component',
    body: 'A <LinkPreview /> with sensible defaults — rounded card, 16:9 image, accessible press behavior, tap-to-open via Linking.',
    accent: 'from-amber-400/30 to-orange-500/30',
  },
  {
    icon: PuzzleIcon,
    title: 'Or just the hook',
    body: 'useUrlPreview gives you { loading, data, error }. Render whatever shape your design system needs.',
    accent: 'from-violet-400/30 to-fuchsia-500/30',
  },
  {
    icon: DatabaseIcon,
    title: 'Smart cache',
    body: 'In-memory LRU with separate TTLs for success/error, automatic dedupe of concurrent requests, scoped by base URL.',
    accent: 'from-emerald-400/30 to-teal-500/30',
  },
  {
    icon: GlobeIcon,
    title: 'Free hosted API',
    body: 'No API key. Or self-host the open-source backend if you need control over uptime, latency, or extraction logic.',
    accent: 'from-sky-400/30 to-indigo-500/30',
  },
];

const STATS = [
  { value: '18', label: 'props' },
  { value: '0', label: 'native deps' },
  { value: '~17 kB', label: 'tarball' },
  { value: '90/90', label: 'tests' },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative border-b border-fd-border">
        {/* aurora layers */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-fd-primary/20 blur-3xl motion-safe:animate-aurora" />
          <div
            className="absolute -right-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-3xl motion-safe:animate-aurora"
            style={{ animationDelay: '-5s' }}
          />
          <div
            className="absolute left-1/2 top-3/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl motion-safe:animate-aurora"
            style={{ animationDelay: '-10s' }}
          />
        </div>

        {/* grid */}
        <div className="bg-grid pointer-events-none absolute inset-0 motion-safe:animate-grid-fade" />

        <FloatingCards />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-7 px-6 py-24 text-center md:py-32">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/70 px-4 py-1.5 text-xs font-medium text-fd-muted-foreground backdrop-blur"
            style={{ animation: 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fd-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-fd-primary" />
            </span>
            <span>Live · open-source · v0.4.2</span>
          </span>

          <h1
            className="text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
            style={{
              animation:
                'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.05s backwards',
            }}
          >
            <span className="text-gradient-animated block">Every URL</span>
            <span className="block">becomes a card.</span>
          </h1>

          <p
            className="max-w-2xl text-pretty text-base text-fd-muted-foreground md:text-lg"
            style={{
              animation:
                'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards',
            }}
          >
            Rich link previews for React Native, Expo, and React Native Web. One
            component, one hook, zero native code. Tap any URL — get metadata,
            image, favicon, tap-to-open, all out of the box.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-3"
            style={{
              animation:
                'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s backwards',
            }}
          >
            <Link
              href="/docs"
              className="group relative overflow-hidden rounded-full bg-fd-primary px-7 py-3 text-sm font-semibold text-fd-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              <span className="relative z-10">Read the docs →</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </Link>
            <Link
              href="/docs/installation"
              className="rounded-full border border-fd-border bg-fd-card/70 px-7 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-fd-muted"
            >
              Get started
            </Link>
            <a
              href="https://github.com/azizbecha/react-native-preview-url"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-fd-border bg-fd-card/70 px-7 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-fd-muted"
            >
              GitHub ↗
            </a>
          </div>

          <code
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-card/70 px-4 py-2 font-mono text-sm text-fd-muted-foreground backdrop-blur"
            style={{
              animation:
                'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s backwards',
            }}
          >
            <span className="select-none text-fd-primary">$</span>
            <span>npm install react-native-preview-url</span>
          </code>

          {/* stats */}
          <dl
            className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 md:grid-cols-4"
            style={{
              animation:
                'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s backwards',
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
                  {s.value}
                </dt>
                <dd className="text-xs uppercase tracking-wider text-fd-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════ LIVE DEMO ═══════════════ */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <span className="mx-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fd-primary">
            <SparkleIcon className="size-3" />
            Try it live
            <SparkleIcon className="size-3" />
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            The same component,
            <br />
            <span className="text-gradient-animated">
              running in your browser.
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-fd-muted-foreground">
            Bridged to the web via{' '}
            <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs">
              react-native-web
            </code>
            . Paste any URL and watch the real lib hit the real API.
          </p>
        </div>
        <LinkPreviewDemo />
      </section>

      {/* ═══════════════ MARQUEE SHOWCASE ═══════════════ */}
      <section className="border-y border-fd-border bg-fd-muted/30 py-16">
        <div className="mx-auto mb-10 max-w-3xl px-6 text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-4xl">
            A wall of unfurls.
          </h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Same component, every URL. Hover to pause.
          </p>
        </div>

        <Marquee speed={50} direction="left" className="mb-6">
          {SHOWCASE_PREVIEWS.map((p, i) => (
            <PreviewMock
              key={`l-${i}`}
              {...p}
              rotate={i % 2 ? 1.5 : -1.5}
              className="transition-transform duration-300 hover:scale-105"
            />
          ))}
        </Marquee>
        <Marquee speed={60} direction="right">
          {[...SHOWCASE_PREVIEWS].reverse().map((p, i) => (
            <PreviewMock
              key={`r-${i}`}
              {...p}
              rotate={i % 2 ? -1.5 : 1.5}
              className="transition-transform duration-300 hover:scale-105"
            />
          ))}
        </Marquee>
      </section>

      {/* ═══════════════ THREE LINES ═══════════════ */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Three lines.
            <br />
            <span className="text-gradient-animated">No native code.</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-fd-muted-foreground">
            The whole API for the happy path.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <DynamicCodeBlock lang="tsx" code={THREE_LINES} />
          </div>
          <div className="flex justify-center">
            <PreviewMock
              title="GitHub · Where the world builds software"
              description="Millions of developers build, ship, and maintain their software on GitHub — the world's largest developer platform."
              domain="github.com"
              emoji="🐙"
              gradient="bg-gradient-to-br from-slate-700 to-slate-900 text-white"
              rotate={2}
              className="motion-safe:animate-float-slow"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mb-12 flex flex-col gap-2 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Small surface,
              <br />
              <span className="text-gradient-animated">deep behavior.</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-fd-muted-foreground">
              Everything you'd want it to do. Nothing you wouldn't.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {FEATURES.map((f) => (
              <TiltCard
                key={f.title}
                className="rounded-3xl border border-fd-border bg-fd-card p-7 shadow-sm"
              >
                <div className="relative">
                  <div
                    aria-hidden
                    className={`mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-fd-foreground shadow-inner`}
                  >
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                    {f.body}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-24 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fd-primary/10 blur-3xl motion-safe:animate-aurora" />
          </div>
          <h2 className="relative text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Ship it.
          </h2>
          <p className="relative max-w-md text-sm text-fd-muted-foreground">
            The docs cover the component, the hook, the cache, the HTTP
            contract, and how to self-host the backend if you outgrow the free
            API.
          </p>
          <Link
            href="/docs"
            className="group relative overflow-hidden rounded-full bg-fd-primary px-8 py-3 text-sm font-semibold text-fd-primary-foreground transition-transform hover:scale-[1.04] active:scale-95"
          >
            <span className="relative z-10">Open the docs →</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
