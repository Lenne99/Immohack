"use client";

import { useSettings } from "@/lib/settings-context";
import { MapPin, Settings } from "lucide-react";
import Link from "next/link";

export function RegionBanner() {
  const { regionLabel, settings } = useSettings();

  if (settings.investmentFokus === "deutschland") return null;

  return (
    <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-xl px-4 py-2.5 mb-4 text-sm">
      <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
      <span className="text-blue-400 font-semibold">Regionaler Fokus:</span>
      <span className="text-gray-300">{regionLabel}</span>
      <Link href="/settings" className="ml-auto text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
        <Settings className="w-3 h-3" />
        Ändern
      </Link>
    </div>
  );
}
