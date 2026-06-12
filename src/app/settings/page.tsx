"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  useSettings,
  BUNDESLAENDER,
  STADT_ZU_BUNDESLAND,
} from "@/lib/settings-context";
import {
  User,
  MapPin,
  BarChart3,
  Bell,
  Monitor,
  Check,
  Globe,
  Building2,
  Map,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAEDTE = Object.keys(STADT_ZU_BUNDESLAND).sort();

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-gray-800 pt-4">{children}</div>}
    </div>
  );
}

function InputRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-gray-400 text-sm w-48 flex-shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-gray-400 text-sm">{label}</label>
        <span className="text-white font-semibold text-sm">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, update, toggleBundesland, toggleStadt, regionLabel } = useSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Einstellungen" />
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-5">

        {/* Profil */}
        <Section icon={User} title="Profil">
          <InputRow label="Name">
            <input
              type="text"
              value={settings.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </InputRow>
          <InputRow label="E-Mail">
            <input
              type="email"
              value={settings.email}
              onChange={(e) => update({ email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </InputRow>
          <InputRow label="Plan">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-400 text-sm font-medium">
              {settings.plan}
            </span>
          </InputRow>
        </Section>

        {/* Investment-Region */}
        <Section icon={MapPin} title="Investment-Region">
          <div className="text-gray-400 text-sm mb-1">
            Aktuell: <span className="text-white font-medium">{regionLabel}</span>
          </div>

          {/* Fokus-Auswahl */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { value: "deutschland", label: "Ganz Deutschland", icon: Globe },
              { value: "bundesland", label: "Bundesland", icon: Map },
              { value: "staedte", label: "Städte", icon: Building2 },
            ].map(({ value, label, icon: Icon }) => {
              const active = settings.investmentFokus === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ investmentFokus: value as any })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all",
                    active
                      ? "bg-blue-600/15 border-blue-500/50 text-blue-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {active && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>

          {/* Bundesland-Auswahl */}
          {settings.investmentFokus === "bundesland" && (
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-medium mb-3">Bundesland(/-länder) auswählen:</p>
              <div className="grid grid-cols-2 gap-2">
                {BUNDESLAENDER.map((bl) => {
                  const active = settings.ausgewaehlteBundeslaender.includes(bl);
                  return (
                    <button
                      key={bl}
                      onClick={() => toggleBundesland(bl)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all border",
                        active
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600"
                      )}
                    >
                      {active && <Check className="w-3 h-3 flex-shrink-0 text-blue-400" />}
                      {!active && <div className="w-3 h-3 flex-shrink-0" />}
                      {bl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Städte-Auswahl */}
          {settings.investmentFokus === "staedte" && (
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-medium mb-3">Stadt(/-städte) auswählen:</p>
              <div className="grid grid-cols-2 gap-2">
                {STAEDTE.map((city) => {
                  const active = settings.ausgewaehlteSstaedte.includes(city);
                  const bl = STADT_ZU_BUNDESLAND[city];
                  return (
                    <button
                      key={city}
                      onClick={() => toggleStadt(city)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all border",
                        active
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600"
                      )}
                    >
                      {active && <Check className="w-3 h-3 flex-shrink-0 text-blue-400" />}
                      {!active && <div className="w-3 h-3 flex-shrink-0" />}
                      <span className="flex-1 min-w-0">
                        {city}
                        <span className="block text-xs text-gray-600">{bl}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Section>

        {/* Investment-Parameter */}
        <Section icon={BarChart3} title="Investment-Parameter">
          <SliderRow
            label="Budget (max. Kaufpreis)"
            value={settings.budget}
            min={100000}
            max={2000000}
            step={50000}
            format={(v) => `${(v / 1000).toFixed(0)}k €`}
            onChange={(v) => update({ budget: v })}
          />
          <SliderRow
            label="Eigenkapital"
            value={settings.eigenkapital}
            min={10000}
            max={500000}
            step={10000}
            format={(v) => `${(v / 1000).toFixed(0)}k €`}
            onChange={(v) => update({ eigenkapital: v })}
          />
          <SliderRow
            label="Ziel-Rendite (Brutto)"
            value={settings.zielrendite}
            min={2}
            max={15}
            step={0.5}
            format={(v) => `${v.toFixed(1)} %`}
            onChange={(v) => update({ zielrendite: v })}
          />
          <SliderRow
            label="Mindest Deal Score"
            value={settings.minDealScore}
            min={0}
            max={95}
            step={5}
            format={(v) => v.toString()}
            onChange={(v) => update({ minDealScore: v })}
          />

          <InputRow label="Risikoprofil">
            <div className="flex gap-2">
              {[
                { value: "konservativ", label: "Konservativ" },
                { value: "ausgewogen", label: "Ausgewogen" },
                { value: "aggressiv", label: "Aggressiv" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update({ risikoProfil: value as any })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    settings.risikoProfil === value
                      ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </InputRow>

          <InputRow label="Anlagehorizont">
            <div className="flex gap-2">
              {[
                { value: "kurz", label: "< 5 Jahre" },
                { value: "mittel", label: "5–15 Jahre" },
                { value: "lang", label: "> 15 Jahre" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update({ anlagehorizont: value as any })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    settings.anlagehorizont === value
                      ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </InputRow>
        </Section>

        {/* Benachrichtigungen */}
        <Section icon={Bell} title="Benachrichtigungen">
          {[
            { key: "emailBeiNeuemDeal", label: "E-Mail bei neuem Deal", desc: "Sofort wenn ein neuer Deal deinen Kriterien entspricht" },
            { key: "emailTaeglich", label: "Tägliche Zusammenfassung", desc: "Jeden Morgen die besten Deals des Tages" },
            { key: "pushBenachrichtigungen", label: "Push-Benachrichtigungen", desc: "Browser-Benachrichtigungen für Top-Deals" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => update({ [key]: !settings[key as keyof typeof settings] } as any)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                  settings[key as keyof typeof settings]
                    ? "bg-blue-600"
                    : "bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                    settings[key as keyof typeof settings] ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </Section>

        {/* Anzeige */}
        <Section icon={Monitor} title="Anzeige">
          <InputRow label="Dark Mode">
            <button
              onClick={() => update({ darkMode: !settings.darkMode })}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                settings.darkMode ? "bg-blue-600" : "bg-gray-700"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  settings.darkMode ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </InputRow>
          <InputRow label="Währung">
            <select
              value={settings.waehrung}
              onChange={(e) => update({ waehrung: e.target.value })}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="CHF">CHF (Fr.)</option>
            </select>
          </InputRow>
        </Section>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-gray-500 text-xs">Einstellungen werden automatisch im Browser gespeichert.</p>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              saved
                ? "bg-green-600 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Gespeichert!" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
