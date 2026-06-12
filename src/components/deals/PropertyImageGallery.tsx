"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export function PropertyImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-48 sm:h-64 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 flex items-center justify-center">
        <Building className="w-16 h-16 sm:w-20 sm:h-20 text-gray-700" />
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden bg-gray-900">
      <img
        src={images[current]}
        alt={`${title} – Bild ${current + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
                aria-label={`Bild ${i + 1}`}
              />
            ))}
          </div>
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
