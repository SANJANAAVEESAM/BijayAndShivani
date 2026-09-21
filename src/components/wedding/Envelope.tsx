import { useEffect, useRef, useState } from "react";
import { COUPLE_AND } from "./data";
import { startMusic } from "@/lib/music";

/** How long the stroke takes to cross the name, in ms — in step with styles.css. */
const WRITE = 2400;
/** A beat after the name lands before the cue appears, in ms. */
const BEAT = 420;

/** The ground, and the type that sits on it. */
const TEAL = "oklch(0.43 0.062 195)";
const INK = "oklch(0.985 0.004 190)";

/**
 * Scene 1 — a plain field of teal, and the couple's name written across it.
 *
 * Nothing else is on this screen. A flat ground needs no scrim and no shadow
 * to hold white type, so the name can be exactly as clean as it is — which is
 * the whole point of choosing a colour over a picture.
 *
 * Tapping hands over to the hero, and the overlay in index.tsx cross-fades the
 * two. The tap matters beyond the animation: browsers will not start audio
 * without a user gesture, and this is the first one on offer.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);


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
        background: TEAL,
        cursor: opening ? "default" : "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        opacity: opening ? 0 : 1,
        transition: "opacity 460ms ease",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
        <h1
          className="animate-write font-display leading-[1.08]"
          style={{
            fontSize: "clamp(2.3rem, 12.5vw, 3.6rem)",
            fontWeight: 400,
            letterSpacing: "-0.012em",
            color: INK,
          }}
        >
          {COUPLE_AND}
        </h1>

        <span
          aria-hidden="true"
          className="animate-settle mt-8 h-px w-16"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.7), transparent)",
            animationDelay: `${WRITE}ms`,
          }}
        />
      </div>

      <div
        className="animate-settle absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 8vh)",
          animationDelay: `${WRITE + BEAT}ms`,
          pointerEvents: opening ? "none" : "auto",
        }}
      >
        <span
          className="rounded-full px-9 py-4"
          style={{
            background: "oklch(1 0 0 / 0.1)",
            border: "1px solid oklch(1 0 0 / 0.5)",
          }}
        >
          <span
            className="font-body text-[0.66rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: INK }}
          >
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
