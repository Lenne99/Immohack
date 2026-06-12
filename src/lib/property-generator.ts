import type { Property } from "@/data/mock-properties";
import { calculateDealScore } from "./scoring";

// Realistic German real estate data pools
const PORTALS = ["ImmobilienScout24", "Immowelt", "Immonet", "Kleinanzeigen"];

const APT_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
];

const CITY_DATA: Record<string, { lat: number; lng: number; zip: string[]; pricePerSqm: [number, number]; rentPerSqm: [number, number] }> = {
  Leipzig:    { lat: 51.34, lng: 12.37, zip: ["04103", "04105", "04109", "04229", "04317"], pricePerSqm: [1800, 2800], rentPerSqm: [9, 13] },
  Dresden:    { lat: 51.05, lng: 13.74, zip: ["01067", "01069", "01097", "01169", "01277"], pricePerSqm: [2000, 3200], rentPerSqm: [10, 14] },
  Erfurt:     { lat: 50.98, lng: 11.03, zip: ["99084", "99086", "99089", "99094", "99099"], pricePerSqm: [1600, 2500], rentPerSqm: [8, 12] },
  Halle:      { lat: 51.48, lng: 11.97, zip: ["06108", "06110", "06112", "06114", "06118"], pricePerSqm: [1200, 2000], rentPerSqm: [7, 11] },
  Rostock:    { lat: 54.09, lng: 12.10, zip: ["18055", "18057", "18059", "18069", "18106"], pricePerSqm: [2200, 3400], rentPerSqm: [10, 14] },
  Cottbus:    { lat: 51.76, lng: 14.33, zip: ["03042", "03044", "03046", "03048", "03050"], pricePerSqm: [1000, 1800], rentPerSqm: [6, 10] },
  Chemnitz:   { lat: 50.83, lng: 12.92, zip: ["09111", "09113", "09116", "09119", "09120"], pricePerSqm: [900, 1700], rentPerSqm: [6, 10] },
  Magdeburg:  { lat: 52.13, lng: 11.62, zip: ["39104", "39106", "39108", "39110", "39112"], pricePerSqm: [1400, 2200], rentPerSqm: [8, 12] },
  Potsdam:    { lat: 52.40, lng: 13.06, zip: ["14467", "14469", "14471", "14473", "14476"], pricePerSqm: [3500, 5000], rentPerSqm: [14, 18] },
  Gera:       { lat: 50.88, lng: 12.08, zip: ["07545", "07546", "07548", "07549", "07551"], pricePerSqm: [700, 1400], rentPerSqm: [5, 9] },
  Hannover:   { lat: 52.37, lng: 9.73,  zip: ["30159", "30161", "30163", "30169", "30173"], pricePerSqm: [2500, 3800], rentPerSqm: [11, 15] },
  Nürnberg:   { lat: 49.45, lng: 11.08, zip: ["90402", "90403", "90408", "90419", "90429"], pricePerSqm: [3000, 4500], rentPerSqm: [12, 16] },
};

const STREET_POOLS: Record<string, string[]> = {
  Leipzig:   ["Karl-Liebknecht-Str.", "Südstraße", "Zschochersche Str.", "Connewitzer Str.", "Demmeringstraße"],
  Dresden:   ["Prager Str.", "Bürgerwiese", "Fetscherstraße", "Tolkewitzer Str.", "Loschwitzer Str."],
  Erfurt:    ["Anger", "Juri-Gagarin-Ring", "Schlösserstraße", "Futterstraße", "Marktstraße"],
  Halle:     ["Merseburger Str.", "Geiststraße", "Rannischer Platz", "Leninstraße", "Böllberger Weg"],
  Rostock:   ["Kröpeliner Str.", "Lagerstraße", "Barnstorfer Weg", "Doberaner Str.", "Warnowallee"],
  Cottbus:   ["Bahnhofstraße", "Spremberger Str.", "Karl-Marx-Str.", "Thiemstraße", "Brandenburger Platz"],
  Chemnitz:  ["Bahnhofstraße", "Reichsstraße", "Schloßstraße", "Brückenstraße", "Goethestraße"],
  Magdeburg: ["Breiter Weg", "Hasselbachstraße", "Olvenstedter Str.", "Berliner Chaussee", "Große Diesdorfer Str."],
  Potsdam:   ["Friedrich-Ebert-Str.", "Brandenburger Str.", "Hegelallee", "Zeppelinstraße", "Rudolf-Breitscheid-Str."],
  Gera:      ["Sorge", "Heinrichstraße", "Debschwitzer Str.", "Gagarinstraße", "Greizer Str."],
  Hannover:  ["Bahnhofstraße", "Liststraße", "Podbielskistraße", "Vahrenwalder Str.", "Deisterstraße"],
  Nürnberg:  ["Königstraße", "Fürther Str.", "Zollhausstraße", "Rothenburger Str.", "Rathenauplatz"],
};

const TITLE_TEMPLATES = [
  (rooms: number, city: string) => `${rooms}-Zimmer Eigentumswohnung in ${city} – top Lage`,
  (rooms: number, city: string) => `Vermietete ${rooms}-ZKB in ${city} – sofort Cashflow`,
  (rooms: number, city: string) => `Attraktives Investment: ${rooms}-Zi. ETW in ${city}`,
  (rooms: number, city: string) => `${rooms}-Raum-Wohnung in ${city} – Renditestar`,
  (rooms: number, city: string) => `Gepflegte ETW ${rooms} Zimmer in ${city} – vollvermietet`,
  (rooms: number, city: string) => `${rooms}-ZKB Altbau in ${city} – hohe Nachfrage`,
];

const HIGHLIGHT_TEMPLATES = [
  (yield_: number) => `${yield_.toFixed(1)}% Bruttorendite – deutlich über Marktschnitt`,
  (yield_: number) => `Sofort vermietet · ${yield_.toFixed(1)}% Rendite · kein Leerstand`,
  (yield_: number) => `Wachstumsmarkt mit ${yield_.toFixed(1)}% Bruttorendite`,
  (yield_: number) => `Vollvermietet · ${yield_.toFixed(1)}% Rendite · niedrige Nebenkosten`,
  (yield_: number) => `${yield_.toFixed(1)}% Rendite · solider Altbau · Mietsteigerung möglich`,
];

function rnd(min: number, max: number, decimals = 0) {
  const v = Math.random() * (max - min) + min;
  return decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTwo<T>(arr: T[]): T[] {
  const idx1 = Math.floor(Math.random() * arr.length);
  let idx2 = Math.floor(Math.random() * (arr.length - 1));
  if (idx2 >= idx1) idx2++;
  return [arr[idx1], arr[idx2]];
}

let counter = 1000;

export function generateProperty(): Property {
  counter++;
  const city = pick(Object.keys(CITY_DATA));
  const cityData = CITY_DATA[city];
  const portal = pick(PORTALS);

  const area = rnd(40, 120);
  const rooms = area < 55 ? 2 : area < 80 ? 3 : area < 100 ? 4 : 5;
  const yearBuilt = pick([1930, 1958, 1965, 1972, 1982, 1989, 1995, 2003, 2010, 2015]);

  const pricePerSqm = rnd(cityData.pricePerSqm[0], cityData.pricePerSqm[1]);
  const price = Math.round((pricePerSqm * area) / 1000) * 1000;

  const rentPerSqm = rnd(cityData.rentPerSqm[0], cityData.rentPerSqm[1], 1);
  const monthlyRent = Math.round(rentPerSqm * area);
  const grossYield = (monthlyRent * 12) / price * 100;

  // Only generate deals with decent yield (USP: nur gute Deals)
  if (grossYield < 5.5) return generateProperty();

  const hausgeld = rnd(150, 350);
  const management = monthlyRent * 0.08;
  const maintenance = price * 0.01 / 12;
  const vacancy = monthlyRent * 0.05;

  const loanAmount = price * 0.8;
  const monthlyRate = (loanAmount * 0.035) / 12;
  const monthlyRepayment = loanAmount * 0.02 / 12;
  const totalLoanCost = monthlyRate + monthlyRepayment;

  const netIncome = monthlyRent - hausgeld - management - maintenance - vacancy;
  const cashflow = Math.round(netIncome - totalLoanCost);
  const netYield = (netIncome * 12) / price * 100;

  const locationScore = rnd(55, 90);
  const renovationRisk = yearBuilt < 1975 ? rnd(30, 60) : rnd(10, 35);
  const marketDeviation = rnd(-15, 5);

  const rentabilityScore = Math.min(100, grossYield * 10);
  const avgCityPricePerSqm = cityData.pricePerSqm[0] + (cityData.pricePerSqm[1] - cityData.pricePerSqm[0]) * 0.5;

  const scoreResult = calculateDealScore({
    grossYield,
    netYield,
    cashflow,
    marketDeviation,
    locationScore,
    renovationRisk,
    rentabilityScore,
    pricePerSqm,
    avgCityPricePerSqm,
  });

  // Only keep quality deals
  if (scoreResult.dealScore < 75) return generateProperty();

  const streets = STREET_POOLS[city] ?? ["Hauptstraße"];
  const street = pick(streets);
  const houseNr = rnd(1, 120);
  const zip = pick(cityData.zip);

  const titleFn = pick(TITLE_TEMPLATES);
  const highlightFn = pick(HIGHLIGHT_TEMPLATES);

  const id = `crawled-${counter}`;
  const externalId = `${portal.toLowerCase().replace(/\s/g, "")}-${Date.now()}-${counter}`;

  let portalUrl = "#";
  if (portal === "ImmobilienScout24") portalUrl = `https://www.immobilienscout24.de/expose/${counter}`;
  else if (portal === "Immowelt") portalUrl = `https://www.immowelt.de/expose/${counter}`;
  else if (portal === "Immonet") portalUrl = `https://www.immonet.de/angebot/${counter}`;
  else if (portal === "Kleinanzeigen") portalUrl = `https://www.kleinanzeigen.de/s-anzeige/${counter}`;

  return {
    id,
    externalId,
    portal,
    title: titleFn(rooms, city),
    type: "APARTMENT",
    price,
    pricePerSqm,
    area,
    landArea: null,
    rooms,
    yearBuilt,
    energyClass: pick(["C", "D", "E", "F"]),
    heatingType: pick(["Zentralheizung", "Fernwärme", "Gasheizung", "Ölheizung"]),
    address: `${street} ${houseNr}`,
    city,
    zipCode: zip,
    lat: cityData.lat + (Math.random() - 0.5) * 0.05,
    lng: cityData.lng + (Math.random() - 0.5) * 0.05,
    description: `Gut vermietete Eigentumswohnung in ${city}. ${rooms} Zimmer auf ${area} m². Baujahr ${yearBuilt}. Solide Rendite bei geringem Leerstandsrisiko.`,
    monthlyRent,
    hausgeld,
    images: pickTwo(APT_IMAGES),
    highlight: highlightFn(grossYield),
    createdAt: new Date().toISOString(),
    analysis: {
      dealScore: scoreResult.dealScore,
      cashflow,
      grossYield: Math.round(grossYield * 10) / 10,
      netYield: Math.round(netYield * 10) / 10,
      cashOnCash: Math.round((cashflow * 12) / (price * 0.2) * 100 * 10) / 10,
      irr: Math.round(netYield * 1.1 * 10) / 10,
      roi: Math.round(netYield * 10) / 10,
      purchaseCostsTotal: Math.round(price * 0.12),
      locationScore,
      rentabilityScore: Math.min(100, Math.round(grossYield * 10)),
      renovationRisk,
      marketDeviation,
      priceAssessment: marketDeviation < -10 ? "Sehr günstig" : marketDeviation < 0 ? "Günstig" : "Marktpreis",
      yieldScore: scoreResult.yieldScore,
      valueScore: scoreResult.valueScore,
      riskScore: scoreResult.riskScore,
      aiReport: `Diese Immobilie in ${city} überzeugt mit ${grossYield.toFixed(1)}% Bruttorendite und einem Cashflow von ${cashflow > 0 ? "+" : ""}${cashflow} €/Monat nach Finanzierung. Der Standort zeigt solide Fundamentaldaten.`,
      recommendation: cashflow > 0 ? "Kaufen" : "Prüfen",
      prognosis: {
        pessimistic: { year1: Math.round(price * 0.98), year5: Math.round(price * 0.95), year10: Math.round(price * 0.92) },
        realistic:   { year1: Math.round(price * 1.03), year5: Math.round(price * 1.18), year10: Math.round(price * 1.38) },
        optimistic:  { year1: Math.round(price * 1.06), year5: Math.round(price * 1.32), year10: Math.round(price * 1.65) },
      },
      infrastructure: {
        schools: rnd(1, 5), doctors: rnd(2, 8), supermarkets: rnd(1, 6),
        trainStation: rnd(200, 1500), highway: rnd(1, 15), parks: rnd(1, 4),
      },
      macroData: {
        populationGrowth: rnd(-5, 25, 1) / 10,
        avgIncome: rnd(1800, 3200),
        unemploymentRate: rnd(30, 90, 1) / 10,
        vacancyRate: rnd(10, 50, 1) / 10,
      },
    },
  };
}

export function generateBatch(count: number): Property[] {
  const results: Property[] = [];
  let attempts = 0;
  while (results.length < count && attempts < count * 5) {
    attempts++;
    try {
      results.push(generateProperty());
    } catch {}
  }
  return results;
}
