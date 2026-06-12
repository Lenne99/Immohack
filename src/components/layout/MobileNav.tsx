"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Zap, Rocket, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Deals", icon: LayoutDashboard },
  { href: "/deals", label: "Alle", icon: Building2 },
  { href: "/deal-finder", label: "Finder", icon: Zap },
  { href: "/starter", label: "Starter", icon: Rocket },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 flex md:hidden z-50">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors",
              active ? "text-blue-400" : "text-gray-500"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
