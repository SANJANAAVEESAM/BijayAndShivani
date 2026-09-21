import { useEffect, useRef } from "react";

/**
 * A curved hairline that winds down the page, with an arrow travelling its head.
 *
 * Three things here are deliberate, and each replaces something that did not
 * work.
 *
 * The path curves. A straight line down the middle is a rule, not a thread —
 * it reads as a divider between two columns rather than as a route through
 * the invitation.
 *
 * It runs on a standing animation frame loop rather than on the scroll event.
 * Scroll is not a smooth signal: iOS coarsens it during momentum scrolling and
 * stops sending it altogether at the ends, so anything positioned directly
 * from it arrives in steps however carefully it is written. The loop reads the
 * scroll every frame whether or not an event fired.
 *
 * And it eases towards its target instead of snapping to it. Each frame closes
 * part of the gap, which turns even coarse scroll data into continuous motion
 * and gives the arrow a little weight as it settles.
 *
 * It sits behind the page. Drawn over the top, the line crossed the nav and
 * the couple's names — a stripe over an invitation rather than a thread
 * through one.
 */

/** The route, in the viewBox's own 100×100 units. */
const PATH = "M 50 0 C 50 10, 20 17, 20 30 C 20 45, 80 48, 80 63 C 80 78, 50 86, 50 100";
/** How much of the remaining gap to close each frame. Lower is heavier. */
const EASE = 0.12;

export function ScrollThread({ visible }: { visible: boolean }) {
  const lineRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const line = lineRef.current;
    const arrow = arrowRef.current;
    if (!line || !arrow) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.strokeDasharray = "none";
      arrow.style.opacity = "0";
      return;
    }

    // Measured once: getTotalLength forces layout, and this path never changes.
    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;

    let shown = 0;
    let raf = 0;

    const tick = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      shown += (target - shown) * EASE;
      // Close the last sliver rather than approaching it forever.
      if (Math.abs(target - shown) < 0.0004) shown = target;

      line.style.strokeDashoffset = `${length * (1 - shown)}`;

      // The arrow rides the curve itself, so it is never beside the line.
      // Position goes on left/top, which resolve against the viewport, and not
      // into the transform, where a percentage means a share of the arrow's
      // own eighteen pixels and moves it nowhere.
      const point = line.getPointAtLength(length * shown);
      arrow.style.left = `${point.x}%`;
      arrow.style.top = `${point.y}%`;
      arrow.style.opacity = shown > 0.012 && shown < 0.988 ? "1" : "0";

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (wrapRef.current) wrapRef.current.style.opacity = visible ? "1" : "0";
  }, [visible]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0, transition: "opacity 600ms ease" }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* The whole route, faint — so the line reads as one being followed
            rather than one being invented as it goes. */}
        <path
          d={PATH}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1"
          opacity="0.14"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={lineRef}
          d={PATH}
          fill="none"
          stroke="var(--bronze)"
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Positioned in percent of the viewport, matching the 100×100 viewBox
          the path is drawn in, so the two stay together at any screen size. */}
      <span ref={arrowRef} className="absolute top-0 left-0" style={{ opacity: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="var(--background)" />
          <circle cx="12" cy="12" r="11" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
          <path
            d="M12 6.5 v11 M7.5 13.5 l4.5 4.5 4.5-4.5"
            stroke="var(--bronze)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
