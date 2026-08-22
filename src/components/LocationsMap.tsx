import * as React from "react";
import { LOCATIONS, fullAddress, type Location } from "@/data/locations";

const MAPS_KEY = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
  | string
  | undefined;
const MAPS_CHANNEL = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
  | string
  | undefined;

/** Dark, gold-accented styling to match the brand. */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1b1b1b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9b9b9b" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2b2b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d3117" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#4a3a1a" }] },
];

function pinIcon(openSoon: boolean): google.maps.Symbol {
  return {
    path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
    fillColor: "#ED8901",
    fillOpacity: openSoon ? 0.55 : 1,
    strokeColor: openSoon ? "#ED8901" : "#0a0a0a",
    strokeWeight: openSoon ? 2.5 : 1.5,
    scale: 1,
    labelOrigin: new google.maps.Point(0, -30),
  };
}

function infoHtml(l: Location) {
  return `
    <div style="font-family:system-ui,sans-serif;color:#111;max-width:220px">
      <div style="font-weight:800;text-transform:uppercase;letter-spacing:.02em;font-size:13px">${l.shortName}</div>
      ${l.status === "opening_soon" ? '<div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#a55f00;margin-top:2px">Opening Soon</div>' : ""}
      <div style="font-size:12.5px;margin-top:6px;line-height:1.35">${fullAddress(l)}</div>
      ${l.findingNote ? `<div style="font-size:11.5px;margin-top:5px;line-height:1.35;color:#a55f00">${l.findingNote}</div>` : ""}
      <a href="${l.directionsUrl}" target="_blank" rel="noreferrer"
         style="display:inline-block;margin-top:8px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#a55f00">
        Get Directions
      </a>
    </div>`;
}

let mapsLoader: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if ((window as any).google?.maps) return Promise.resolve();
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise<void>((resolve, reject) => {
    (window as any).__gothamMapsReady = () => resolve();
    const s = document.createElement("script");
    const channel = MAPS_CHANNEL ? `&channel=${MAPS_CHANNEL}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&loading=async&callback=__gothamMapsReady${channel}`;
    s.async = true;
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return mapsLoader;
}

export function LocationsMap() {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // Lazy: only load the API once the map scrolls into view.
  React.useEffect(() => {
    const el = hostRef.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  React.useEffect(() => {
    if (!visible || !MAPS_KEY || !hostRef.current) return;
    let cancelled = false;

    loadMaps()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        const g = google.maps;
        const map = new g.Map(hostRef.current, {
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: "#111111",
        });

        const bounds = new g.LatLngBounds();
        const info = new g.InfoWindow();

        LOCATIONS.forEach((l) => {
          const position = { lat: l.lat, lng: l.lng };
          bounds.extend(position);
          const marker = new g.Marker({
            position,
            map,
            title: l.shortName,
            icon: pinIcon(l.status === "opening_soon"),
          });
          marker.addListener("click", () => {
            info.setContent(infoHtml(l));
            info.open({ map, anchor: marker });
          });
        });

        // Padding keeps both pins away from the edges.
        map.fitBounds(bounds, { top: 80, bottom: 80, left: 60, right: 60 });
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!MAPS_KEY || failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gold/25 bg-white/[0.03] p-10 text-center">
        <p className="text-sm text-white/70">Map unavailable right now.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {LOCATIONS.map((l) => (
            <a
              key={l.slug}
              href={l.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="pill-outline px-5 py-2 text-[11px]"
            >
              {l.shortName} Directions
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      role="application"
      aria-label="Map of Gotham Halal locations"
      className="h-[380px] w-full overflow-hidden rounded-2xl border border-gold/25 bg-ink md:h-[460px]"
    />
  );
}
