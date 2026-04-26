import Link from 'next/link';
import { LinkPreviewDemo } from '@/components/link-preview-demo';

const FEATURES = [
  {
    title: 'Drop-in component',
    body: 'A <LinkPreview /> with sensible defaults — rounded card, 16:9 image, accessible press behavior, tap-to-open via Linking.',
  },
  {
    title: 'Or just the hook',
    body: 'useUrlPreview gives you { loading, data, error }. Render whatever shape your design system needs.',
  },
  {
    title: 'Smart cache',
    body: 'In-memory LRU with separate TTLs for success/error, automatic dedupe of concurrent requests, scoped by base URL.',
  },
  {
    title: 'Free hosted API',
    body: 'No API key. Or self-host the open-source backend if you need control over uptime, latency, or extraction logic.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--color-fd-primary)/0.08,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
          <span className="rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            React Native · Expo · React Native Web
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Rich link previews
            <br />
            <span className="bg-gradient-to-br from-fd-primary to-fd-foreground bg-clip-text text-transparent">
              for React Native
            </span>
          </h1>
          <p className="max-w-2xl text-pretty text-base text-fd-muted-foreground md:text-lg">
            One component, one hook, one free API. Turn any URL into a polished
            preview card with metadata, image, favicon, and tap-to-open — in
            three lines of JSX.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="rounded-full bg-fd-primary px-6 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Read the docs →
            </Link>
            <Link
              href="/docs/installation"
              className="rounded-full border border-fd-border bg-fd-card px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-fd-muted"
            >
              Get started
            </Link>
            <a
              href="https://github.com/azizbecha/react-native-preview-url"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-fd-border bg-fd-card px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-fd-muted"
            >
              GitHub
            </a>
          </div>
          <pre className="mt-2 rounded-xl border border-fd-border bg-fd-muted/50 px-4 py-2 text-sm text-fd-muted-foreground">
            <code className="font-mono">pnpm add react-native-preview-url</code>
          </pre>
        </div>
      </section>

      {/* Live demo */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Try it live
            </h2>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              Same component, rendered in your browser via{' '}
              <code className="rounded bg-fd-muted px-1 py-0.5 text-xs">
                react-native-web
              </code>
              . Paste any URL.
            </p>
          </div>
        </div>
        <LinkPreviewDemo />
      </section>

      {/* Features */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            What you get
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-fd-border bg-fd-card p-6"
              >
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code preview */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Three lines
        </h2>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          The whole API for the happy path.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-fd-border bg-fd-card p-6 text-sm">
          <code className="font-mono">{`import { LinkPreview } from 'react-native-preview-url';

export const Card = () => <LinkPreview url="https://github.com" />;`}</code>
        </pre>
      </section>

      {/* CTA */}
      <section className="border-t border-fd-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to ship?
          </h2>
          <p className="text-sm text-fd-muted-foreground">
            The docs cover the component, the hook, the cache, the HTTP
            contract, and how to self-host the backend if you outgrow the free
            API.
          </p>
          <Link
            href="/docs"
            className="rounded-full bg-fd-primary px-6 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the docs →
          </Link>
        </div>
      </section>
    </main>
  );
}
