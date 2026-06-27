import type { AircraftCategory } from "./aircraftTypes";

// Simple top-down silhouettes, nose pointing up (+y is down the page),
// viewBox 0 0 200 200. Heading rotation is applied via CSS transform.
// Built from three overlapping polygons: fuselage, wings, tail.

function fuselage(noseY: number, tailY: number, halfWidth: number): string {
  const midY = (noseY + tailY) / 2;
  return `<polygon points="100,${noseY} ${100 + halfWidth},${midY} ${100 + halfWidth * 0.7},${tailY} 100,${tailY + 6} ${100 - halfWidth * 0.7},${tailY} ${100 - halfWidth},${midY}" />`;
}

function wings(wingY: number, halfSpan: number, chord: number): string {
  return `<polygon points="100,${wingY} ${100 + halfSpan},${wingY + chord} ${100 + halfSpan * 0.4},${wingY + chord * 1.6} ${100 - halfSpan * 0.4},${wingY + chord * 1.6} ${100 - halfSpan},${wingY + chord} 100,${wingY}" />`;
}

function tailplane(tailY: number, halfSpan: number): string {
  return `<polygon points="100,${tailY - 14} ${100 + halfSpan},${tailY + 6} ${100 + halfSpan * 0.3},${tailY + 14} ${100 - halfSpan * 0.3},${tailY + 14} ${100 - halfSpan},${tailY + 6} 100,${tailY - 14}" />`;
}

function jet(opts: { wingY: number; halfSpan: number; chord: number; tailHalfSpan: number; fuselageHalfWidth: number; tailY: number }): string {
  return `
    ${fuselage(8, opts.tailY, opts.fuselageHalfWidth)}
    ${wings(opts.wingY, opts.halfSpan, opts.chord)}
    ${tailplane(opts.tailY, opts.tailHalfSpan)}
  `;
}

const NARROWBODY = svg(jet({ wingY: 100, halfSpan: 80, chord: 26, tailHalfSpan: 26, fuselageHalfWidth: 12, tailY: 178 }));

const WIDEBODY_TWIN = svg(`
  ${jet({ wingY: 96, halfSpan: 92, chord: 30, tailHalfSpan: 32, fuselageHalfWidth: 16, tailY: 180 })}
  <circle cx="58" cy="118" r="7" />
  <circle cx="142" cy="118" r="7" />
`);

const WIDEBODY_QUAD = svg(`
  ${jet({ wingY: 96, halfSpan: 92, chord: 30, tailHalfSpan: 32, fuselageHalfWidth: 16, tailY: 180 })}
  <circle cx="46" cy="112" r="6" />
  <circle cx="70" cy="122" r="6" />
  <circle cx="130" cy="122" r="6" />
  <circle cx="154" cy="112" r="6" />
`);

const REGIONAL_JET = svg(jet({ wingY: 92, halfSpan: 58, chord: 20, tailHalfSpan: 20, fuselageHalfWidth: 9, tailY: 170 }));

const TURBOPROP = svg(`
  ${fuselage(10, 178, 8)}
  ${wings(86, 76, 16)}
  ${tailplane(178, 20)}
  <circle cx="50" cy="90" r="9" />
  <circle cx="150" cy="90" r="9" />
`);

const GA_SINGLE = svg(`
  ${fuselage(14, 175, 6)}
  ${wings(92, 50, 12)}
  ${tailplane(175, 16)}
`);

const HELICOPTER = svg(`
  <ellipse cx="100" cy="118" rx="18" ry="36" />
  <rect x="98" y="150" width="4" height="32" />
  <rect x="92" y="178" width="16" height="6" />
  <rect x="18" y="64" width="164" height="5" rx="2.5" />
  <circle cx="100" cy="66" r="6" />
`);

const UNKNOWN = svg(jet({ wingY: 98, halfSpan: 74, chord: 24, tailHalfSpan: 24, fuselageHalfWidth: 11, tailY: 176 }));

function svg(content: string): string {
  return `<svg viewBox="0 0 200 200" fill="currentColor">${content}</svg>`;
}

const SILHOUETTES: Record<AircraftCategory, string> = {
  narrowbody: NARROWBODY,
  "widebody-twin": WIDEBODY_TWIN,
  "widebody-quad": WIDEBODY_QUAD,
  "regional-jet": REGIONAL_JET,
  turboprop: TURBOPROP,
  "ga-single": GA_SINGLE,
  helicopter: HELICOPTER,
  unknown: UNKNOWN,
};

export function silhouetteFor(category: AircraftCategory): string {
  return SILHOUETTES[category];
}
