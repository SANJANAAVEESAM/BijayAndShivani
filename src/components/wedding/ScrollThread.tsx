import { useEffect, useRef } from "react";

/**
 * A hairline down the centre of the page, with an arrow riding its head.
 *
 * Driven straight from the scroll position on every animation frame, and
 * deliberately without a CSS transition on the moving parts. A transition was
 * what made the first version stutter: scroll fires faster than a 120ms ease
 * can finish, so each frame restarted the last one and the arrow arrived in
 * steps rather than travelling. Read the scroll, write the transform, let the
 * browser's own frame rate do the smoothing.
 *
 * The DOM is written to directly rather than through state for the same
 * reason — a re-render per frame would put React between the scroll and the
 * paint, which is exactly where the jitter came from.
 *
 * It sits behind the page rather than over it. At z-30 the line drew across
 * the nav and straight through the couple's names, which is a stripe over an
 * invitation rather than a thread through one.
 */
export function ScrollThread({ visible }: { visible: boolean }) {
  const lineRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      const line = lineRef.current;
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length * (1 - p)}`;
      }
      const arrow = arrowRef.current;
      if (arrow) {
        // vh rather than a measured pixel height: the visual viewport changes
        // as mobile browser chrome slides away, and this follows it for free.
        arrow.style.transform = `translate(-50%, -50%) translateY(${(p * 100).toFixed(3)}vh)`;
        arrow.style.opacity = p > 0.015 && p < 0.985 ? "1" : "0";
      }
      const wrap = wrapRef.current;
      if (wrap) wrap.style.opacity = visible ? "1" : "0";
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [visible]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-1/2 z-0"
      style={{
        width: 2,
        transform: "translateX(-50%)",
        opacity: 0,
        transition: "opacity 600ms ease",
      }}
    >
      <svg
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* The route, faint — so the line reads as one being followed rather
            than one being invented as it goes. */}
        <path d="M 1 0 L 1 100" fill="none" stroke="var(--gold)" strokeWidth="1"
              opacity="0.1" vectorEffect="non-scaling-stroke" />
        <path ref={lineRef} d="M 1 0 L 1 100" fill="none" stroke="var(--bronze)"
              strokeWidth="1.2" opacity="0.55" vectorEffect="non-scaling-stroke" />
      </svg>

      <span
        ref={arrowRef}
        className="absolute top-0 left-1/2"
        style={{ transform: "translate(-50%, -50%)", opacity: 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="var(--background)" />
          <circle cx="12" cy="12" r="11" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
          <path d="M12 6.5 v11 M7.5 13.5 l4.5 4.5 4.5-4.5" stroke="var(--bronze)"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
