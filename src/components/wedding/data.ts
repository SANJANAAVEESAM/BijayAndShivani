
export const COUPLE = { bride: "Shivani", groom: "Bijay" };

/** ⚠️ Year is unconfirmed (reference doc said 2027) — change it here only. */
export const WEDDING_YEAR = 2026;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A wall-clock Eastern time, as an instant.
 *
 * US daylight saving ends on the first Sunday in November — 1 November in
 * 2026 — and every one of these celebrations falls after it, so they are EST,
 * UTC-5. This read UTC-4 when the file was seeded, which was right for the
 * October wedding it came from and would have put every time here an hour
 * early, including the muhurtham. Month is zero-based, matching Date.
 */
const ET = (month: number, day: number, hour: number, minute: number) =>
  new Date(`${WEDDING_YEAR}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00-05:00`);

/** Muhurtham — 21 November, 11:36 AM Eastern. */
export const WEDDING_DATE = ET(10, 21, 11, 36);

export const WEDDING_DATE_RANGE = `November 14–21, ${WEDDING_YEAR}`;

/** Where the celebrations are. */
export const WEDDING_PLACE = "Pennsylvania & New Jersey";

/**
 * The couple, as a shareable name, and the one-line summary link previews use.
 *
 * Derived here rather than typed into each route's head. On the last site both
 * were hardcoded, and a share preview went on naming the wrong couple long
 * after everything on screen had changed.
 */
// Named in the order the couple use themselves, which is not always the order
// the code happens to store them in.
export const COUPLE_AND = `${COUPLE.groom} & ${COUPLE.bride}`;
export const SHARE_DESCRIPTION = [
  `The wedding of ${COUPLE_AND}`,
  WEDDING_DATE_RANGE,
  WEDDING_PLACE,
]
  .filter(Boolean)
  .join(" — ") + ".";

// TODO(content): the number guests should message.
export const WHATSAPP_NUMBER = "";

/**
 * Where the invitation lives. Share previews need absolute URLs — a crawler
 * has no page context to resolve a relative path against, which is why no
 * photograph was appearing.
 */
// TODO(content): the real domain, once there is one.
export const SITE_URL = "https://example.com";

// TODO(content): the couple's shared address.
export const CONTACT_EMAIL = "";

/** Credited in the closing line. */
export const DESIGNER = "Sanjana Veesam";
export const DESIGNER_URL = "https://www.instagram.com/sanjanaa_vv/";

/**
 * Who to call. `tel` is the number that rings; `whatsapp` is only set when the
 * account lives on a different number — sending Chat to the calling number
 * would otherwise reach nobody.
 *
 * TODO(content): add the couple's numbers. The contact section hides itself
 * while this is empty, so an unfinished invitation shows nothing rather than
 * a number that does not answer.
 */
export const CONTACTS: {
  name: string;
  tel: string;
  display: string;
  whatsapp?: string;
}[] = [
  {
    // TODO(content): confirm whose number this is before the invitations go
    // out — it was given without a name, and the site prints one beside it.
    name: COUPLE.groom,
    tel: "+17164950790",
    display: "+1 716 495 0790",
  },
];

import type { EventTheme } from "./eventThemes";

/**
 * Shared Drive folders guests add their own photos to. Haldi and Mehendi share
 * one, as supplied by the couple.
 *
 * Each folder must be shared so that anyone with the link can *contribute*, not
 * just view — otherwise the button leads guests to a wall.
 */
export const GALLERY_FOLDERS: { label: string; url: string }[] = [
  // TODO(content): one shared Drive folder per celebration. Left empty rather
  // than carried over — the folders that were here belonged to another couple
  // and were live, shareable links to their photographs.
];

/**
 * A dress code the sheet can draw rather than merely state.
 *
 * `kind` selects the swatch row: a spread of hues for "solids", metallics for
 * "bling". Only the three events that actually have a code carry one.
 */
export type DressCode = {
  label: string;
  /** A single paragraph. Use `lines` instead when the guidance differs by guest. */
  note?: string;
  /** Guidance split by who it applies to, e.g. Men / Women. */
  lines?: { who: string; what: string }[];
  /** Optional inspiration thumbnails, shown in a row beneath the wording. */
  images?: string[];
};

export type Venue = {
  name: string;
  /** Street or area line shown under the venue name. */
  address?: string;
  /** A full Google Maps share link. Wins over mapsQuery when present. */
  mapsUrl?: string;
  /** Fallback: a search string. Directions stay hidden until one is set. */
  mapsQuery?: string;
};

export type WeddingEvent = {
  slug: string;
  name: string;
  theme?: string;
  /** Drives the accent and motif on the event's full-page details. */
  themeKey: EventTheme;
  time: string;
  dressCode?: DressCode;
  /** Shared folder for this celebration's photos. */
  photosUrl?: string;
  /** Held at the same place as the event above it, so they list as one. */
  sharesVenueWithPrevious?: boolean;
  /**
   * The formal invitation, shown above the details. Structured rather than one
   * run-on sentence so each family can be set on its own lines, the way an
   * invitation card would.
   */
  invitation?: {
    lead: string;
    parties: { name: string; parents: string }[];
  };
  /** TODO(content): Mehendi's dress code is an inspiration photo, not text —
   *  drop the image in src/assets and point this at it. */
  dressCodeImage?: string;
  /** Renders a "Followed by" link to the event above it. */
  followsPrevious?: boolean;
  venue: Venue;
  start: Date;
  end: Date;
};

export type EventDay = {
  date: string;
  weekday: string;
  events: WeddingEvent[];
};



// A home rather than a hall, so the street is the name and the town is the
// second line — there is no venue name to put above it.

/**
 * The celebrations, in running order.
 *
 * TODO(content): the Pennsylvania venues. Everything before the wedding is
 * somewhere around Allentown and Fogelsville; the exact halls are still to
 * come, and the venue list says so rather than naming a place that may move.
 */
export const EVENT_DAYS: EventDay[] = [
  {
    date: "14 November",
    weekday: "Saturday",
    events: [
      {
        slug: "engagement",
        name: "Engagement",
        themeKey: "pellikuthuru",
        theme: "Vintage",
        time: "11:30 AM – 1:00 PM",
        venue: {
          name: "To be announced",
          address: "Allentown / Fogelsville, Pennsylvania",
        },
        start: ET(10, 14, 11, 30),
        end: ET(10, 14, 13, 0),
      },
    ],
  },
  {
    date: "19 November",
    weekday: "Thursday",
    events: [
      {
        slug: "mehendi-sangeet",
        name: "Mehendi & Sangeet",
        themeKey: "mehendi",
        theme: "Colour & Music",
        time: "6:00 PM – 10:00 PM",
        venue: {
          name: "To be announced",
          address: "Allentown / Fogelsville, Pennsylvania",
        },
        start: ET(10, 19, 18, 0),
        end: ET(10, 19, 22, 0),
      },
    ],
  },
  {
    date: "20 November",
    weekday: "Friday",
    events: [
      {
        slug: "haldi",
        name: "Haldi",
        themeKey: "carnival",
        theme: "Carnival",
        time: "9:00 AM – 12:00 PM",
        venue: {
          name: "To be announced",
          address: "Allentown / Fogelsville, Pennsylvania",
        },
        start: ET(10, 20, 9, 0),
        end: ET(10, 20, 12, 0),
      },
      {
        slug: "home-ceremony",
        name: "Bride & Groom Home Ceremony",
        themeKey: "pellikoduku",
        theme: "Traditional",
        time: "12:00 PM – 2:00 PM",
        // Straight after the haldi, in the same place.
        followsPrevious: true,
        sharesVenueWithPrevious: true,
        venue: {
          name: "To be announced",
          address: "Allentown / Fogelsville, Pennsylvania",
        },
        start: ET(10, 20, 12, 0),
        end: ET(10, 20, 14, 0),
      },
    ],
  },
  {
    date: "21 November",
    weekday: "Saturday",
    events: [
      {
        slug: "wedding",
        name: "Wedding",
        themeKey: "telugu",
        theme: "Traditional",
        time: "Muhurtham: 11:36 AM",
        invitation: {
          lead: "We cordially invite you to the wedding ceremony of",
          parties: [
            {
              name: "Bijay", // TODO(content): full name
              parents: "", // TODO(content): S/o …
            },
            {
              name: "Shivani", // TODO(content): full name
              parents: "", // TODO(content): D/o …
            },
          ],
        },
        venue: {
          // TODO(content): confirm the temple's full name and address.
          name: "Bridgewater Temple",
          address: "Bridgewater, New Jersey",
          mapsQuery: "Hindu temple, Bridgewater, New Jersey",
        },
        start: ET(10, 21, 11, 36),
        end: ET(10, 21, 14, 0),
      },
    ],
  },
];

/**
 * Hotels near the celebrations. Found by name rather than by a stored URL:
 * a Maps search resolves to the place page — address, photos, reviews and
 * booking links — and cannot rot the way a copied URL can.
 *
 * A booking link is the one exception, and it is stored because it has to be:
 * it is not a place, it is our group's rate, and nothing but that exact URL
 * will find it.
 */
export type Hotel = {
  /** The full name, which is what finds the right place on the map. */
  name: string;
  /**
   * What the row shows. Every one of these hotels is in Huntersville, minutes
   * from Lake Norman, so each full name ends in some arrangement of those two
   * words — repeated down a list they stop telling a guest anything and only
   * wrap each row onto a second line. The copy says where they are once.
   */
  label: string;
  /**
   * Where we hold a rate, the row books instead of pointing at a map — the
   * discount only applies through this link, so sending a guest to the hotel's
   * own site would quietly cost them money.
   */
  booking?: { url: string; deadline: Date };
};

// The hotel holding our rate leads, so the discount is the first thing read
// rather than something found four rows down.
export const HOTELS: Hotel[] = [
  {
    name: "Courtyard by Marriott Charlotte Lake Norman",
    label: "Courtyard by Marriott",
    booking: {
      url: "https://app.marriott.com/resview2?id=1788463710453&key=GRP&app=resvlink",
      deadline: ET(9, 14, 23, 59),
    },
  },
  { name: "Four Points by Sheraton Charlotte - Lake Norman", label: "Four Points by Sheraton" },
  { name: "Comfort Suites Huntersville near Lake Norman", label: "Comfort Suites" },
  { name: "Best Western Plus Huntersville Inn", label: "Best Western Plus" },
  {
    name: "SpringHill Suites by Marriott Charlotte Huntersville",
    label: "SpringHill Suites by Marriott",
  },
];

/**
 * The booking deadline in words, so the copy and the row cannot disagree.
 *
 * Formatted in Eastern time rather than the reader's: a guest booking from
 * India should see the date the hotel means, not the one their own midnight
 * happens to fall on.
 */
export const bookByLabel = (deadline: Date): string =>
  deadline.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "America/New_York",
  });

export const hotelHref = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

/** Directions link, or null while the venue is still unconfirmed. */
export function venueMapsHref(venue: Venue): string | null {
  if (venue.mapsUrl) return venue.mapsUrl;
  if (venue.mapsQuery)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
  return null;
}

export const EVENTS: WeddingEvent[] = EVENT_DAYS.flatMap((day) => day.events);


export const FULL_WEDDING_CAL = {
  title: `${COUPLE_AND} — Wedding Celebrations`,
  description: `Celebrations for the wedding of ${COUPLE_AND}. Muhurtham on 21 November at 11:36 AM.`,
  location: WEDDING_PLACE,
  startUtc: ET(10, 14, 11, 30).toISOString(),
  endUtc: ET(10, 21, 14, 0).toISOString(),
};

export type DetailIcon = "bed" | "plane" | "camera" | "pin";

// TODO(content): shuttle timings still need to be filled in by the couple —
// the copy below says so plainly rather than promising details that may not
// arrive.
export const DETAIL_CARDS: {
  title: string;
  icon: DetailIcon;
  body: string;
  /** Appends the full venue list, with directions, under the copy. */
  venues?: boolean;
  /** Appends the shared photo folders under the copy. */
  gallery?: boolean;
  /** Appends the nearby hotels under the copy. */
  hotels?: boolean;
}[] = [
  {
    title: "Accommodation",
    icon: "bed",
    body: "Our favourite places to stay, all in Huntersville and a few minutes from the celebrations. We'd love for everyone to be nearby.",
    hotels: true,
  },
  {
    title: "Travel",
    icon: "plane",
    body: "Charlotte Douglas International (CLT) is the closest airport and the easiest arrival for almost everyone. It's a major hub, so most guests will find a direct flight.\n\nFrom the airport it's roughly half an hour to the venues, traffic depending. Rental cars, Uber and Lyft are all easy to find at CLT, and we'd suggest a car — the venues are a little spread out and not walkable from one another.",
  },
  {
    title: "Gallery",
    icon: "camera",
    body: "Every celebration has its own shared folder. Add the photos you take, and look through everyone else's.",
    gallery: true,
  },
  {
    title: "Venues",
    icon: "pin",
    body: "Where each celebration is held. Tap any address for directions.",
    venues: true,
  },
];
