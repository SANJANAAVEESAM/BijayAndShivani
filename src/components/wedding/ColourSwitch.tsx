import { useEffect, useState } from "react";

/**
 * The switch that carries the invitation's colour.
 *
 * It is not how colour normally arrives — the page turns itself colour when
 * the guest reaches it. This is here to show that something changed, and to
 * let anyone who prefers the black and white put it back.
 *
 * State lives on the document element rather than in React, because the things
 * it changes are spread across the page — photographs, the gold, the bronze —
 * and threading a prop to every one of them would be a worse version of a CSS
 * variable. The stylesheet does the work; this only sets the flag.
 *
 * Deliberately not remembered between visits. An earlier version stored the
 * choice, which was right while the switch was the only way colour arrived and
 * became wrong the moment the page began revealing itself: a guest returning
 * with "on" saved would have landed in full colour and never seen the one
 * thing this section exists to do.
 */
export function useColour() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.colour = on ? "on" : "off";
  }, [on]);

  return [on, setOn] as const;
}

export function ColourSwitch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Show the invitation in colour"
        onClick={() => onChange(!on)}
        className="flex items-center gap-3 rounded-full py-2.5 pr-3 pl-4"
        style={{
          background: "color-mix(in oklab, var(--ivory) 70%, transparent)",
          border: "1px solid color-mix(in oklab, var(--gold) 38%, transparent)",
        }}
      >
        <span className="font-body text-[0.58rem] font-medium tracking-[0.24em] uppercase text-bronze-deep">
          {on ? "In colour" : "See in colour"}
        </span>

        {/* The track and its knob, sized in rem so they grow with the type. */}
        <span
          aria-hidden="true"
          className="relative block h-[1.15rem] w-[2.1rem] rounded-full"
          style={{
            background: on
              ? "var(--bronze)"
              : "color-mix(in oklab, var(--foreground) 22%, transparent)",
            transition: "background 420ms ease",
          }}
        >
          <span
            className="absolute top-[0.15rem] block h-[0.85rem] w-[0.85rem] rounded-full bg-white"
            style={{
              left: on ? "calc(100% - 1rem)" : "0.15rem",
              transition: "left 320ms cubic-bezier(.22,1,.36,1)",
              boxShadow: "0 1px 3px oklch(0.3 0.02 60 / 0.35)",
            }}
          />
        </span>
      </button>
    </div>
  );
}
