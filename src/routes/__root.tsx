import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <p className="display text-xs tracking-[0.3em] text-gold">Lost in Gotham</p>
        <h1 className="display mt-3 text-6xl text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          That page isn&apos;t on the menu.
        </p>
        <Link to="/" className="pill-gold mt-7 px-7 py-2.5 text-[11px]">
          Back Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-2xl text-gold">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Give it another shot — the kitchen&apos;s still open.
        </p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="pill-gold mt-7 px-7 py-2.5 text-[11px]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gotham Halal — Bold. Halal. Gotham." },
      {
        name: "description",
        content: "Halal smash burgers, fried chicken and wraps made fresh daily in Rochester, NY.",
      },
      { property: "og:site_name", content: "Gotham Halal" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/gotham-halal-logo.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Gotham Halal",
          servesCuisine: ["Halal", "American", "Burgers", "Fried Chicken", "Sandwiches"],
          slogan: "Bold. Halal. Gotham.",
          priceRange: "$$",
          hasMenu: "/menu",
          menu: "/menu",
          acceptsReservations: false,
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "11:00",
              closes: "22:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Friday", "Saturday"],
              opens: "11:00",
              closes: "23:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Sunday"],
              opens: "12:00",
              closes: "21:00",
            },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Rochester",
            addressRegion: "NY",
            addressCountry: "US",
          },
        }),
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
      <div className="relative min-h-screen flex flex-col">
        <SiteNav />
        <main className="flex-1 pt-20 md:pt-[88px]">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
