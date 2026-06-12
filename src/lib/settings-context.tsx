"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const BUNDESLAENDER = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
];

export const STADT_ZU_BUNDESLAND: Record<string, string> = {
  Berlin: "Berlin",
  München: "Bayern",
  Hamburg: "Hamburg",
  Frankfurt: "Hessen",
  Köln: "Nordrhein-Westfalen",
  Düsseldorf: "Nordrhein-Westfalen",
  Stuttgart: "Baden-Württemberg",
  Leipzig: "Sachsen",
  Dresden: "Sachsen",
  Chemnitz: "Sachsen",
  Zwickau: "Sachsen",
  Halle: "Sachsen-Anhalt",
  Magdeburg: "Sachsen-Anhalt",
  Erfurt: "Thüringen",
  Gera: "Thüringen",
  Potsdam: "Brandenburg",
  Cottbus: "Brandenburg",
  Nürnberg: "Bayern",
  Augsburg: "Bayern",
  Regensburg: "Bayern",
  Hannover: "Niedersachsen",
  Rostock: "Mecklenburg-Vorpommern",
};

export type InvestmentFokus = "bundesland" | "staedte" | "deutschland";
export type RisikoProfil = "konservativ" | "ausgewogen" | "aggressiv";
export type Anlagehorizont = "kurz" | "mittel" | "lang";

export interface UserSettings {
  // Profil
  name: string;
  email: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";

  // Investment-Fokus
  investmentFokus: InvestmentFokus;
  ausgewaehlteBundeslaender: string[];
  ausgewaehlteSstaedte: string[];

  // Investment-Parameter
  budget: number;
  eigenkapital: number;
  zielrendite: number;
  risikoProfil: RisikoProfil;
  anlagehorizont: Anlagehorizont;
  minDealScore: number;

  // Benachrichtigungen
  emailBeiNeuemDeal: boolean;
  emailTaeglich: boolean;
  pushBenachrichtigungen: boolean;

  // Anzeige
  waehrung: string;
  sprache: string;
  darkMode: boolean;
}

const DEFAULTS: UserSettings = {
  name: "Lenny G.",
  email: "lenny.gehlen@web.de",
  plan: "PRO",
  investmentFokus: "deutschland",
  ausgewaehlteBundeslaender: [],
  ausgewaehlteSstaedte: [],
  budget: 600000,
  eigenkapital: 120000,
  zielrendite: 5.0,
  risikoProfil: "ausgewogen",
  anlagehorizont: "lang",
  minDealScore: 80,
  emailBeiNeuemDeal: true,
  emailTaeglich: false,
  pushBenachrichtigungen: true,
  waehrung: "EUR",
  sprache: "de",
  darkMode: true,
};

interface SettingsContextType {
  settings: UserSettings;
  update: (partial: Partial<UserSettings>) => void;
  reset: () => void;
  toggleBundesland: (bl: string) => void;
  toggleStadt: (city: string) => void;
  regionLabel: string;
  activeRegionFilter: string[]; // list of city names that match current filter
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("immo-settings");
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("immo-settings", JSON.stringify(settings));
  }, [settings, loaded]);

  const update = (partial: Partial<UserSettings>) =>
    setSettings((p) => ({ ...p, ...partial }));

  const reset = () => setSettings(DEFAULTS);

  const toggleBundesland = (bl: string) => {
    setSettings((p) => ({
      ...p,
      ausgewaehlteBundeslaender: p.ausgewaehlteBundeslaender.includes(bl)
        ? p.ausgewaehlteBundeslaender.filter((b) => b !== bl)
        : [...p.ausgewaehlteBundeslaender, bl],
    }));
  };

  const toggleStadt = (city: string) => {
    setSettings((p) => ({
      ...p,
      ausgewaehlteSstaedte: p.ausgewaehlteSstaedte.includes(city)
        ? p.ausgewaehlteSstaedte.filter((c) => c !== city)
        : [...p.ausgewaehlteSstaedte, city],
    }));
  };

  // Compute active region filter (list of cities that match)
  const activeRegionFilter: string[] = (() => {
    if (settings.investmentFokus === "deutschland") return [];
    if (settings.investmentFokus === "staedte") return settings.ausgewaehlteSstaedte;
    if (settings.investmentFokus === "bundesland") {
      return Object.entries(STADT_ZU_BUNDESLAND)
        .filter(([, bl]) => settings.ausgewaehlteBundeslaender.includes(bl))
        .map(([city]) => city);
    }
    return [];
  })();

  const regionLabel = (() => {
    if (settings.investmentFokus === "deutschland") return "Ganz Deutschland";
    if (settings.investmentFokus === "bundesland") {
      if (settings.ausgewaehlteBundeslaender.length === 0) return "Kein Bundesland gewählt";
      if (settings.ausgewaehlteBundeslaender.length === 1) return settings.ausgewaehlteBundeslaender[0];
      return `${settings.ausgewaehlteBundeslaender.length} Bundesländer`;
    }
    if (settings.investmentFokus === "staedte") {
      if (settings.ausgewaehlteSstaedte.length === 0) return "Keine Stadt gewählt";
      if (settings.ausgewaehlteSstaedte.length === 1) return settings.ausgewaehlteSstaedte[0];
      return `${settings.ausgewaehlteSstaedte.length} Städte`;
    }
    return "";
  })();

  return (
    <SettingsContext.Provider value={{ settings, update, reset, toggleBundesland, toggleStadt, regionLabel, activeRegionFilter }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
