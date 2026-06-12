"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Zap,
  Heart,
  Settings,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Meine Deals", icon: LayoutDashboard },
  { href: "/deals", label: "Alle Deals", icon: Building2 },
  { href: "/deal-finder", label: "Deal Finder", icon: Zap },
  { href: "/starter", label: "Einstieg ≤ 150k", icon: Rocket },
  { href: "/market", label: "Marktübersicht", icon: TrendingUp },
  { href: "/favorites", label: "Favoriten", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-gray-950 border-r border-gray-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">ImmoAnalyse</p>
            <p className="text-gray-600 text-xs">KI · Deal Scout</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-gray-500 hover:text-white hover:bg-gray-900"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-5 border-t border-gray-800 pt-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-blue-600/15 text-blue-400"
              : "text-gray-500 hover:text-white hover:bg-gray-900"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Einstellungen
        </Link>
      </div>
    </aside>
  );
}
