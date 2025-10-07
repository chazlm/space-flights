// src/airports.ts
export type Airport = {
  id: string;
  name: string;
  iata: string;
  lat: number;
  long: number;
  city: string;
  state: string;
};
export type Flight = {
  to: string;
  date: string; // could be Date, but using string for flexibility
};

export const airports: Airport[] = [
  {
    id: "BWI",
    name: "Baltimore-Washington International",
    iata: "BWI",
    lat: 39.17573,
    long: -76.66899,
    city: "Baltimore",
    state: "Maryland",
  },
  {
    id: "SUU",
    name: "Travis Air Force Base",
    iata: "SUU",
    lat: 38.2627,
    long: -121.927,
    city: "Fairfield",
    state: "California",
  },
  {
    id: "NIP",
    name: "NAS Jacksonville",
    iata: "NIP",
    lat: 30.2358,
    long: -81.6806,
    city: "Jacksonville",
    state: "Florida",
  },
];
