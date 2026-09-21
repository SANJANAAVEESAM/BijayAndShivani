import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { COUPLE_AND, SHARE_DESCRIPTION, SITE_URL } from "@/components/wedding/data";
import backdrop from "../assets/backdrop.jpg";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      // What the phone paints outside the page: behind the status bar at the
      // top and the home indicator at the bottom. Left unset, iOS uses the
      // body's cream, which framed a cool photograph in two warm bands and
      // read as "the top and bottom are different" on every design we tried —
      // including, invisibly, in every screenshot, since headless Chrome draws
      // no browser chrome at all.
      { name: "theme-color", content: "#f8f3eb" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { title: COUPLE_AND },
      { name: "description", content: SHARE_DESCRIPTION },
      { property: "og:title", content: COUPLE_AND },
      { property: "og:description", content: SHARE_DESCRIPTION },
      { property: "og:type", content: "website" },
      // Absolute, and a purpose-made 1200x630 card rather than the portrait
      // photograph — sharing apps crop 1.91:1, and a portrait loses their faces.
      { property: "og:image", content: `${SITE_URL}/share.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: COUPLE_AND },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: COUPLE_AND },
      { name: "twitter:image", content: `${SITE_URL}/share.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      // Unlisted rather than private — see public/robots.txt.
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Shown when a guest adds the invitation to their phone's home screen.
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Cormorant+Infant:ital,wght@0,300;0,400;1,300;1,400&family=Karla:wght@300;400;500;600;700&family=Parisienne&family=Pinyon+Script&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        {/* Fixed backdrop behind every section. Negative z-index keeps it under
            the content but still above the body's cream, which is what the
            veil blends into. Toned, so it turns to colour with everything else
            when the guest reaches the switch. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <img
            src={backdrop}
            alt=""
            width={1000}
            height={1500}
            className="tone h-full w-full object-cover"
            // They stand left of middle in the original, so a symmetric crop
            // would leave the pair off-centre on a tall phone.
            style={{ opacity: 0.34, objectPosition: "34% center" }}
          />
          {/* Warm wash so type stays readable over the busiest parts */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--background) 62%, transparent) 0%, color-mix(in oklab, var(--background) 34%, transparent) 42%, color-mix(in oklab, var(--background) 66%, transparent) 100%)",
            }}
          />
        </div>

        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
