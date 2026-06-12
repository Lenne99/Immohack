import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { DealCard } from "@/components/deals/DealCard";
import { Heart } from "lucide-react";

// Demo: erste 4 als Favoriten
const FAVORITE_IDS = ["prop-001", "prop-002", "prop-014", "prop-012"];

export default function FavoritesPage() {
  const favorites = MOCK_PROPERTIES.filter((p) => FAVORITE_IDS.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Favoriten" />
      <div className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-400 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Meine Favoriten</h1>
            <p className="text-gray-500 text-sm">{favorites.length} gespeicherte Immobilien</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p>Noch keine Favoriten gespeichert</p>
            <p className="text-sm mt-1">Klicke auf das Herz-Symbol bei einer Immobilie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {favorites.map((property) => (
              <DealCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
