export const FLIGHTS: Record<string, { to: string; date: string }[]> = {
  BWI: [
    { to: "THU", date: "2025-10-01T00:00:00Z" },
    { to: "WRI", date: "2025-10-03T00:00:00Z" },
    { to: "RMS", date: "2025-10-08T00:00:00Z" },
    { to: "THU", date: "2025-10-08T00:00:00Z" },
    { to: "WRI", date: "2025-10-10T00:00:00Z" },
    { to: "RMS", date: "2025-10-14T00:00:00Z" },
    { to: "KWI", date: "2025-10-14T00:00:00Z" },
    { to: "XJD", date: "2025-10-14T00:00:00Z" },
    { to: "RMS", date: "2025-10-15T00:00:00Z" },
    { to: "THU", date: "2025-10-15T00:00:00Z" },
    { to: "WRI", date: "2025-10-17T00:00:00Z" },
    { to: "RMS", date: "2025-10-22T00:00:00Z" },
    { to: "THU", date: "2025-10-22T00:00:00Z" },
    { to: "WRI", date: "2025-10-24T00:00:00Z" },
    { to: "RMS", date: "2025-10-29T00:00:00Z" },
    { to: "THU", date: "2025-10-29T00:00:00Z" },
  ],
  SUU: [
    { to: "HIK", date: "2025-10-11T00:00:00Z" },
    { to: "HIK", date: "2025-10-25T00:00:00Z" },
  ],
  NIP: [
    { to: "NBW", date: "2025-10-03T00:00:00Z" },
    { to: "NBW", date: "2025-10-10T00:00:00Z" },
    { to: "NBW", date: "2025-10-17T00:00:00Z" },
    { to: "NBW", date: "2025-10-24T00:00:00Z" },
    { to: "NBW", date: "2025-10-31T00:00:00Z" },
  ],
};

export const AIRPORTS: Record<
  string,
  { name: string; lat: number; long: number }
> = {
  ADW: { name: "Joint Base Andrews", lat: 38.8108, long: -76.8669 },
  CHS: { name: "Charleston Air Force Base", lat: 32.8986, long: -80.0405 },
  TCM: { name: "McChord Air Force Base", lat: 47.1377, long: -122.4765 },
  WRI: {
    name: "Joint Base McGuire-Dix-Lakehurst",
    lat: 40.0156,
    long: -74.5917,
  },
  LRF: { name: "Little Rock Air Force Base", lat: 34.9169, long: -92.1497 },
  MCF: { name: "MacDill Air Force Base", lat: 27.8493, long: -82.5212 },
  NIP: { name: "NAS Jacksonville", lat: 30.2358, long: -81.6806 },
  NGU: { name: "NAS Norfolk", lat: 36.9376, long: -76.2893 },
  POB: { name: "Pope Army Airfield", lat: 35.1709, long: -79.0145 },
  BLV: { name: "Scott Air Force Base", lat: 38.545, long: -89.8352 },
  IAB: { name: "McConnell Air Force Base", lat: 37.6231, long: -97.2682 },
  SEA: {
    name: "Seattle–Tacoma International Airport",
    lat: 47.4489,
    long: -122.3094,
  },
  SUU: { name: "Travis Air Force Base", lat: 38.2627, long: -121.927 },
  SKA: { name: "Fairchild Air Force Base", lat: 47.6151, long: -117.655 },
  DOV: { name: "Dover Air Force Base", lat: 39.1295, long: -75.466 },
  THU: { name: "Pituffik Space Base (Thule)", lat: 76.5312, long: -68.7032 },
  RMS: { name: "Ramstein Air Base", lat: 49.4369, long: 7.6003 },
  KWI: { name: "Kuwait International Airport", lat: 29.2266, long: 47.9689 },
  XJD: { name: "Al Udeid Air Base", lat: 25.1174, long: 51.3223 },
  HIK: {
    name: "Joint Base Pearl Harbor–Hickam",
    lat: 21.3187,
    long: -157.9225,
  },
  NBW: {
    name: "Guantánamo Bay Naval Station",
    lat: 19.90639,
    long: -75.2071,
  },
};
