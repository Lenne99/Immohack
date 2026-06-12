"use client";

import { useMemo } from "react";
import type { Property } from "@/data/mock-properties";
import { analysiereSanierung, analysiereMietpotenzial, analysiereWEGRisiko } from "@/lib/property-analysis";
import type { Massnahme } from "@/lib/property-analysis";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AlertTriangle, CheckCircle, Info, Wrench, TrendingUp,
  Shield, Euro, Clock, Zap, ChevronRight,
} from "lucide-react";

// ─── STATUS BADGES ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Massnahme["status"] }) {
  return (
    <span className={cn(
      "text-xs font-bold px-2 py-0.5 rounded-full",
      status === "pflicht" ? "bg-red-500/15 text-red-400" :
      status === "empfohlen" ? "bg-amber-500/15 text-amber-400" :
      "bg-gray-700 text-gray-400"
    )}>
      {status === "pflicht" ? "Pflicht (GEG)" : status === "empfohlen" ? "Empfohlen" : "Optional"}
    </span>
  );
}

function RisikoBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-red-500" :
    score >= 50 ? "bg-orange-500" :
    score >= 30 ? "bg-amber-500" : "bg-green-500";
  const label = score >= 70 ? "Kritisch" : score >= 50 ? "Hoch" : score >= 30 ? "Mittel" : "Gering";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Sonderumlage-Risiko</span>
        <span className={cn("font-bold",
          score >= 70 ? "text-red-400" : score >= 50 ? "text-orange-400" :
          score >= 30 ? "text-amber-400" : "text-green-400"
        )}>{label} ({score}/100)</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ─── SANIERUNGSKOSTEN ─────────────────────────────────────────────────────────

function SanierungsSection({ property }: { property: Property }) {
  const analyse = useMemo(() => analysiereSanierung(property), [property]);

  const risikoColor = {
    gering: "text-green-400 bg-green-400/10 border-green-400/20",
    mittel: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    hoch: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "sehr hoch": "text-red-400 bg-red-400/10 border-red-400/20",
  }[analyse.sanierungsrisiko];

  if (analyse.massnahmen.length === 0) {
    return (
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-5">
        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-green-400 font-semibold">Kein wesentlicher Sanierungsbedarf</p>
          <p className="text-gray-400 text-sm mt-0.5">Baujahr und Energieklasse deuten auf modernen, gut gepflegten Zustand hin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Gesamtkosten (Min.)", value: formatCurrency(analyse.gesamtkostenMin),
            sub: `bis ${formatCurrency(analyse.gesamtkostenMax)}`, color: "text-white"
          },
          {
            label: "KfW-Förderung (max.)", value: formatCurrency(analyse.foerderungMax),
            sub: "Zuschüsse", color: "text-green-400"
          },
          {
            label: "Nettokosten nach Förderung", value: formatCurrency(analyse.nettokosten),
            sub: "realistisch", color: "text-amber-400"
          },
          {
            label: "Mieterhöhung möglich", value: `+${formatCurrency(analyse.monatlicheUmlage)}/Mo`,
            sub: "§559 BGB Umlage", color: "text-blue-400"
          },
        ].map((card) => (
          <div key={card.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">{card.label}</p>
            <p className={cn("font-bold text-lg tabular-nums", card.color)}>{card.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Risiko + Energieklasse */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium", risikoColor)}>
          <Wrench className="w-4 h-4" />
          Sanierungsrisiko: {analyse.sanierungsrisiko}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="w-4 h-4 text-amber-400" />
          Energieklasse jetzt: <span className="text-white font-bold ml-1">{property.energyClass}</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          nach Sanierung: <span className="text-green-400 font-bold ml-1">{analyse.energieklasseNachSanierung}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4 text-gray-500" />
          Zeitaufwand: <span className="text-white font-bold ml-1">{analyse.gesamtZeitaufwandWochen} Wochen</span>
        </div>
      </div>

      {/* Massnahmen Liste */}
      <div className="space-y-3">
        {analyse.massnahmen.map((m, i) => (
          <div key={i} className={cn(
            "border rounded-xl p-4",
            m.status === "pflicht" ? "border-red-500/20 bg-red-500/5" :
            m.status === "empfohlen" ? "border-amber-500/20 bg-amber-500/5" :
            "border-gray-700/50 bg-gray-800/30"
          )}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-semibold text-sm">{m.titel}</h4>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-white font-bold text-sm whitespace-nowrap tabular-nums">
                {formatCurrency(m.kostenMin)}–{formatCurrency(m.kostenMax)}
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{m.beschreibung}</p>
            <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
              {m.kfwFoerderung > 0 && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  {m.kfwProgramm} ({m.kfwFoerderung}%)
                </span>
              )}
              {m.mietsteiggerungProJahr > 0 && (
                <span className="flex items-center gap-1 text-blue-400">
                  <Euro className="w-3 h-3" />
                  Mieterhöhung möglich: +{formatCurrency(Math.round(m.mietsteiggerungProJahr / 12))}/Mo
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ca. {m.zeitaufwandWochen} Woche{m.zeitaufwandWochen !== 1 ? "n" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MIETPOTENZIAL ────────────────────────────────────────────────────────────

function MietpotenzialSection({ property }: { property: Property }) {
  const sanierung = useMemo(() => analysiereSanierung(property), [property]);
  const analyse = useMemo(() => analysiereMietpotenzial(property, sanierung), [property, sanierung]);

  const bewertungColor = {
    "unter Markt": "text-green-400 bg-green-400/10 border-green-400/20",
    "am Markt": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "über Markt": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  }[analyse.bewertung];

  const barWidth = Math.min(100, Math.max(10, (analyse.aktuelleKaltmiete / (analyse.mietpreisbremseMax * 1.1)) * 100));
  const marktBarWidth = Math.min(100, (analyse.marktmieteSchaetzung / (analyse.mietpreisbremseMax * 1.1)) * 100);
  const maxBarWidth = Math.min(100, (analyse.mietpreisbremseMax / (analyse.mietpreisbremseMax * 1.1)) * 100);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Aktuelle Kaltmiete", value: formatCurrency(analyse.aktuelleKaltmiete) + "/Mo", sub: `${analyse.mietpreisProSqm} €/m²`, color: "text-white" },
          { label: "Markt-Miete (Mietspiegel)", value: formatCurrency(analyse.marktmieteSchaetzung) + "/Mo", sub: `${analyse.marktpreisProSqm} €/m²`, color: "text-blue-400" },
          { label: "Mietpreisbremse Max.", value: formatCurrency(analyse.mietpreisbremseMax) + "/Mo", sub: "+10% über Mietspiegel", color: "text-amber-400" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">{card.label}</p>
            <p className={cn("font-bold text-lg", card.color)}>{card.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Visual bar */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-3">
        <h4 className="text-white text-sm font-semibold mb-4">Mietposition im Markt</h4>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Aktuelle Miete</span><span className="text-white">{formatCurrency(analyse.aktuelleKaltmiete)}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${barWidth}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Marktmiete (Mietspiegel)</span><span className="text-blue-400">{formatCurrency(analyse.marktmieteSchaetzung)}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${marktBarWidth}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Mietpreisbremse Max.</span><span className="text-amber-400">{formatCurrency(analyse.mietpreisbremseMax)}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${maxBarWidth}%` }} />
          </div>
        </div>

        {sanierung.monatlicheUmlage > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Nach Sanierung (§559 BGB)</span>
              <span className="text-green-400">{formatCurrency(analyse.nachSanierungMin)}–{formatCurrency(analyse.nachSanierungMax)}</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.min(100, (analyse.nachSanierungMax / (analyse.mietpreisbremseMax * 1.1)) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Bewertung */}
      <div className={cn("flex items-start gap-3 border rounded-xl p-4", bewertungColor)}>
        <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm mb-1">
            Miete {analyse.bewertung}
            {analyse.potenzialProzent > 0 && ` – ${analyse.potenzialProzent}% Potenzial`}
          </p>
          <p className="text-sm opacity-80">{analyse.handlungsempfehlung}</p>
        </div>
      </div>
    </div>
  );
}

// ─── WEG-RISIKO ───────────────────────────────────────────────────────────────

function WEGRisikoSection({ property }: { property: Property }) {
  const analyse = useMemo(() => analysiereWEGRisiko(property), [property]);

  const risikoColor = {
    gering: "text-green-400",
    mittel: "text-amber-400",
    hoch: "text-orange-400",
    kritisch: "text-red-400",
  }[analyse.risikoLevel];

  return (
    <div className="space-y-5">
      {/* Score */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Hausgeld/m²", value: `${analyse.hausgeldProSqm} €/m²`, sub: "aktuell", color: "text-white" },
          { label: "Empfohlen", value: `${Math.round(analyse.empfohlenesHausgeld / property.area * 100) / 100} €/m²`, sub: "Richtwert", color: "text-blue-400" },
          { label: "Geschätzte Rücklage p.a.", value: formatCurrency(analyse.aktuelleRuecklageSchaetzung), sub: "aus Hausgeld", color: "text-gray-300" },
          { label: "Empfohlene Rücklage p.a.", value: formatCurrency(analyse.jaehrlicheRuecklageEmpfehlung), sub: "nach Gebäudealter", color: "text-amber-400" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">{card.label}</p>
            <p className={cn("font-bold text-base", card.color)}>{card.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <RisikoBar score={analyse.sonderumlagRisikoScore} />

      {/* Red / Green Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyse.redFlags.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h4 className="text-red-400 font-semibold text-sm">Risikofaktoren</h4>
            </div>
            <ul className="space-y-2">
              {analyse.redFlags.map((flag, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">·</span>{flag}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analyse.grueneFlags.length > 0 && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h4 className="text-green-400 font-semibold text-sm">Positive Faktoren</h4>
            </div>
            <ul className="space-y-2">
              {analyse.grueneFlags.map((flag, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">·</span>{flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Handlungsempfehlung */}
      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className={cn("font-semibold text-sm mb-1", risikoColor)}>
            WEG-Risiko: {analyse.risikoLevel.charAt(0).toUpperCase() + analyse.risikoLevel.slice(1)}
          </p>
          <p className="text-gray-400 text-sm">{analyse.handlungsempfehlung}</p>
        </div>
      </div>

      {/* Checkliste */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
        <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" /> Due Diligence Checkliste WEG
        </h4>
        <ul className="space-y-2">
          {[
            "WEG-Protokolle der letzten 3 Jahre anfordern",
            "Aktuelle Instandhaltungsrücklage in € beim Verwalter erfragen",
            "Auf beschlossene oder geplante Sonderumlagen prüfen",
            "Teilungserklärung und Gemeinschaftsordnung prüfen",
            "Wirtschaftsplan des laufenden Jahres anfordern",
            "Gebäudeversicherung und Deckungssummen prüfen",
            analyse.risikoLevel !== "gering" ? "Bausachverständigen für Begehung beauftragen" : null,
          ].filter(Boolean).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="w-4 h-4 border border-gray-600 rounded flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

type InspectorTab = "sanierung" | "mietpotenzial" | "weg";

const SUBTABS: { id: InspectorTab; label: string; icon: React.ElementType }[] = [
  { id: "sanierung", label: "Sanierungskosten", icon: Wrench },
  { id: "mietpotenzial", label: "Mietpotenzial", icon: TrendingUp },
  { id: "weg", label: "WEG-Risiko", icon: Shield },
];

export function PropertyInspector({ property, activeSubTab, onSubTabChange }: {
  property: Property;
  activeSubTab: InspectorTab;
  onSubTabChange: (tab: InspectorTab) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Sub-tab navigation */}
      <div className="flex gap-2 flex-wrap">
        {SUBTABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSubTabChange(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
              activeSubTab === id
                ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeSubTab === "sanierung" && <SanierungsSection property={property} />}
      {activeSubTab === "mietpotenzial" && <MietpotenzialSection property={property} />}
      {activeSubTab === "weg" && <WEGRisikoSection property={property} />}
    </div>
  );
}
