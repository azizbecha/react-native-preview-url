import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center items-center text-center gap-4 p-8">
      <h1 className="text-3xl font-bold">react-native-preview-url</h1>
      <p className="text-fd-muted-foreground max-w-prose">
        Rich URL link previews for React Native. Fetch metadata (title,
        description, images) and render customizable, lightweight previews.
      </p>
      <Link
        href="/docs"
        className="text-fd-foreground font-semibold underline underline-offset-4"
      >
        Read the docs →
      </Link>
    </main>
  );
}
