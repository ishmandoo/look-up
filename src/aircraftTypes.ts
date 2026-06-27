export type AircraftCategory =
  | "narrowbody"
  | "widebody-twin"
  | "widebody-quad"
  | "regional-jet"
  | "turboprop"
  | "ga-single"
  | "helicopter"
  | "unknown";

// ICAO type designator -> category. Not exhaustive, covers the common types
// likely to be seen overhead; falls back to "unknown" otherwise.
const TYPE_MAP: Record<string, AircraftCategory> = {
  // narrowbody twinjets
  A318: "narrowbody", A319: "narrowbody", A320: "narrowbody", A321: "narrowbody",
  A19N: "narrowbody", A20N: "narrowbody", A21N: "narrowbody",
  B731: "narrowbody", B732: "narrowbody", B733: "narrowbody", B734: "narrowbody",
  B735: "narrowbody", B736: "narrowbody", B737: "narrowbody", B738: "narrowbody",
  B739: "narrowbody", B38M: "narrowbody", B39M: "narrowbody", B3XM: "narrowbody",
  MD80: "narrowbody", MD90: "narrowbody",

  // widebody twinjets
  A330: "widebody-twin", A332: "widebody-twin", A333: "widebody-twin",
  A338: "widebody-twin", A339: "widebody-twin",
  A350: "widebody-twin", A35K: "widebody-twin",
  B767: "widebody-twin", B762: "widebody-twin", B763: "widebody-twin",
  B777: "widebody-twin", B772: "widebody-twin", B773: "widebody-twin", B77W: "widebody-twin", B77L: "widebody-twin",
  B787: "widebody-twin", B788: "widebody-twin", B789: "widebody-twin", B78X: "widebody-twin",

  // widebody quads
  A340: "widebody-quad", A346: "widebody-quad",
  A380: "widebody-quad", A388: "widebody-quad",
  B747: "widebody-quad", B744: "widebody-quad", B748: "widebody-quad",

  // regional jets / turboprops
  CRJ2: "regional-jet", CRJ7: "regional-jet", CRJ9: "regional-jet", CRJX: "regional-jet",
  E135: "regional-jet", E145: "regional-jet", E170: "regional-jet", E175: "regional-jet",
  E190: "regional-jet", E195: "regional-jet", E75L: "regional-jet", E75S: "regional-jet",
  AT72: "turboprop", AT45: "turboprop", AT76: "turboprop", DH8A: "turboprop", DH8D: "turboprop",
  SF34: "turboprop", B350: "turboprop",

  // general aviation
  C172: "ga-single", C152: "ga-single", C182: "ga-single", SR22: "ga-single", P28A: "ga-single",
  PA28: "ga-single", PA34: "ga-single", BE36: "ga-single", M20P: "ga-single",

  // helicopters
  R44: "helicopter", R66: "helicopter", EC35: "helicopter", EC30: "helicopter",
  B06: "helicopter", AS50: "helicopter", H60: "helicopter",
};

export function categorize(icaoType: string | null | undefined): AircraftCategory {
  if (!icaoType) return "unknown";
  const key = icaoType.trim().toUpperCase();
  return TYPE_MAP[key] ?? "unknown";
}

export const CATEGORY_LABEL: Record<AircraftCategory, string> = {
  narrowbody: "Narrowbody jet",
  "widebody-twin": "Widebody twinjet",
  "widebody-quad": "Widebody quadjet",
  "regional-jet": "Regional jet",
  turboprop: "Turboprop",
  "ga-single": "Light aircraft",
  helicopter: "Helicopter",
  unknown: "Aircraft",
};
