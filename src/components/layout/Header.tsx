"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header({ title }: { title?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/deals?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-gray-950 border-b border-gray-800 flex items-center px-3 sm:px-6 gap-3 sm:gap-4">
      {title && (
        <h2 className="text-white font-semibold text-base sm:text-lg hidden md:block min-w-max">{title}</h2>
      )}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Stadt, PLZ oder Adresse..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
          />
        </div>
      </form>
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            L
          </div>
          <div className="hidden md:block">
            <p className="text-white text-sm font-medium leading-tight">Lenny G.</p>
            <p className="text-gray-500 text-xs">PRO</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
