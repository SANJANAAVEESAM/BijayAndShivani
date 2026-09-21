import { useEffect, useState } from "react";

/**
 * A single hairline that travels down the page as you scroll.
 *
 * It is drawn, not scrolled: the path is fixed to the viewport and revealed by
 * walking its dash offset, so the line appears to extend ahead of the reader
 * rather than slide past them. Below the line's head sits a small arrow, which
 * is the part that reads as travelling.
 *
 * Fixed rather than absolute so it survives the whole page without being
 * measured against any one section — and because the sections it crosses are
 * pinned and collapsing, which a positioned overlay would have to track.
 */
export function ScrollThread({ visible }: { visible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The curve the thread follows, in the viewBox's own units.
  const PATH = "M 14 0 C 14 160, 86 230, 86 400 C 86 570, 14 640, 14 800";
  // Generous: an overestimate only slows the head, where an underestimate
  // would finish the line before the page does.
  const LENGTH = 980;

  const drawn = LENGTH * progress;
  // Where the head currently sits, so the arrow can ride it.
  const headY = 800 * progress;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-30"
      style={{
        width: "6.5rem",
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease",
      }}
    >
      <svg
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
        className="h-full w-full"
        style={{ overflow: "visible" }}
      >
        {/* The whole route, very faint — so the line reads as a path being
            followed rather than one being invented. */}
        <path
          d={PATH}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1"
          opacity="0.18"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={PATH}
          fill="none"
          stroke="var(--bronze)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={LENGTH}
          strokeDashoffset={LENGTH - drawn}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>

      {/* The arrow, riding the head of the line. Positioned in percent of the
          same 800-unit box the path is drawn in, so the two stay together at
          any screen height. */}
      <span
        className="absolute"
        style={{
          left: "0.6rem",
          top: `${(headY / 800) * 100}%`,
          transform: "translate(-50%, -50%)",
          transition: "top 120ms linear",
          opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="var(--background)" opacity="0.9" />
          <path
            d="M12 6 v12 M7 13.5 l5 5 5-5"
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
