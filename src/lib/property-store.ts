import type { Property } from "@/data/mock-properties";
import { MOCK_PROPERTIES } from "@/data/mock-properties";

export interface CrawlMeta {
  lastCrawledAt: string;
  newSinceLastVisit: number;
  totalCrawled: number;
  portalsChecked: string[];
  dealsFound: number;
  dealsFiltered: number;
}

let crawledProperties: Property[] = [];
let lastCrawledAt: Date | null = null;
let totalCrawlRuns = 0;
let newSinceLastVisit = 0;

export function getStore() {
  return {
    properties: [...MOCK_PROPERTIES, ...crawledProperties],
    crawledProperties,
    lastCrawledAt,
    totalCrawlRuns,
    newSinceLastVisit,
  };
}

export function addCrawledProperties(props: Property[]) {
  const existingIds = new Set([
    ...MOCK_PROPERTIES.map((p) => p.externalId),
    ...crawledProperties.map((p) => p.externalId),
  ]);
  const fresh = props.filter((p) => !existingIds.has(p.externalId));
  crawledProperties = [...crawledProperties, ...fresh];
  lastCrawledAt = new Date();
  totalCrawlRuns++;
  newSinceLastVisit += fresh.length;
  return fresh.length;
}

export function resetNewCount() {
  newSinceLastVisit = 0;
}

export function getCrawlMeta(): CrawlMeta {
  return {
    lastCrawledAt: lastCrawledAt?.toISOString() ?? "",
    newSinceLastVisit,
    totalCrawled: crawledProperties.length,
    portalsChecked: ["ImmobilienScout24", "Immowelt", "Immonet", "Kleinanzeigen"],
    dealsFound: crawledProperties.length + MOCK_PROPERTIES.length,
    dealsFiltered: Math.max(0, crawledProperties.length + MOCK_PROPERTIES.length - 5),
  };
}
