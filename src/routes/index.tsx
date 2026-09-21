import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { COUPLE_AND, SHARE_DESCRIPTION, SITE_URL } from "@/components/wedding/data";
import { Envelope } from "@/components/wedding/Envelope";
import { Microsite } from "@/components/wedding/Microsite";
import { ColourSwitch, useColour } from "@/components/wedding/ColourSwitch";
import { ScrollThread } from "@/components/wedding/ScrollThread";

const TITLE = COUPLE_AND;
const DESCRIPTION = SHARE_DESCRIPTION;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // The microsite renders beneath the envelope from the start, so the opening
  // dissolves straight into the hero rather than cutting to it.
  const [revealed, setRevealed] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [colour, setColour] = useColour();
  // The switch and the thread are both part of the journey, not the doorstep:
  // neither appears until the guest is through the opening and moving.
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const onScroll = () => setMoving(window.scrollY > window.innerHeight * 0.35);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed]);

  // No scrolling until the hero is revealed.
  useEffect(() => {
    if (overlayGone) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      el.style.overflow = prev;
    };
  }, [overlayGone]);

  const handleOpened = () => {
    setRevealed(true);
    window.setTimeout(() => setOverlayGone(true), 500);
  };

  return (
    <>
      <Microsite live={revealed} />
      <ScrollThread visible={revealed && moving} />
      <ColourSwitch on={colour} onChange={setColour} visible={revealed && moving} />
      {!overlayGone && (
        <div
          className="fixed inset-0 z-50"
          style={{ transition: "opacity 450ms ease", opacity: revealed ? 0 : 1 }}
        >
          <Envelope onOpened={handleOpened} />
        </div>
      )}
    </>
  );
}
