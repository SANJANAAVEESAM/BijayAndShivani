import { useEffect, useRef, useState } from "react";
import { COUPLE_AND } from "./data";
import { startMusic } from "@/lib/music";
import backdrop from "@/assets/backdrop.jpg";

/** How long the stroke takes to cross the name, in ms — in step with styles.css. */
const WRITE = 2400;
/** A beat after the name lands before the cue appears, in ms. */
const BEAT = 420;

/** The wash, and the type that sits on it. */
const TEAL = "oklch(0.56 0.07 193)";
const INK = "oklch(0.99 0.004 190)";
/**
 * How much of the wash, and so how little of the photograph.
 *
 * Every point of this compresses what is left of the picture's own range, so
 * it is also the dial that settles how flat the colour reads. Below about
 * 0.85 the wet sand at the foot of the frame still pulls the bottom of the
 * screen visibly darker than the middle.
 */
const WASH = 0.87;

/**
 * Scene 1 — the couple's photograph under a teal wash, their name written
 * across it.
 *
 * The wash does two jobs at once. It carries the colour, and it flattens the
 * photograph far enough that white type holds everywhere without a scrim or a
 * shadow — the picture reads as a texture under the colour rather than as a
 * photograph competing with the name. Enough of them shows through to know
 * who this is; not so much that the name has to fight for the screen.
 *
 * Tapping hands over to the hero, where the same photograph is finally seen
 * whole and unwashed. The overlay in index.tsx cross-fades the two, and the
 * tap matters beyond the animation: browsers will not start audio without a
 * user gesture, and this is the first one on offer.
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
        // Under the photograph as well as behind it, so a slow decode shows
        // the colour rather than a white flash.
        background: TEAL,
        cursor: opening ? "default" : "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        opacity: opening ? 0 : 1,
        transition: "opacity 460ms ease",
      }}
    >
      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        width={1000}
        height={1500}
        // They stand left of middle in the original, so a symmetric crop would
        // leave the pair off-centre on a tall phone.
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: "34% center",
          // The picture's own range is what made the screen look shaded at the
          // top and bottom: bright sky at one end, wet sand at the other, both
          // showing through the wash as a gradient across the whole height.
          // Crushing the contrast pulls both ends towards the middle, so the
          // teal reads as one flat colour and the couple still come through as
          // shape. The brightness lifts what the contrast drop darkens.
          filter: "contrast(0.42) brightness(1.2) saturate(0.85)",
        }}
      />

      {/* One even sheet of colour, and deliberately not a multiply blend.
          Multiplying keeps the photograph's own light and shade, which sounds
          better than it looks here: it drove the dark sky at the top and the
          wet sand at the bottom down into heavy bands while the middle stayed
          pale, so the screen read as three stripes rather than one colour.
          Flat opacity gives the same teal everywhere and lets the couple show
          through it evenly. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: TEAL, opacity: WASH }}
      />

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
