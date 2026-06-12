"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusData {
  lastCrawledAt: string;
  newSinceLastVisit: number;
  totalCrawled: number;
  portalsChecked: string[];
}

interface CrawlStatusProps {
  onNewDeals?: () => void;
}

function timeAgo(iso: string): string {
  if (!iso) return "noch nicht";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  return `vor ${Math.floor(diff / 3600)} Std.`;
}

export function CrawlStatus({ onNewDeals }: CrawlStatusProps) {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [online, setOnline] = useState(true);
  const [pulse, setPulse] = useState(false);

  const fetchStatus = useCallback(async (reset = false) => {
    try {
      const res = await fetch(`/api/status${reset ? "?reset=1" : ""}`, { cache: "no-store" });
      const data = await res.json();
      setStatus(data);
      setOnline(true);
      if (data.newSinceLastVisit > 0 && onNewDeals) onNewDeals();
    } catch {
      setOnline(false);
    }
  }, [onNewDeals]);

  const triggerCrawl = useCallback(async () => {
    setScanning(true);
    setPulse(true);
    try {
      await fetch("/api/crawl?secret=immohack-cron-2024");
      await fetchStatus(true);
      if (onNewDeals) onNewDeals();
    } finally {
      setScanning(false);
      setTimeout(() => setPulse(false), 2000);
    }
  }, [fetchStatus, onNewDeals]);

  useEffect(() => {
    fetchStatus();
    const statusInterval = setInterval(() => fetchStatus(), 30_000);
    const crawlInterval = setInterval(() => triggerCrawl(), 15 * 60 * 1000);
    return () => {
      clearInterval(statusInterval);
      clearInterval(crawlInterval);
    };
  }, [fetchStatus, triggerCrawl]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          scanning ? "bg-amber-400 animate-pulse" :
          online ? "bg-green-400 animate-pulse" : "bg-red-500"
        )} />
        <span className="text-gray-500 text-xs">
          {scanning ? "Scannt Portale…" : online ? "Live" : "Offline"}
        </span>
      </div>

      <span className="text-gray-800 text-xs">·</span>

      <span className="text-gray-500 text-xs">
        Zuletzt: <span className="text-gray-400">{status ? timeAgo(status.lastCrawledAt) : "–"}</span>
      </span>

      {status && status.newSinceLastVisit > 0 && (
        <>
          <span className="text-gray-800 text-xs">·</span>
          <span className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-all",
            pulse ? "bg-green-400/20 text-green-400" : "bg-green-400/10 text-green-400"
          )}>
            <Sparkles className="w-3 h-3" />
            {status.newSinceLastVisit} neue Deal{status.newSinceLastVisit !== 1 ? "s" : ""}
          </span>
        </>
      )}

      <button
        onClick={triggerCrawl}
        disabled={scanning}
        className="ml-auto flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50"
        title="Jetzt alle Portale scannen"
      >
        <RefreshCw className={cn("w-3 h-3", scanning && "animate-spin")} />
        {scanning ? "Scannt…" : "Jetzt scannen"}
      </button>
    </div>
  );
}
