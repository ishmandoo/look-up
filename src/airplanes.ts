import type { LatLon } from "./geo";

export interface Aircraft {
  hex: string;
  callsign: string | null;
  registration: string | null;
  icaoType: string | null;
  description: string | null;
  owner: string | null;
  altitudeFt: number | null;
  groundSpeedKt: number | null;
  headingDeg: number | null;
  distanceNm: number | null;
  bearingDeg: number | null;
  lat: number | null;
  lon: number | null;
}

// airplanes.live returns aircraft within `radiusNm` of a point, already
// enriched with type/registration/owner and pre-computed distance + bearing.
// It also sends `Access-Control-Allow-Origin: *`, so it can be called
// directly from the browser with no proxy.
const BASE = "https://api.airplanes.live/v2/point";

interface RawAircraft {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  desc?: string;
  ownOp?: string;
  alt_baro?: number | "ground";
  gs?: number;
  track?: number;
  dst?: number;
  dir?: number;
  lat?: number;
  lon?: number;
}

interface ApiResponse {
  ac?: RawAircraft[];
}

export async function fetchNearby(center: LatLon, radiusNm = 10): Promise<Aircraft[]> {
  const url = `${BASE}/${center.lat.toFixed(4)}/${center.lon.toFixed(4)}/${radiusNm}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`airplanes.live request failed: ${res.status}`);
  }
  const data = (await res.json()) as ApiResponse;
  return (data.ac ?? []).map(normalize);
}

function normalize(raw: RawAircraft): Aircraft {
  return {
    hex: (raw.hex ?? "").trim(),
    callsign: raw.flight?.trim() || null,
    registration: raw.r?.trim() || null,
    icaoType: raw.t?.trim() || null,
    description: raw.desc?.trim() || null,
    owner: raw.ownOp?.trim() || null,
    altitudeFt: typeof raw.alt_baro === "number" ? raw.alt_baro : null,
    groundSpeedKt: raw.gs ?? null,
    headingDeg: raw.track ?? null,
    distanceNm: raw.dst ?? null,
    bearingDeg: raw.dir ?? null,
    lat: raw.lat ?? null,
    lon: raw.lon ?? null,
  };
}

// Pick the airborne aircraft closest to the observer. The API already
// provides `dst`; fall back to ordering by presence of a distance value.
export function findNearest(aircraft: Aircraft[]): Aircraft | null {
  const airborne = aircraft.filter((a) => a.altitudeFt !== null && a.distanceNm !== null);
  if (airborne.length === 0) return null;
  return airborne.reduce((best, a) =>
    (a.distanceNm ?? Infinity) < (best.distanceNm ?? Infinity) ? a : best,
  );
}
