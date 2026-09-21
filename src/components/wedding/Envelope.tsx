import { useEffect, useRef, useState } from "react";
import { COUPLE_AND } from "./data";
import { startMusic } from "@/lib/music";
import backdrop from "@/assets/backdrop.jpg";

/**
 * Scene 1 — the couple's photograph behind frosted glass, with their names
 * over it.
 *
 * Deliberately still: tapping hands straight over to the hero, and the overlay
 * in index.tsx cross-fades the two. There is no clearing or focusing sequence
 * in between — the guest should reach the invitation, not watch an animation.
 *
 * The photograph sits at scale 1, exactly where the page's fixed backdrop
 * sits, so it stays registered through the cross-fade and only the frost and
 * the names dissolve.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    startMusic();
    timer.current = window.setTimeout(onOpened, 80);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      // Opens on pointer-down rather than waiting for a click. Safari holds a
      // tap on a plain element while it decides whether a double-tap is coming,
      // which read as the first tap doing nothing. Pointer-down is still a user
      // gesture, so it satisfies the autoplay policy the music depends on.
      onPointerDown={open}
      // Kept for anything that dispatches a click without a pointer event —
      // keyboard activation, assistive tech. The guard in open() means a real
      // tap firing both still only opens once.
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="relative h-full w-full overflow-hidden outline-none"
      style={{
        cursor: opening ? "default" : "pointer",
        // Tells Safari there is no double-tap gesture here, so it stops waiting.
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Opaque base: the frost above is only partly opaque, so without this the
          page shows through before the illustration has decoded. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--background)" }} />

      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        width={1000}
        height={1500}
        // Deliberately not toned: the opening stays in colour whatever the
        // switch says. It is the one screen seen before there is any switch to
        // find, so it has to be the picture at its best.
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "34% center" }}
      />

      {/* The frost, kept thin on purpose.
          Twenty pixels of blur behind a two-thirds veil did not soften the
          couple so much as delete them — and since the picture behind it is a
          picture of them, that left the screen with nothing to be about.
          Three is judged against their faces, not against the frame: at this
          distance the faces are only about eighty pixels across, and a blur
          that flatters a wide illustration erases a photograph. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(3px) saturate(0.97)",
          WebkitBackdropFilter: "blur(3px)",
          background: "color-mix(in oklab, var(--background) 30%, transparent)",
        }}
      />

      {/* The frame's two ends, lifted to meet its middle.
          Measured down the screen, the photograph runs bright through the
          upper middle and falls away at both ends, which reads as shaded top
          and bottom rather than as one even screen. This is more veil at
          exactly those two ends and none at all through the centre, so the
          couple are untouched and only the sky and the wet sand come up.

          The very first and last rows resolve all the way to the page's own
          colour. That is what the phone paints behind the status bar and the
          home indicator, so the screen now runs into its own edges instead of
          stopping against two bands of a different colour. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, color-mix(in oklab, var(--background) 72%, transparent) 4%, color-mix(in oklab, var(--background) 30%, transparent) 14%, transparent 26%, transparent 60%, color-mix(in oklab, var(--background) 34%, transparent) 84%, color-mix(in oklab, var(--background) 78%, transparent) 96%, var(--background) 100%)",
        }}
      />

      {/* A pool of light under the type, and only under the type. Centred, it
          sat precisely on their faces — this photograph puts them at the
          middle of the frame, so the names moved up and the light with them. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(66% 20% at 50% 26%, color-mix(in oklab, var(--background) 66%, transparent), transparent 76%)",
        }}
      />

      {/* TODO(content): a monogram, once the couple have one. Until then their
          names are set rather than a placeholder image shown — a blank card
          over a photograph reads as something that failed to load. */}
      <div className="absolute inset-0 flex flex-col items-center px-8 text-center"
        style={{ paddingTop: "17vh" }}>
        <p className="font-body text-[0.58rem] font-medium tracking-[0.34em] uppercase text-bronze-deep">
          Together with their families
        </p>

        <h1
          className="mt-6 font-display leading-[1.06] text-ink-strong"
          style={{ fontSize: "clamp(2.2rem, 11vw, 3.1rem)", fontWeight: 400, letterSpacing: "-0.015em" }}
        >
          {COUPLE_AND}
        </h1>

        <span aria-hidden="true" className="mt-7 h-px w-20" style={{ background: "var(--gradient-gold)" }} />
      </div>

      {/* CTA */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 7vh)",
          transition: "opacity 250ms ease",
          opacity: opening ? 0 : 1,
          pointerEvents: opening ? "none" : "auto",
        }}
      >
        <span className="glass animate-cta-pulse rounded-full px-9 py-4 ring-1 ring-white/70">
          <span
            className="font-body text-[0.68rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.34 0.03 60)" }}
          >
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
