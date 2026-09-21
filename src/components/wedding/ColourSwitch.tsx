import { useEffect, useState } from "react";

const KEY = "colour";

/**
 * The switch that brings the invitation into colour.
 *
 * State lives on the document element rather than in React, because the
 * things it changes are spread across the page — photographs, the gold, the
 * bronze — and threading a prop to every one of them would be a worse version
 * of a CSS variable. The stylesheet does the work; this only sets the flag.
 *
 * It is remembered, so a guest who turns colour on and comes back later is not
 * handed black and white a second time. A blocked or full localStorage throws
 * rather than returning null, so every touch of it is guarded: the switch
 * working matters more than the page remembering.
 */
export function useColour() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(KEY);
    } catch {
      // Private windows and blocked site data. Start in black and white.
    }
    if (saved === "on") setOn(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.colour = on ? "on" : "off";
    try {
      window.localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      // Not remembering is survivable; failing to switch is not.
    }
  }, [on]);

  return [on, setOn] as const;
}

export function ColourSwitch({
  on,
  onChange,
  visible,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  visible: boolean;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 420ms ease, transform 420ms cubic-bezier(.22,1,.36,1)",
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Show the invitation in colour"
        onClick={() => onChange(!on)}
        className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pr-3 pl-4 ring-1 ring-white/60"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <span className="font-body text-[0.58rem] font-medium tracking-[0.24em] uppercase text-bronze-deep">
          {on ? "In colour" : "See in colour"}
        </span>

        {/* The track and its knob. Sized in rem so it grows with the type. */}
        <span
          aria-hidden="true"
          className="relative block h-[1.15rem] w-[2.1rem] rounded-full"
          style={{
            background: on ? "var(--bronze)" : "color-mix(in oklab, var(--foreground) 22%, transparent)",
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
