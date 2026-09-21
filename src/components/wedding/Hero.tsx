import { COUPLE_AND } from "./data";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/** How much of its height the card gives up across the scroll, in percent. */
const COLLAPSE = 48;

/**
 * Scene 4 — full-bleed photo card on cream. It stays pinned to the top and
 * collapses in height as you scroll, the type riding its rising bottom edge,
 * until the cream page and the invitation line take over beneath it.
 */
export function Hero({ live }: { live: boolean }) {
  const [wrapRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={wrapRef} id="home" className="relative h-[135vh]">
      {/* Sits above the next section, which is pulled up underneath it — the
          card stays opaque until it has collapsed out of the way. */}
      <div
        className="sticky top-0 z-10 h-[100dvh] p-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[24px]"
          style={{
            height: `${(100 - progress * COLLAPSE).toFixed(2)}%`,
            boxShadow: "var(--shadow-paper)",
            // The photograph used to be the card. Without it the card needs a
            // ground of its own, or it reads as a hole cut in the page.
            background: "var(--ivory)",
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 px-[7%]"
            style={{
              paddingBottom: "2.75rem",
              opacity: live ? 1 : 0,
              transition: live ? "opacity 1100ms ease 250ms" : undefined,
            }}
          >
            <h1
              className="text-center font-display leading-[1.08] italic text-ink-strong"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 3.5rem)",
                // Explicit: the h1 rule's 600 has no italic cut here and would fake-bold.
                fontWeight: 400,
              }}
            >
              {COUPLE_AND}
            </h1>

            <div className="mt-7 h-px w-full bg-white/45" />

            <div className="mt-5 flex items-center justify-between">
              <span
                aria-hidden="true"
                className="animate-scroll-nudge font-body text-sm text-muted-foreground"
              >
                ↓
              </span>
              <span className="font-body text-[0.62rem] font-light tracking-[0.34em] uppercase text-muted-foreground">
                Scroll to Explore
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
