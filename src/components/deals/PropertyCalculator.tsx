"use client";

import { useState, useMemo } from "react";
import { calculate, type CalculatorInputs } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";
import { Calculator, ChevronDown, ChevronUp, TrendingUp, Euro, Home, BarChart3, Zap, Shield } from "lucide-react";

function fmt(n: number, decimals = 0): string {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
function fmtEuro(n: number, decimals = 0): string {
  return fmt(n, decimals) + " €";
}
function fmtPct(n: number, decimals = 1): string {
  return fmt(n, decimals) + " %";
}

function Row({ label, value, highlight, sub, colorClass }: { label: string; value: string; highlight?: boolean; sub?: string; colorClass?: string }) {
  return (
    <div className={cn("flex justify-between items-center py-1.5 px-2 rounded text-xs", highlight ? "bg-blue-600/20 font-semibold" : "hover:bg-gray-800/40")}>
      <span className={cn("text-gray-400 leading-tight", highlight && "text-gray-200")}>{label}</span>
      <span className={cn("font-medium ml-2 text-right tabular-nums", highlight ? "text-white" : (colorClass || "text-gray-200"), sub && "flex flex-col items-end")}>
        {value}
        {sub && <span className="text-gray-500 text-xs font-normal">{sub}</span>}
      </span>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = "text-blue-400" }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div className={cn("flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-700/50")}>
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <h4 className="text-white text-xs font-bold uppercase tracking-wider">{title}</h4>
    </div>
  );
}

function InputField({ label, value, onChange, type = "number", unit, min, max, step }: {
  label: string; value: number | string; onChange: (v: number) => void;
  type?: string; unit?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div>
      <label className="text-gray-500 text-xs block mb-0.5">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step ?? 0.01}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 tabular-nums pr-8"
        />
        {unit && <span className="absolute right-2 text-gray-500 text-xs pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
}

interface SectionProps { title: string; open?: boolean; children: React.ReactNode; }
function CollapsibleSection({ title, open = true, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/30 transition-colors">
        <span className="text-white text-sm font-semibold">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function PropertyCalculator({ property }: { property: Property }) {
  const currentYear = new Date().getFullYear();

  const [inputs, setInputs] = useState<CalculatorInputs>({
    kaufpreis: property.price,
    wohnflaeche: property.area,
    stellplaetze: 0,
    kaufdatum: new Date().toISOString().split("T")[0],
    maklerProzent: 3.57,
    notarProzent: 1.5,
    grundbuchProzent: 0.5,
    grunderwerbsteuerProzent: 6.0,
    kueche: 0,
    sonstigeInvestitionen: 0,
    kaltmieteProQm: property.area > 0 ? Math.round(property.monthlyRent / property.area * 10) / 10 : 10,
    stellplatzMiete: 0,
    hausgeldUmlagefaehig: Math.round(property.hausgeld * 0.6),
    hausgeldNichtUmlagefaehig: Math.round(property.hausgeld * 0.4),
    verwaltungskostenMonat: Math.round(property.monthlyRent * 0.05),
    instandhaltungProQmJahr: 10,
    mietausfallProzent: 3,
    afaSatz: 2.0,
    anteilGebaeudeAnKaufpreis: 75,
    persoenlicherSteuersatz: 42,
    grundsteuerMonat: 60,
    kostensteigerungPa: 2.0,
    mietsteigerungPa: 2.5,
    wertsteigerungPa: 2.0,
    d1Summe: Math.round(property.price * 0.8),
    d1Zinssatz: 3.8,
    d1Tilgung: 2.0,
    d2Summe: 0,
    d2Zinssatz: 4.0,
    d2Tilgung: 2.0,
    betrachtungsjahreBis: currentYear + 10,
  });

  const set = (key: keyof CalculatorInputs) => (val: number) => setInputs(p => ({ ...p, [key]: val }));

  const r = useMemo(() => calculate(inputs), [inputs]);

  const positiveCashflow = r.cashflowNachSteuern >= 0;
  const positiveEK = r.eigenkapitalrendite >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <Calculator className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Profi-Kalkulator</h3>
          <p className="text-gray-500 text-xs">Alle Werte frei anpassbar · Berechnung in Echtzeit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ─── INPUTS LEFT ─── */}
        <div className="space-y-3">

          <CollapsibleSection title="Objekt & Kaufpreis">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <InputField label="Kaufpreis" value={inputs.kaufpreis} onChange={set("kaufpreis")} unit="€" step={1000} />
              <InputField label="Wohnfläche" value={inputs.wohnflaeche} onChange={set("wohnflaeche")} unit="m²" step={1} />
              <InputField label="Stellplätze" value={inputs.stellplaetze} onChange={set("stellplaetze")} step={1} />
              <InputField label="Stell.-Miete" value={inputs.stellplatzMiete} onChange={set("stellplatzMiete")} unit="€/Mo" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
              <InputField label="Makler" value={inputs.maklerProzent} onChange={set("maklerProzent")} unit="%" step={0.1} />
              <InputField label="Notar" value={inputs.notarProzent} onChange={set("notarProzent")} unit="%" step={0.1} />
              <InputField label="Grundbuch" value={inputs.grundbuchProzent} onChange={set("grundbuchProzent")} unit="%" step={0.1} />
              <InputField label="Grunderwerbst." value={inputs.grunderwerbsteuerProzent} onChange={set("grunderwerbsteuerProzent")} unit="%" step={0.5} />
              <InputField label="Küche/Möbel" value={inputs.kueche} onChange={set("kueche")} unit="€" step={500} />
              <InputField label="Sonstige Invest." value={inputs.sonstigeInvestitionen} onChange={set("sonstigeInvestitionen")} unit="€" step={500} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Miete & Bewirtschaftung">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <InputField label="Kaltmiete pro m²" value={inputs.kaltmieteProQm} onChange={set("kaltmieteProQm")} unit="€" step={0.5} />
              <InputField label="Mietausfall" value={inputs.mietausfallProzent} onChange={set("mietausfallProzent")} unit="%" step={0.5} />
              <InputField label="Hausgeld umlagef." value={inputs.hausgeldUmlagefaehig} onChange={set("hausgeldUmlagefaehig")} unit="€/Mo" />
              <InputField label="Hausgeld n. umlag." value={inputs.hausgeldNichtUmlagefaehig} onChange={set("hausgeldNichtUmlagefaehig")} unit="€/Mo" />
              <InputField label="Verwaltung" value={inputs.verwaltungskostenMonat} onChange={set("verwaltungskostenMonat")} unit="€/Mo" />
              <InputField label="Instandh. p. m²/J" value={inputs.instandhaltungProQmJahr} onChange={set("instandhaltungProQmJahr")} unit="€" step={1} />
              <InputField label="Grundsteuer" value={inputs.grundsteuerMonat} onChange={set("grundsteuerMonat")} unit="€/Mo" />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Steuern & Prognose">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <InputField label="Persönl. Steuersatz" value={inputs.persoenlicherSteuersatz} onChange={set("persoenlicherSteuersatz")} unit="%" step={1} max={50} />
              <InputField label="AfA Satz" value={inputs.afaSatz} onChange={set("afaSatz")} unit="%" step={0.5} />
              <InputField label="Anteil Gebäude" value={inputs.anteilGebaeudeAnKaufpreis} onChange={set("anteilGebaeudeAnKaufpreis")} unit="%" step={5} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-800">
              <InputField label="Kostensteigerung" value={inputs.kostensteigerungPa} onChange={set("kostensteigerungPa")} unit="%" step={0.5} />
              <InputField label="Mietsteigerung" value={inputs.mietsteigerungPa} onChange={set("mietsteigerungPa")} unit="%" step={0.5} />
              <InputField label="Wertsteigerung" value={inputs.wertsteigerungPa} onChange={set("wertsteigerungPa")} unit="%" step={0.5} />
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800">
              <InputField label="Betrachtung bis Jahr" value={inputs.betrachtungsjahreBis} onChange={set("betrachtungsjahreBis")} step={1} min={currentYear + 1} max={currentYear + 40} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Finanzierung">
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium mb-2">Darlehen I</p>
              <div className="grid grid-cols-3 gap-2">
                <InputField label="Summe" value={inputs.d1Summe} onChange={set("d1Summe")} unit="€" step={5000} />
                <InputField label="Zinssatz" value={inputs.d1Zinssatz} onChange={set("d1Zinssatz")} unit="%" step={0.1} />
                <InputField label="Tilgung" value={inputs.d1Tilgung} onChange={set("d1Tilgung")} unit="%" step={0.5} />
              </div>
              <p className="text-gray-500 text-xs font-medium mb-2 mt-3">Darlehen II (optional)</p>
              <div className="grid grid-cols-3 gap-2">
                <InputField label="Summe" value={inputs.d2Summe} onChange={set("d2Summe")} unit="€" step={5000} />
                <InputField label="Zinssatz" value={inputs.d2Zinssatz} onChange={set("d2Zinssatz")} unit="%" step={0.1} />
                <InputField label="Tilgung" value={inputs.d2Tilgung} onChange={set("d2Tilgung")} unit="%" step={0.5} />
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* ─── RESULTS RIGHT ─── */}
        <div className="space-y-3">

          {/* Kernergebnisse oben */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Cashflow/Mo", value: fmtEuro(r.cashflowNachSteuern), color: positiveCashflow ? "text-green-400" : "text-red-400", sub: "nach Steuern" },
              { label: "EK-Rendite", value: fmtPct(r.eigenkapitalrendite), color: positiveEK ? "text-blue-400" : "text-red-400", sub: "p.a." },
              { label: "Bruttorendite", value: fmtPct(r.bruttoMietrendite), color: "text-purple-400", sub: "p.a." },
              { label: "Eigenkapital", value: fmtEuro(r.eigenkapital), color: "text-amber-400", sub: "nötig" },
            ].map(m => (
              <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <p className={cn("text-lg font-bold tabular-nums", m.color)}>{m.value}</p>
                <p className="text-white text-xs font-medium mt-0.5">{m.label}</p>
                <p className="text-gray-600 text-xs">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Kaufkosten */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={Home} title="Objekt & Investition" />
            <Row label="Kaufpreis" value={fmtEuro(inputs.kaufpreis)} />
            <Row label="Makler" value={fmtEuro(r.maklerBetrag)} />
            <Row label="Notar" value={fmtEuro(r.notarBetrag)} />
            <Row label="Grundbuch" value={fmtEuro(r.grundbuchBetrag)} />
            <Row label="Grunderwerbsteuer" value={fmtEuro(r.grunderwerbsteuerBetrag)} />
            <Row label="Gesamte Nebenkosten" value={fmtEuro(r.gesamtNebenkosten)} highlight />
            <Row label="Gesamtinvestition" value={fmtEuro(r.gesamtInvestition)} highlight />
            <Row label="Eigenkapital nötig" value={fmtEuro(r.eigenkapital)} colorClass="text-amber-400" />
            <Row label="Nebenkosten-Quote" value={fmtPct((r.gesamtNebenkosten / inputs.kaufpreis) * 100)} />
          </div>

          {/* Miete & Cashflow */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={Euro} title="Miete & Cashflow pro Monat" color="text-green-400" />
            <Row label="Kaltmiete (Wfl.)" value={fmtEuro(inputs.wohnflaeche * inputs.kaltmieteProQm)} />
            <Row label="Stellplatz-Miete" value={fmtEuro(inputs.stellplaetze * inputs.stellplatzMiete)} />
            <Row label="Kaltmiete gesamt" value={fmtEuro(r.kaltmieteGesamt)} highlight />
            <Row label={`− Mietausfall (${inputs.mietausfallProzent}%)`} value={fmtEuro(r.kaltmieteGesamt * inputs.mietausfallProzent / 100)} colorClass="text-red-400" />
            <Row label="+ Umlagef. Kosten" value={fmtEuro(r.betriebskostenUmlagefaehig)} />
            <Row label="= Warmmiete" value={fmtEuro(r.warmmiete)} highlight />
            <div className="border-t border-gray-700/50 my-2" />
            <Row label="− Bewirtschaftung" value={fmtEuro(r.betriebskostenNichtUmlagefaehig)} colorClass="text-red-400" />
            <Row label="− Kapitaldienst" value={fmtEuro(r.gesamtKapitaldienst)} colorClass="text-red-400" />
            <Row label="= Cashflow operativ" value={fmtEuro(r.cashflowOperativ)} colorClass={r.cashflowOperativ >= 0 ? "text-green-400" : "text-red-400"} />
            <Row label="− Steuern" value={fmtEuro(r.steuernMonat)} colorClass="text-red-400" />
            <Row label="= Cashflow n. Steuern" value={fmtEuro(r.cashflowNachSteuern)} highlight colorClass={r.cashflowNachSteuern >= 0 ? "text-green-400" : "text-red-400"} />
            <Row label="AfA (steuerlich)" value={fmtEuro(r.afaMonat) + "/Mo"} />
          </div>

          {/* Finanzierung */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={BarChart3} title="Finanzierung" color="text-purple-400" />
            <Row label="Darlehenssumme ges." value={fmtEuro(r.gesamtDarlehenssumme)} />
            <Row label="Zinssatz gewichtet" value={fmtPct(r.zinssatzGewichtet)} />
            <Row label="Tilgung gewichtet" value={fmtPct(r.anfaenglicheTilgungGewichtet)} />
            <Row label="Kapitaldienst/Mo ges." value={fmtEuro(r.gesamtKapitaldienst)} highlight />
            <div className="grid grid-cols-2 gap-1 mt-1">
              <Row label="davon Zinsen" value={fmtEuro(r.zinsenMonat)} colorClass="text-red-400" />
              <Row label="davon Tilgung" value={fmtEuro(r.tilgungMonat)} colorClass="text-green-400" />
            </div>
            {inputs.d1Summe > 0 && r.d1JahrVollTilgung > 0 && (
              <Row label="Darlehen I abbezahlt" value={String(r.d1JahrVollTilgung)} />
            )}
          </div>

          {/* Renditekennzahlen */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={TrendingUp} title="Renditekennzahlen" color="text-blue-400" />
            <Row label="Brutto-Mietrendite" value={fmtPct(r.bruttoMietrendite)} colorClass="text-blue-400" />
            <Row label="Netto-Mietrendite" value={fmtPct(r.nettoMietrendite)} colorClass="text-blue-400" />
            <Row label="Kaufpreisfaktor" value={fmt(r.kaufpreisfaktor, 1) + "x"} />
            <Row label="EK-Rendite (m. Tilgung)" value={fmtPct(r.eigenkapitalrendite)} highlight colorClass={r.eigenkapitalrendite >= 0 ? "text-green-400" : "text-red-400"} />
            <Row label="EK-Rendite (nur CF)" value={fmtPct(r.eigenkapitalrenditeOhneWertsteigerung)} colorClass={r.eigenkapitalrenditeOhneWertsteigerung >= 0 ? "text-green-400" : "text-red-400"} />
          </div>

          {/* Zukunft & Vermögenszuwachs */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={Zap} title={`Kennzahlen in ${inputs.betrachtungsjahreBis} (${inputs.betrachtungsjahreBis - currentYear} Jahre)`} color="text-amber-400" />
            <Row label="Immobilienwert" value={fmtEuro(r.immobilienwertZukunft)} colorClass="text-amber-400" />
            <Row label="Restschuld" value={fmtEuro(r.restschuldZukunft)} colorClass="text-red-400" />
            <Row label="Kum. Cashflow" value={fmtEuro(r.kumulierterCashflowZukunft)} colorClass={r.kumulierterCashflowZukunft >= 0 ? "text-green-400" : "text-red-400"} />
            <Row label="Vermögenszuwachs m. WS" value={fmtEuro(r.vermoegenszuwachsMitWertsteigerung)} highlight colorClass="text-green-400" />
            <Row label="Wertzuwachs Immobilie" value={fmtEuro(r.vermoegenszuwachsJahrBetrag)} />
            <Row label="Beleihungsreserve" value={fmtEuro(r.beleihungsreserve)} colorClass="text-blue-400" />
          </div>

          {/* Profi-Kennzahlen */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <SectionTitle icon={Shield} title="Profi-Kennzahlen" color="text-pink-400" />
            <Row
              label="Break-Even (kum. CF)"
              value={r.breakEvenJahr > 0 ? String(r.breakEvenJahr) : "N/A"}
              sub={r.breakEvenJahreNachKauf < 99 ? `in ${r.breakEvenJahreNachKauf} Jahren` : undefined}
            />
            <Row label="Zinsänderungsrisiko +1%" value={fmtEuro(r.zinsaenderungsrisiko) + "/Mo"} colorClass="text-amber-400" />
            <Row label="Nettomiete p.a. (Zukunft)" value={fmtEuro(r.nettomietproJahrZukunft)} />
            <Row label="Immobilienwert n. Faktor" value={fmtEuro(r.wertImmobilieNachFaktor)} />
            <Row label="Wert pro m² (Zukunft)" value={fmtEuro(r.wertProQmZukunft)} />
            <Row label="AfA Basis" value={fmtEuro(r.afaBasisBetrag)} />
            <Row label="AfA pro Jahr" value={fmtEuro(r.afaJahrBetrag)} />
          </div>
        </div>
      </div>
    </div>
  );
}
