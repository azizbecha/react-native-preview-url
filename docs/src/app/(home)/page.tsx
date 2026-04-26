import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-fd-muted-foreground">
          react-native-preview-url
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Rich link previews for React Native
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-lg text-fd-muted-foreground">
          A small, dependency-light component that fetches Open Graph metadata
          and renders a polished link card. Works on iOS, Android, and the web —
          with built-in caching and accessibility.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="inline-flex h-11 items-center justify-center rounded-md bg-fd-primary px-6 font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/docs/link-preview"
          className="inline-flex h-11 items-center justify-center rounded-md border border-fd-border bg-fd-background px-6 font-medium transition hover:bg-fd-accent"
        >
          See live demo
        </Link>
      </div>

      <pre className="mt-4 rounded-md border border-fd-border bg-fd-muted px-4 py-3 text-sm">
        <code>yarn add react-native-preview-url</code>
      </pre>
    </main>
  );
}
