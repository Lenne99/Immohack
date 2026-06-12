import type { Property } from "@/data/mock-properties";

export type MassnahmeStatus = "pflicht" | "empfohlen" | "optional";
export type MassnahmePrioritaet = "hoch" | "mittel" | "niedrig";

export interface Massnahme {
  titel: string;
  beschreibung: string;
  status: MassnahmeStatus;
  prioritaet: MassnahmePrioritaet;
  kostenMin: number;
  kostenMax: number;
  kfwFoerderung: number;
  kfwProgramm: string;
  mietsteiggerungProJahr: number;
  zeitaufwandWochen: number;
  energiegewinn: number;
}

export interface SanierungsAnalyse {
  massnahmen: Massnahme[];
  gesamtkostenMin: number;
  gesamtkostenMax: number;
  foerderungMax: number;
  nettokosten: number;
  monatlicheUmlage: number;
  energieklasseNachSanierung: string;
  gesamtZeitaufwandWochen: number;
  sanierungsrisiko: "gering" | "mittel" | "hoch" | "sehr hoch";
}

const ENERGY_SCORE: Record<string, number> = { "A++": 1, "A+": 2, A: 3, B: 4, C: 5, D: 6, E: 7, F: 8, G: 9, H: 10 };
const ENERGY_FROM_SCORE: Record<number, string> = { 1: "A++", 2: "A+", 3: "A", 4: "B", 5: "C", 6: "D", 7: "E", 8: "F", 9: "G", 10: "H" };

export function analysiereSanierung(p: Property): SanierungsAnalyse {
  const massnahmen: Massnahme[] = [];
  const age = 2025 - p.yearBuilt;
  const eScore = ENERGY_SCORE[p.energyClass] ?? 6;
  const isOelGas = p.heatingType.toLowerCase().includes("öl") || p.heatingType.toLowerCase().includes("gas");
  const isFernwaerme = p.heatingType.toLowerCase().includes("fern");
  const area = p.area;

  if (isOelGas && !isFernwaerme) {
    const pflicht = p.yearBuilt < 1980 || p.heatingType.toLowerCase().includes("öl");
    const kostenMin = Math.round(area * 180);
    const kostenMax = Math.round(area * 280);
    massnahmen.push({ titel: "Heizungsanlage modernisieren", beschreibung: pflicht ? `${p.heatingType} muss gemäß GEG §72 ersetzt werden (Baujahr vor 1980 oder Ölheizung). Wärmepumpe oder Fernwärme empfohlen.` : `${p.heatingType} nähert sich dem Ende der Nutzungsdauer. Tausch auf Wärmepumpe senkt Betriebskosten und verbessert Energieklasse.`, status: pflicht ? "pflicht" : "empfohlen", prioritaet: pflicht ? "hoch" : "mittel", kostenMin, kostenMax, kfwFoerderung: 35, kfwProgramm: "BEG EM (Nr. 458) – bis 35% Zuschuss", mietsteiggerungProJahr: Math.round(kostenMin * 0.08), zeitaufwandWochen: 3, energiegewinn: 2 });
  }

  if (p.yearBuilt < 2002 && eScore >= 5) {
    const dachflaeche = area * 0.45;
    const kostenMin = Math.round(dachflaeche * 80);
    const kostenMax = Math.round(dachflaeche * 150);
    massnahmen.push({ titel: "Dachdämmung / oberste Geschossdecke", beschreibung: "Gebäude vor 2002 sind gemäß GEG §47 nachrüstpflichtig, sofern nicht bereits gedämmt. Dachdämmung reduziert Heizkosten um 15–25%.", status: p.yearBuilt < 1995 ? "pflicht" : "empfohlen", prioritaet: "mittel", kostenMin, kostenMax, kfwFoerderung: 15, kfwProgramm: "BEG EM (Nr. 458) – Einzelmaßnahme Dämmsystem", mietsteiggerungProJahr: Math.round(kostenMin * 0.08), zeitaufwandWochen: 2, energiegewinn: 1 });
  }

  if (p.yearBuilt < 1990) {
    const fensterAnzahl = Math.round(area / 10);
    const kostenMin = fensterAnzahl * 600;
    const kostenMax = fensterAnzahl * 1100;
    massnahmen.push({ titel: "Fenster & Außentüren erneuern", beschreibung: "Einfach- oder zweifachverglaste Fenster (typisch vor 1990) verursachen erhebliche Wärmeverluste. Dreifachverglasung senkt Heizkosten, erhöht Wohnkomfort und Vermietbarkeit.", status: eScore >= 7 ? "empfohlen" : "optional", prioritaet: eScore >= 7 ? "mittel" : "niedrig", kostenMin, kostenMax, kfwFoerderung: 15, kfwProgramm: "BEG EM (Nr. 458) – Fenster und Außentüren", mietsteiggerungProJahr: Math.round(kostenMin * 0.08), zeitaufwandWochen: 1, energiegewinn: 1 });
  }

  if (p.yearBuilt < 1970) {
    massnahmen.push({ titel: "Elektroinstallation erneuern", beschreibung: "Elektroanlagen vor 1970 entsprechen oft nicht mehr dem Stand der Technik und können Brandgefahr darstellen. Pflichtprüfung beim Kauf empfohlen.", status: "pflicht", prioritaet: "hoch", kostenMin: Math.round(area * 60), kostenMax: Math.round(area * 100), kfwFoerderung: 0, kfwProgramm: "Keine direkte KfW-Förderung", mietsteiggerungProJahr: 0, zeitaufwandWochen: 2, energiegewinn: 0 });
  }

  if (p.yearBuilt < 1985) {
    massnahmen.push({ titel: "Badezimmer modernisieren", beschreibung: "Veraltete Bäder reduzieren Vermietbarkeit und erzielbare Miete erheblich. Modernisierung ermöglicht Mieterhöhung nach §559 BGB.", status: "empfohlen", prioritaet: age > 40 ? "mittel" : "niedrig", kostenMin: 7000, kostenMax: 14000, kfwFoerderung: 0, kfwProgramm: "Ggf. KfW Nr. 159 (Altersgerecht Umbauen) bei Barrierefreiheit", mietsteiggerungProJahr: Math.round(7000 * 0.08), zeitaufwandWochen: 3, energiegewinn: 0 });
  }

  if (eScore >= 7 && p.type !== "APARTMENT") {
    const fassadenflaeche = area * 1.8;
    const kostenMin = Math.round(fassadenflaeche * 120);
    const kostenMax = Math.round(fassadenflaeche * 200);
    massnahmen.push({ titel: "Fassadendämmung (WDVS)", beschreibung: `Außendämmung ist bei Energieklasse ${p.energyClass} der effektivste Weg zur Energieklassenverbesserung.`, status: "empfohlen", prioritaet: "mittel", kostenMin, kostenMax, kfwFoerderung: 20, kfwProgramm: "BEG EM (Nr. 458) – Wärmedämmung Außenwand", mietsteiggerungProJahr: Math.round(kostenMin * 0.08), zeitaufwandWochen: 4, energiegewinn: 2 });
  }

  const gesamtkostenMin = massnahmen.reduce((s, m) => s + m.kostenMin, 0);
  const gesamtkostenMax = massnahmen.reduce((s, m) => s + m.kostenMax, 0);
  const foerderungMax = massnahmen.reduce((s, m) => s + Math.round(m.kostenMin * m.kfwFoerderung / 100), 0);
  const nettokosten = Math.max(0, gesamtkostenMin - foerderungMax);
  const monatlicheUmlage = Math.round((nettokosten * 0.08) / 12);
  const energiegewinnTotal = massnahmen.reduce((s, m) => s + m.energiegewinn, 0);
  const neuerEScore = Math.max(1, eScore - energiegewinnTotal);
  const energieklasseNachSanierung = ENERGY_FROM_SCORE[neuerEScore] ?? "A";
  const gesamtZeitaufwandWochen = massnahmen.reduce((s, m) => s + m.zeitaufwandWochen, 0);
  const pflichtCount = massnahmen.filter((m) => m.status === "pflicht").length;
  const sanierungsrisiko: SanierungsAnalyse["sanierungsrisiko"] = pflichtCount >= 3 ? "sehr hoch" : pflichtCount >= 2 ? "hoch" : pflichtCount >= 1 ? "mittel" : "gering";

  return { massnahmen, gesamtkostenMin, gesamtkostenMax, foerderungMax, nettokosten, monatlicheUmlage, energieklasseNachSanierung, gesamtZeitaufwandWochen, sanierungsrisiko };
}

export interface MietpotenzialAnalyse {
  aktuelleKaltmiete: number;
  marktmieteSchaetzung: number;
  mietpreisbremseMax: number;
  potenzialProzent: number;
  nachSanierungMin: number;
  nachSanierungMax: number;
  modernisierungsumlagePotenzial: number;
  bewertung: "unter Markt" | "am Markt" | "über Markt";
  handlungsempfehlung: string;
  mietpreisProSqm: number;
  marktpreisProSqm: number;
}

const MARKTMIETE_PRO_SQM: Record<string, number> = {
  Berlin: 14.5, München: 21.0, Hamburg: 15.5, Frankfurt: 16.0, Köln: 13.5,
  Düsseldorf: 13.0, Stuttgart: 15.5, Leipzig: 9.5, Dresden: 10.5, Chemnitz: 7.5,
  Zwickau: 6.5, Halle: 7.5, Magdeburg: 8.5, Erfurt: 9.0, Gera: 6.0,
  Potsdam: 14.5, Cottbus: 7.0, Nürnberg: 13.5, Augsburg: 13.0, Regensburg: 13.0,
  Hannover: 11.5, Rostock: 10.0,
};

export function analysiereMietpotenzial(p: Property, sanierung: SanierungsAnalyse): MietpotenzialAnalyse {
  const basisMarkt = MARKTMIETE_PRO_SQM[p.city] ?? 10;
  const alterskorr = p.yearBuilt >= 2000 ? 1.05 : p.yearBuilt >= 1985 ? 1.0 : p.yearBuilt >= 1970 ? 0.95 : 0.90;
  const energieScore = ENERGY_SCORE[p.energyClass] ?? 6;
  const energiekorr = energieScore <= 3 ? 1.05 : energieScore <= 5 ? 1.0 : energieScore <= 7 ? 0.95 : 0.88;
  const marktmieteProSqm = Math.round(basisMarkt * alterskorr * energiekorr * 100) / 100;
  const marktmieteSchaetzung = Math.round(marktmieteProSqm * p.area);
  const mietpreisProSqm = Math.round((p.monthlyRent / p.area) * 100) / 100;
  const mietpreisbremseMax = Math.round(marktmieteProSqm * 1.1 * p.area);
  const potenzialProzent = Math.round(((marktmieteSchaetzung - p.monthlyRent) / p.monthlyRent) * 100);
  const modernisierungsumlagePotenzial = sanierung.monatlicheUmlage;
  const nachSanierungMin = p.monthlyRent + Math.round(modernisierungsumlagePotenzial * 0.6);
  const nachSanierungMax = p.monthlyRent + modernisierungsumlagePotenzial;
  const bewertung: MietpotenzialAnalyse["bewertung"] = p.monthlyRent < marktmieteSchaetzung * 0.95 ? "unter Markt" : p.monthlyRent > marktmieteSchaetzung * 1.05 ? "über Markt" : "am Markt";
  const handlungsempfehlung = bewertung === "unter Markt" ? `Miete liegt ${Math.abs(potenzialProzent)}% unter Marktniveau. Stufenweise Anpassung bis zur Mietpreisbremsen-Grenze (${Math.round(marktmieteProSqm * 1.1 * 100) / 100} €/m²) möglich.` : bewertung === "am Markt" ? "Miete entspricht dem Markt. Steigerungen nur durch Modernisierungsmaßnahmen (§559 BGB) oder bei Mieterwechsel realisierbar." : "Miete liegt über Marktniveau. Bei Mieterwechsel Risiko der Absenkung beachten.";
  return { aktuelleKaltmiete: p.monthlyRent, marktmieteSchaetzung, mietpreisbremseMax, potenzialProzent, nachSanierungMin, nachSanierungMax, modernisierungsumlagePotenzial, bewertung, handlungsempfehlung, mietpreisProSqm, marktpreisProSqm: marktmieteProSqm };
}

export interface WEGRisikoAnalyse {
  hausgeldProSqm: number;
  empfohlenesHausgeld: number;
  ruecklagenEinschaetzung: "zu niedrig" | "knapp" | "ausreichend" | "gut";
  sonderumlagRisikoScore: number;
  risikoLevel: "gering" | "mittel" | "hoch" | "kritisch";
  redFlags: string[];
  grueneFlags: string[];
  handlungsempfehlung: string;
  jaehrlicheRuecklageEmpfehlung: number;
  aktuelleRuecklageSchaetzung: number;
}

export function analysiereWEGRisiko(p: Property): WEGRisikoAnalyse {
  const age = 2025 - p.yearBuilt;
  const hausgeldProSqm = Math.round((p.hausgeld / p.area) * 100) / 100;
  const empfohlenesHausgeld = Math.round((p.price * 0.01 / 12) + 150);
  const ruecklageProSqmJahr = age < 20 ? 8 : age < 40 ? 10 : age < 60 ? 12 : 15;
  const jaehrlicheRuecklageEmpfehlung = Math.round(ruecklageProSqmJahr * p.area);
  const aktuelleRuecklageSchaetzung = Math.max(0, Math.round((p.hausgeld - 200) * 0.4 * 12));
  const redFlags: string[] = [];
  const grueneFlags: string[] = [];
  if (hausgeldProSqm < 2.0) redFlags.push(`Hausgeld sehr niedrig (${hausgeldProSqm} €/m²) – Rücklagen wahrscheinlich unzureichend`);
  else if (hausgeldProSqm < 2.8) redFlags.push(`Hausgeld knapp (${hausgeldProSqm} €/m²) – WEG-Protokoll auf Sonderumlagen prüfen`);
  else grueneFlags.push(`Angemessenes Hausgeld (${hausgeldProSqm} €/m²)`);
  if (age > 50) redFlags.push("Gebäude über 50 Jahre alt – höherer Instandhaltungsbedarf zu erwarten");
  if (age > 30 && age <= 50) redFlags.push("Gebäude in kritischem Alter – Dacherneuerung, Leitungssanierung prüfen");
  if (age <= 20) grueneFlags.push("Junges Gebäude – geringer Instandhaltungsbedarf");
  const eScore = ENERGY_SCORE[p.energyClass] ?? 6;
  if (eScore >= 7) redFlags.push(`Energieklasse ${p.energyClass} – energetische Sanierung als Gemeinschaft wahrscheinlich nötig`);
  if (eScore <= 4) grueneFlags.push(`Energetisch gut aufgestellt (Klasse ${p.energyClass})`);
  if (aktuelleRuecklageSchaetzung < jaehrlicheRuecklageEmpfehlung * 0.5) redFlags.push("Geschätzte Rücklage deutlich unter Empfehlung – Sonderumlage wahrscheinlich");
  if (p.hausgeld > empfohlenesHausgeld) grueneFlags.push("Hausgeld über Empfehlung – solide Rücklagenbildung wahrscheinlich");
  const ruecklagenEinschaetzung: WEGRisikoAnalyse["ruecklagenEinschaetzung"] = hausgeldProSqm < 2.0 ? "zu niedrig" : hausgeldProSqm < 2.8 ? "knapp" : hausgeldProSqm < 4.0 ? "ausreichend" : "gut";
  let score = 0;
  score += Math.min(40, Math.max(0, (2.5 - hausgeldProSqm) * 20));
  score += Math.min(30, age * 0.5);
  score += eScore >= 7 ? 20 : eScore >= 5 ? 10 : 0;
  score = Math.min(100, Math.round(score));
  const risikoLevel: WEGRisikoAnalyse["risikoLevel"] = score >= 70 ? "kritisch" : score >= 50 ? "hoch" : score >= 30 ? "mittel" : "gering";
  const handlungsempfehlung = risikoLevel === "kritisch" ? "Unbedingt alle WEG-Protokolle der letzten 3 Jahre anfordern und auf beschlossene oder geplante Sonderumlagen prüfen. Instandhaltungsrücklage beim Verwalter erfragen." : risikoLevel === "hoch" ? "WEG-Protokolle der letzten 2 Jahre prüfen. Insbesondere auf Beschlüsse zu Dacherneuerung, Leitungssanierung oder Fahrstuhl achten." : risikoLevel === "mittel" ? "WEG-Protokoll des letzten Jahres anfordern. Aktuelle Instandhaltungsrücklage in EUR beim Verwalter erfragen." : "Solides WEG-Umfeld. Aktuelles WEG-Protokoll und Rücklagenspiegel als Standardprüfung anfordern.";
  return { hausgeldProSqm, empfohlenesHausgeld, ruecklagenEinschaetzung, sonderumlagRisikoScore: score, risikoLevel, redFlags, grueneFlags, handlungsempfehlung, jaehrlicheRuecklageEmpfehlung, aktuelleRuecklageSchaetzung };
}
