import { useEffect, useRef, useState } from "react";

/**
 * A single curved line that draws itself down the page, and stops.
 *
 * Only the line. An arrow rode its head and a faint route ran the whole height
 * behind it; both are gone. The route gave the ending away, and the arrow put
 * a marker on a page that has no need of one — the line's own head is already
 * the place it has reached.
 *
 * It runs from the opening to the moment the invitation turns colour, and no
 * further. That is the whole of the journey it exists to draw; carried on down
 * the venues and the RSVP it would just be a line on a page.
 *
 * It runs on a standing animation frame loop rather than on the scroll event.
 * Scroll is not a smooth signal: iOS coarsens it during momentum scrolling and
 * stops sending it altogether at the ends, so anything driven straight from it
 * arrives in steps however carefully it is written. The loop reads the scroll
 * every frame whether or not an event fired, and eases towards it rather than
 * snapping, which turns even coarse data into continuous motion.
 *
 * It sits behind the page. Drawn over the top, the line crossed the nav and
 * the couple's names — a stripe over an invitation rather than a thread
 * through one.
 */

/** The route, in the viewBox's own 100×100 units. */
const PATH = "M 50 0 C 50 10, 20 17, 20 30 C 20 45, 80 48, 80 63 C 80 78, 50 86, 50 100";
/** How much of the remaining gap to close each frame. Lower is heavier. */
const EASE = 0.12;
/** Samples used to measure the path as drawn. More is smoother, not truer. */
const SAMPLES = 220;

/**
 * The path's length in screen pixels rather than in viewBox units.
 *
 * Needed because the stroke does not scale: with `vector-effect:
 * non-scaling-stroke`, the dash pattern is measured in screen pixels while
 * `getTotalLength` answers in the viewBox's own units. Feeding one to the
 * other made the dash repeat, and the line arrived as three broken fragments
 * instead of one stroke.
 *
 * The viewBox is squashed to the screen's shape, so the two differ by a
 * different factor along x than along y and no single number converts them.
 * Walking the path and adding up the real distances is the honest way.
 */
function screenLength(path: SVGPathElement): number {
  const ctm = path.getScreenCTM();
  const userLength = path.getTotalLength();
  if (!ctm || userLength === 0) return userLength;

  let total = 0;
  let prev = path.getPointAtLength(0).matrixTransform(ctm);
  for (let i = 1; i <= SAMPLES; i += 1) {
    const point = path.getPointAtLength((userLength * i) / SAMPLES).matrixTransform(ctm);
    total += Math.hypot(point.x - prev.x, point.y - prev.y);
    prev = point;
  }
  return total;
}

export function ScrollThread({ visible }: { visible: boolean }) {
  const lineRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    let length = screenLength(line);
    line.style.strokeDasharray = `${length}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Drawn in full rather than left as a stub, which is what an untouched
      // offset on a dashed path would otherwise leave on screen.
      line.style.strokeDashoffset = "0";
      return;
    }

    // The screen's shape decides the length, so it has to be taken again when
    // that changes — a rotation, or mobile chrome sliding away.
    const remeasure = () => {
      length = screenLength(line);
      line.style.strokeDasharray = `${length}`;
    };
    window.addEventListener("resize", remeasure);

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
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  // Where the line's journey ends: the section that turns the page to colour.
  useEffect(() => {
    const el = document.getElementById("join");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDone(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (wrapRef.current) wrapRef.current.style.opacity = visible && !done ? "1" : "0";
  }, [visible, done]);

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
        <path
          ref={lineRef}
          d={PATH}
          fill="none"
          stroke="var(--bronze)"
          strokeWidth="1.2"
          opacity="0.55"
          strokeLinecap="round"
          // Without this the stroke itself would be stretched by the same
          // amount as the path, since the viewBox is squashed to the screen.
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
