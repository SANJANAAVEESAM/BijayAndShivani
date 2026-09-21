import { useEffect, useRef, useState } from "react";
import { COUPLE_AND } from "./data";
import { startMusic } from "@/lib/music";

/** How long between one letter starting and the next, in ms. */
const STAGGER = 78;
/** The letter animation's own length, in ms — keep in step with styles.css. */
const LETTER = 1150;
/** A beat after the name lands before the cue appears, in ms. */
const BEAT = 420;

/**
 * Scene 1 — a painted sky, and the couple's name written into it in white.
 *
 * The sky is a four-second loop: clouds drifting, a flock crossing, pampas
 * grass swaying in at the edges. It carries the screen on its own, so nothing
 * else is on it but the name.
 *
 * Muted and playsinline are not decoration. Mobile browsers refuse to autoplay
 * anything else, and a video that will not start would leave this screen black
 * — hence the poster too, which is the film's own first frame and holds the
 * screen while the file loads, or instead of it if playback never begins.
 *
 * Tapping hands over to the hero, and the overlay in index.tsx cross-fades the
 * two. The tap matters beyond the animation: browsers will not start audio
 * without a user gesture, and this is the first one on offer.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const letters = [...COUPLE_AND];
  const written = letters.length * STAGGER + LETTER;

  const open = () => {
    if (opening) return;
    setOpening(true);
    startMusic();
    // Long enough for the sky to lift before the hero takes over.
    timer.current = window.setTimeout(onOpened, 480);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      // Pointer-down rather than click: Safari holds a tap on a plain element
      // while it decides whether a double-tap is coming, which reads as the
      // first tap doing nothing. It still counts as the gesture audio needs.
      onPointerDown={open}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="relative h-full w-full overflow-hidden outline-none"
      style={{
        // The sky's own blue, so any letterboxing or slow first paint is the
        // same colour as the film rather than a black band.
        background: "oklch(0.86 0.045 235)",
        cursor: opening ? "default" : "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        opacity: opening ? 0 : 1,
        transition: "opacity 460ms ease",
      }}
    >
      <video
        src="/opening.mp4"
        poster="/opening-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* White on a painted sky is white on white wherever a cloud is. This is
          just enough shade behind the name to keep it legible, weighted to the
          middle band where the type sits and fading out before it darkens the
          clouds the film is there to show. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(74% 26% at 50% 47%, oklch(0.42 0.05 248 / 0.2), transparent 76%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
        <h1
          // The whole name is the accessible name; the spans below are scenery,
          // and a screen reader spelling them out one at a time would be
          // nonsense.
          aria-label={COUPLE_AND}
          className="font-display leading-[1.08]"
          style={{
            fontSize: "clamp(2.3rem, 12.5vw, 3.6rem)",
            fontWeight: 400,
            letterSpacing: "-0.012em",
            color: "oklch(1 0 0)",
            // A shadow rather than a heavier scrim: it travels with the
            // letters, so a bright cloud drifting behind one of them cannot
            // swallow it.
            textShadow:
              "0 2px 22px oklch(0.32 0.05 248 / 0.55), 0 1px 4px oklch(0.32 0.05 248 / 0.45)",
          }}
        >
          {letters.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              aria-hidden="true"
              className="animate-letter inline-block"
              style={{
                animationDelay: `${i * STAGGER}ms`,
                // A space has no glyph to blur, but it still has to hold its
                // width, or the name reflows as each letter lands.
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <span
          aria-hidden="true"
          className="animate-settle mt-8 h-px w-16"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.75), transparent)",
            animationDelay: `${written}ms`,
          }}
        />
      </div>

      <div
        className="animate-settle absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 8vh)",
          animationDelay: `${written + BEAT}ms`,
          pointerEvents: opening ? "none" : "auto",
        }}
      >
        <span
          className="rounded-full px-9 py-4"
          style={{
            background: "oklch(1 0 0 / 0.16)",
            border: "1px solid oklch(1 0 0 / 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <span
            className="font-body text-[0.66rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: "oklch(1 0 0)", textShadow: "0 1px 6px oklch(0.35 0.05 248 / 0.4)" }}
          >
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
