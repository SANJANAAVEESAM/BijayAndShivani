# Bijay & Shivani — wedding invitation

A single-page invitation: an envelope that opens, the couple's story, the
celebrations with their venues and dress codes, travel and accommodation, and
an RSVP.

Built on the same foundation as Lasya & Avyay's site — TanStack Start, React 19,
Tailwind v4, deployed on Vercel.

## Running it

```sh
npm install
npm run dev
```

## What still needs the couple

Everything personal was stripped when this repo was seeded, so nothing from the
previous wedding can reach a guest. Search for `TODO(content)` to find it all:

- **Names** — full names and both sets of parents, as they should be printed
- **Dates and venues** — `EVENT_DAYS` in `src/components/wedding/data.ts`
- **Photographs** — everything currently points at a placeholder:
  `src/assets/placeholder-portrait.png` (the backdrop, the hero, the three
  story photographs) and `public/share.png` (the link preview card)
- **The story** — `CHAPTERS` in `src/components/wedding/Microsite.tsx`
- **Contacts** — `CONTACTS` is empty, and that section hides itself until it
  is not
- **The domain** — `SITE_URL`, which link previews need in absolute form
- **Music** — `public/music/` still holds the previous site's track

The event artwork and scenery in `src/assets` are generic illustrations with no
identifiable faces, so they carry over deliberately.

## RSVP

Posts to a Google Apps Script endpoint set by `RSVP_WEBHOOK_URL`. See
[docs/rsvp-setup.md](docs/rsvp-setup.md).
