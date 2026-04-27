'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { LinkPreview } from 'react-native-preview-url';

const PRESETS = [
  { label: 'GitHub', url: 'https://github.com', emoji: '🐙' },
  { label: 'Vercel', url: 'https://vercel.com', emoji: '▲' },
  { label: 'Linear', url: 'https://linear.app', emoji: '✨' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Linkin_Park', emoji: '📚' }, // prettier-ignore
  { label: 'YouTube', url: 'https://youtube.com', emoji: '▶' },
  { label: 'Stripe', url: 'https://stripe.com', emoji: '💳' },
];

export function LinkPreviewDemo() {
  const [draft, setDraft] = useState('https://github.com');
  const [submitted, setSubmitted] = useState('https://github.com');
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
    <div className="not-prose grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
      <div className="flex justify-center lg:sticky lg:top-24">
        <PhoneFrame url={submitted}>
          <LinkPreview
            key={`${submitted}|${showUrl}|${hideImage}|${titleLines}`}
            url={submitted}
            showUrl={showUrl}
            hideImage={hideImage}
            titleLines={titleLines}
            onPress={(data) => setEvent({ type: 'press', detail: data.url })}
            onError={(err) => setEvent({ type: 'error', detail: err })}
          />
        </PhoneFrame>
      </div>

      <div className="rounded-3xl border border-fd-border bg-fd-card/50 p-5 shadow-sm backdrop-blur sm:p-6">
        <ControlSection title="URL" hint="Hit Enter or tap Preview to fetch.">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-3 transition-colors focus-within:border-fd-primary focus-within:ring-2 focus-within:ring-fd-primary/20">
              <LinkIcon className="size-4 shrink-0 text-fd-muted-foreground" />
              <input
                type="url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="https://"
                spellCheck={false}
                autoCapitalize="off"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-fd-foreground outline-none placeholder:text-fd-muted-foreground/60"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
            >
              Preview
            </button>
          </form>
        </ControlSection>

        <ControlSection title="Quick picks">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => {
              const active = submitted === p.url;
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
                  <span
                    aria-hidden
                    className="text-base transition-transform group-hover/preset:scale-110"
                  >
                    {p.emoji}
                  </span>
                  <span className="truncate font-medium">{p.label}</span>
                </button>
              );
            })}
          </div>
        </ControlSection>

        <ControlSection title="Props">
          <div className="grid gap-2 sm:grid-cols-2">
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

/* ─── Phone frame ─────────────────────────────────────────────────────── */

function PhoneFrame({ url, children }: { url: string; children: ReactNode }) {
  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    domain = '—';
  }

  return (
    <div className="relative">
      {/* glow underneath */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-b from-fd-primary/20 via-fd-primary/5 to-transparent blur-3xl"
      />
      {/* phone shell */}
      <div className="relative w-[300px] rounded-[2.75rem] bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-[10px] shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:w-[320px]">
        {/* side buttons */}
        <span
          aria-hidden
          className="absolute left-[-2px] top-24 h-12 w-[3px] rounded-l-sm bg-zinc-700"
        />
        <span
          aria-hidden
          className="absolute left-[-2px] top-40 h-20 w-[3px] rounded-l-sm bg-zinc-700"
        />
        <span
          aria-hidden
          className="absolute right-[-2px] top-32 h-16 w-[3px] rounded-r-sm bg-zinc-700"
        />

        {/* screen */}
        <div className="relative overflow-hidden rounded-[2.25rem] bg-zinc-50 ring-1 ring-black/5">
          {/* dynamic island */}
          <div
            aria-hidden
            className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black"
          />

          {/* status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold text-zinc-900">
            <span>9:41</span>
            <span aria-hidden className="ml-20 flex items-center gap-1">
              <SignalIcon className="size-3" />
              <WifiIcon className="size-3" />
              <BatteryIcon className="size-4" />
            </span>
          </div>

          {/* Safari-ish address bar */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-200/70 px-3 py-1.5">
              <LockIcon className="size-3 shrink-0 text-zinc-500" />
              <span className="truncate text-xs text-zinc-700">{domain}</span>
              <ReloadIcon className="ml-auto size-3 shrink-0 text-zinc-500" />
            </div>
          </div>

          {/* page content */}
          <div className="min-h-[420px] bg-zinc-50 p-4">{children}</div>

          {/* home indicator */}
          <div className="flex items-center justify-center pb-2 pt-3">
            <span className="h-1 w-24 rounded-full bg-zinc-400/70" />
          </div>
        </div>
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
    <div className="not-first:mt-5">
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

function LockIcon({ className }: { className?: string }) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ReloadIcon({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64L3 16m0 5v-5h5" />
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8m0-5v5h-5" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <rect x="0" y="10" width="3" height="4" rx="0.5" />
      <rect x="4.5" y="7" width="3" height="7" rx="0.5" />
      <rect x="9" y="4" width="3" height="10" rx="0.5" />
      <rect x="13.5" y="1" width="3" height="13" rx="0.5" opacity="0.4" />
    </svg>
  );
}

function WifiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 6.5a10 10 0 0 1 12 0" />
      <path d="M4 9a7 7 0 0 1 8 0" />
      <path d="M6 11.5a4 4 0 0 1 4 0" />
      <circle cx="8" cy="13.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" fill="none" className={className}>
      <rect
        x="0.75"
        y="0.75"
        width="20"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="22" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" />
      <rect x="2" y="2" width="16" height="8" rx="1" fill="currentColor" />
    </svg>
  );
}
