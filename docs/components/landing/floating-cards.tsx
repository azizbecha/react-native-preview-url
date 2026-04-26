import { PreviewMock } from './preview-mock';

/**
 * Three preview cards scattered behind the hero with subtle float animation.
 * Pure CSS animation, no client component — runs on prefers-reduced-motion-aware
 * keyframes defined in global.css.
 */
export function FloatingCards() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {/* top-left */}
      <div className="absolute left-[6%] top-[12%] motion-safe:animate-float-slow [animation-delay:-2s]">
        <PreviewMock
          title="GitHub · Where the world builds software"
          description="Millions of developers build, ship, and maintain their software on GitHub."
          domain="github.com"
          emoji="🐙"
          gradient="bg-gradient-to-br from-slate-700 to-slate-900 text-white"
          rotate={-8}
          className="opacity-40 blur-[1px]"
        />
      </div>

      {/* top-right */}
      <div className="absolute right-[4%] top-[8%] motion-safe:animate-float-slower">
        <PreviewMock
          title="Vercel: Build and deploy the best web experiences"
          description="Vercel gives you the developer tools and cloud infrastructure to build, scale, and secure faster."
          domain="vercel.com"
          emoji="▲"
          gradient="bg-gradient-to-br from-zinc-900 to-black text-white"
          rotate={6}
          className="opacity-50"
        />
      </div>

      {/* bottom-left */}
      <div className="absolute bottom-[6%] left-[10%] motion-safe:animate-float [animation-delay:-1s]">
        <PreviewMock
          title="Linear — The new standard for modern software development"
          description="Streamline issues, sprints, and product roadmaps. Built for high-performance teams."
          domain="linear.app"
          emoji="✨"
          gradient="bg-gradient-to-br from-indigo-500 to-purple-700 text-white"
          rotate={-5}
          className="opacity-50 blur-[2px]"
        />
      </div>

      {/* bottom-right */}
      <div className="absolute bottom-[10%] right-[8%] motion-safe:animate-float-slow">
        <PreviewMock
          title="Figma — The Collaborative Interface Design Tool"
          description="Build better products as a team. Design, prototype, and gather feedback all in one place."
          domain="figma.com"
          emoji="🎨"
          gradient="bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300"
          rotate={9}
          className="opacity-40"
        />
      </div>
    </div>
  );
}
