'use client';

import {
  useId,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from 'react';
import {
  SiGithub,
  SiReact,
  SiVercel,
  SiWikipedia,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { LinkPreview } from 'react-native-preview-url';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const DEFAULT_URL = 'https://github.com/azizbecha/react-native-preview-url';

const PRESETS: Array<{ label: string; url: string; icon: IconComponent }> = [
  { label: 'GitHub', url: DEFAULT_URL, icon: SiGithub },
  { label: 'Vercel', url: 'https://vercel.com', icon: SiVercel },
  {
    label: 'React Native',
    url: 'https://reactnative.dev',
    icon: SiReact,
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/watch?v=Pi_XhK03fTA',
    icon: SiYoutube,
  },
  {
    label: 'RN Directory',
    url: 'https://reactnative.directory',
    icon: SiReact,
  },
  {
    label: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/React_Native',
    icon: SiWikipedia,
  },
];

export function LinkPreviewDemo() {
  const [draft, setDraft] = useState(DEFAULT_URL);
  const [submitted, setSubmitted] = useState(DEFAULT_URL);
  const [showUrl, setShowUrl] = useState(true);
  const [hideImage, setHideImage] = useState(false);
  const [titleLines, setTitleLines] = useState(2);
  const [event, setEvent] = useState<{
    type: 'press' | 'error';
    detail: string;
  } | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = draft.trim();
    if (!next) return;
    setSubmitted(next);
    setEvent(null);
  }

  function selectPreset(url: string) {
    setDraft(url);
    setSubmitted(url);
    setEvent(null);
  }

  return (
    <div className="not-prose grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div className="flex">
        <PreviewCanvas>
          <LinkPreview
            key={`${submitted}|${showUrl}|${hideImage}|${titleLines}`}
            url={submitted}
            showUrl={showUrl}
            hideImage={hideImage}
            titleLines={titleLines}
            containerStyle={{
              backgroundColor: 'var(--color-fd-background)',
              borderColor: 'var(--color-fd-border)',
              shadowOpacity: 0,
              elevation: 0,
            }}
            titleStyle={{ color: 'var(--color-fd-foreground)' }}
            descriptionStyle={{ color: 'var(--color-fd-muted-foreground)' }}
            urlStyle={{ color: 'var(--color-fd-muted-foreground)' }}
            onPress={(data) => setEvent({ type: 'press', detail: data.url })}
            onError={(err) => setEvent({ type: 'error', detail: err })}
          />
        </PreviewCanvas>
      </div>

      <div className="flex flex-col gap-7 rounded-3xl border border-fd-border bg-fd-card/50 p-6 shadow-sm backdrop-blur sm:p-8">
        <ControlSection title="URL" hint="Hit Enter or tap Preview to fetch.">
          <form onSubmit={handleSubmit} className="flex gap-2.5">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-fd-border bg-fd-background px-3.5 transition-colors focus-within:border-fd-primary focus-within:ring-2 focus-within:ring-fd-primary/20">
              <LinkIcon className="size-4 shrink-0 text-fd-muted-foreground" />
              <input
                type="url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="https://"
                spellCheck={false}
                autoCapitalize="off"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-fd-foreground outline-none placeholder:text-fd-muted-foreground/60"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
            >
              Preview
            </button>
          </form>
        </ControlSection>

        <ControlSection title="Quick picks">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PRESETS.map((p) => {
              const active = submitted === p.url;
              const Icon = p.icon;
              return (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => selectPreset(p.url)}
                  className={`group/preset flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                    active
                      ? 'border-fd-primary bg-fd-primary/10 text-fd-foreground shadow-[inset_0_0_0_1px_var(--color-fd-primary)]'
                      : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/40 hover:text-fd-foreground'
                  }`}
                >
                  <Icon
                    color="currentColor"
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover/preset:scale-110"
                  />
                  <span className="truncate font-medium">{p.label}</span>
                </button>
              );
            })}
          </div>
        </ControlSection>

        <ControlSection title="Props">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Toggle label="showUrl" value={showUrl} onChange={setShowUrl} />
            <Toggle
              label="hideImage"
              value={hideImage}
              onChange={setHideImage}
            />
            <SegmentPicker
              label="titleLines"
              value={titleLines}
              options={[1, 2, 3]}
              onChange={setTitleLines}
              className="sm:col-span-2"
            />
          </div>
        </ControlSection>

        <ControlSection title="Last event">
          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-background">
            <div className="flex items-center gap-2 border-b border-fd-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fd-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              callback log
            </div>
            <div className="px-3 py-3 font-mono text-xs">
              {event ? (
                <div className="flex items-start gap-2">
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      event.type === 'press'
                        ? 'bg-fd-primary/15 text-fd-primary'
                        : 'bg-rose-500/15 text-rose-500'
                    }`}
                  >
                    {event.type === 'press' ? 'onPress' : 'onError'}
                  </span>
                  <span className="break-all text-fd-foreground">
                    {event.detail}
                  </span>
                </div>
              ) : (
                <span className="text-fd-muted-foreground">
                  Waiting for input. Tap the preview card to fire onPress.
                </span>
              )}
            </div>
          </div>
        </ControlSection>
      </div>
    </div>
  );
}

/* ─── Preview canvas ──────────────────────────────────────────────────── */

const PLATFORMS = ['iOS', 'Android', 'Web'] as const;

function PreviewCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-fd-border bg-fd-card/50 shadow-sm backdrop-blur">
      {/* soft glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-fd-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl"
      />
      {/* dotted accent */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-fd-foreground opacity-[0.05]"
      >
        <pattern
          id="dotgrid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      <div className="relative flex flex-1 flex-col gap-6 p-7 sm:gap-8 sm:p-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/60 px-3 py-1 text-[11px] font-medium text-fd-muted-foreground backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live · same component, every platform
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-fd-border bg-fd-background/60 p-1 text-[11px] font-medium backdrop-blur">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  p === 'Web'
                    ? 'bg-fd-foreground text-fd-background shadow-sm'
                    : 'text-fd-muted-foreground'
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-4">
          <div className="w-full max-w-md drop-shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            {children}
          </div>
        </div>

        <footer className="flex items-center justify-between text-[11px] text-fd-muted-foreground">
          <span className="font-mono">react-native-preview-url</span>
          <span>tap the card to fire onPress</span>
        </footer>
      </div>
    </div>
  );
}

/* ─── Building blocks ─────────────────────────────────────────────────── */

function ControlSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">
          {title}
        </h4>
        {hint && (
          <p className="text-[11px] text-fd-muted-foreground/70">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
        value
          ? 'border-fd-primary/40 bg-fd-primary/5'
          : 'border-fd-border bg-fd-background hover:border-fd-primary/30'
      }`}
    >
      <span className="font-mono text-fd-foreground">{label}</span>
      <span
        aria-hidden
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? 'bg-fd-primary' : 'bg-fd-muted'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
            value ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  );
}

function SegmentPicker<T extends number | string>({
  label,
  value,
  options,
  onChange,
  className = '',
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-fd-border bg-fd-background p-1 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 px-2 pt-1">
        <span className="font-mono text-sm text-fd-foreground">{label}</span>
        <span className="font-mono text-xs text-fd-muted-foreground">
          {value}
        </span>
      </div>
      <div className="mt-1 grid grid-flow-col auto-cols-fr gap-1">
        {options.map((o) => (
          <button
            key={String(o)}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
              value === o
                ? 'bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground'
            }`}
          >
            {String(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Inline icons (kept as small SVGs to avoid an icon dep) ──────────── */

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
