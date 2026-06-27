import "./style.css";
import { getCurrentPosition, type LatLon } from "./geo";
import { fetchNearby, findNearest, type Aircraft } from "./airplanes";
import { categorize, CATEGORY_LABEL } from "./aircraftTypes";
import { silhouetteFor } from "./silhouettes";

const POLL_INTERVAL_MS = 25_000;
const SEARCH_RADIUS_NM = 10;
const NM_TO_KM = 1.852;

const app = document.querySelector<HTMLDivElement>("#app")!;

let location: LatLon | null = null;
let pollHandle: ReturnType<typeof setInterval> | null = null;

renderStatus("Finding your location…");
init();

async function init(): Promise<void> {
  try {
    location = await getCurrentPosition();
    startPolling();
  } catch {
    renderLocationDenied();
  }
}

function startPolling(): void {
  tick();
  if (pollHandle) clearInterval(pollHandle);
  pollHandle = setInterval(tick, POLL_INTERVAL_MS);
}

async function tick(): Promise<void> {
  if (!location) return;
  try {
    const nearby = await fetchNearby(location, SEARCH_RADIUS_NM);
    const nearest = findNearest(nearby);
    if (!nearest) {
      renderEmpty();
      return;
    }
    renderAircraft(nearest);
  } catch {
    renderStatus("Couldn't reach flight data. Retrying…");
  }
}

function renderStatus(message: string): void {
  app.innerHTML = `<p class="status">${escapeHtml(message)}</p>`;
}

function renderEmpty(): void {
  app.innerHTML = `
    <div class="silhouette">${silhouetteFor("unknown")}</div>
    <p class="status">No plane overhead right now. Checking again shortly…</p>
  `;
}

function renderLocationDenied(): void {
  app.innerHTML = `
    <p class="status">
      Location access is needed to find the plane above you.
      Enable it in your browser settings, or enter coordinates manually.
    </p>
    <form class="manual-location" id="manual-form">
      <input type="number" step="any" placeholder="Latitude" id="manual-lat" required />
      <input type="number" step="any" placeholder="Longitude" id="manual-lon" required />
      <button type="submit">Go</button>
    </form>
  `;
  const form = document.querySelector<HTMLFormElement>("#manual-form")!;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lat = Number((document.querySelector<HTMLInputElement>("#manual-lat")!).value);
    const lon = Number((document.querySelector<HTMLInputElement>("#manual-lon")!).value);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      location = { lat, lon };
      startPolling();
    }
  });
}

function renderAircraft(aircraft: Aircraft): void {
  const category = categorize(aircraft.icaoType);
  const heading = aircraft.headingDeg ?? 0;
  const distanceKm = aircraft.distanceNm != null ? aircraft.distanceNm * NM_TO_KM : null;
  const typeLine = aircraft.description ?? aircraft.icaoType ?? CATEGORY_LABEL[category];

  app.innerHTML = `
    <div class="silhouette" style="transform: rotate(${heading}deg)">${silhouetteFor(category)}</div>
    <p class="callsign">${escapeHtml(aircraft.callsign ?? "Unknown callsign")}</p>
    <p class="category">${escapeHtml(typeLine)}${
      aircraft.registration ? ` · ${escapeHtml(aircraft.registration)}` : ""
    }</p>
    ${aircraft.owner ? `<p class="route">${escapeHtml(aircraft.owner)}</p>` : ""}
    <div class="info-grid">
      ${infoCell("Altitude", aircraft.altitudeFt != null ? `${aircraft.altitudeFt.toLocaleString()} ft` : "—")}
      ${infoCell("Speed", aircraft.groundSpeedKt != null ? `${Math.round(aircraft.groundSpeedKt)} kt` : "—")}
      ${infoCell("Heading", aircraft.headingDeg != null ? `${Math.round(aircraft.headingDeg)}°` : "—")}
      ${infoCell("Distance", distanceKm != null ? `${distanceKm.toFixed(1)} km` : "—")}
    </div>
    <p class="refresh-note">Updates every ${POLL_INTERVAL_MS / 1000}s</p>
  `;
}

function infoCell(label: string, value: string): string {
  return `
    <div class="info-cell">
      <div class="info-label">${escapeHtml(label)}</div>
      <div class="info-value">${escapeHtml(value)}</div>
    </div>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
