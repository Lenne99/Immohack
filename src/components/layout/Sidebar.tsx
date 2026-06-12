"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  BarChart3,
  Heart,
  FileText,
  Map,
  Bell,
  Settings,
  Building2,
  Zap,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, highlight: false },
  { href: "/starter", label: "Einstieg ≤150k", icon: Rocket, highlight: true },
  { href: "/deals", label: "Deal Liste", icon: Building2, highlight: false },
  { href: "/deal-finder", label: "Deal Finder", icon: Zap, highlight: false },
  { href: "/market", label: "Marktübersicht", icon: BarChart3, highlight: false },
  { href: "/map", label: "Kartenansicht", icon: Map, highlight: false },
  { href: "/favorites", label: "Favoriten", icon: Heart, highlight: false },
  { href: "/reports", label: "Reports", icon: FileText, highlight: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-40">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">ImmoAnalyse</h1>
            <p className="text-gray-500 text-xs">KI-Investment Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-gray-600 text-xs font-medium uppercase tracking-wider px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : item.highlight
                  ? "text-green-400 hover:text-green-300 hover:bg-green-500/10 border border-green-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/alerts"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <Bell className="w-4 h-4" />
          Benachrichtigungen
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <Settings className="w-4 h-4" />
          Einstellungen
        </Link>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
          <p className="text-blue-400 text-xs font-medium">PRO Plan</p>
          <p className="text-gray-500 text-xs mt-0.5">5.247 Immobilien analysiert</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full w-3/4" />
          </div>
        </div>
      </div>
    </aside>
  );
}
