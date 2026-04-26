'use client';

import { useState, type FormEvent } from 'react';
import { LinkPreview } from 'react-native-preview-url';

const PRESETS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Vercel', url: 'https://vercel.com' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Linkin_Park' },
  { label: 'YouTube', url: 'https://youtube.com' },
];

interface Props {
  defaultUrl?: string;
  showPresets?: boolean;
  showUrl?: boolean;
  hideImage?: boolean;
}

export function LinkPreviewDemo({
  defaultUrl = 'https://github.com',
  showPresets = true,
  showUrl = true,
  hideImage = false,
}: Props) {
  const [draft, setDraft] = useState(defaultUrl);
  const [submitted, setSubmitted] = useState(defaultUrl);
  const [tapped, setTapped] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(draft.trim());
    setTapped(null);
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste any URL"
          spellCheck={false}
          className="flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <button
          type="submit"
          className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Preview
        </button>
      </form>

      {showPresets && (
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.url}
              type="button"
              onClick={() => {
                setDraft(p.url);
                setSubmitted(p.url);
                setTapped(null);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                submitted === p.url
                  ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                  : 'border-fd-border text-fd-muted-foreground hover:bg-fd-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 max-w-md">
        <LinkPreview
          key={submitted}
          url={submitted}
          showUrl={showUrl}
          hideImage={hideImage}
          onPress={(data) => setTapped(data.url)}
          onError={(err) => setTapped(`error: ${err}`)}
        />
      </div>

      {tapped && (
        <p className="mt-3 text-xs text-fd-muted-foreground">
          <span className="font-mono">onPress</span> fired with{' '}
          <span className="font-mono">{tapped}</span>
        </p>
      )}
    </div>
  );
}
