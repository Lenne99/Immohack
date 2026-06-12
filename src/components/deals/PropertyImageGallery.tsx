"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertyImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-72 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 flex items-center justify-center">
        <Building className="w-20 h-20 text-gray-700" />
      </div>
    );
  }

  return (
    <div className="relative h-72 overflow-hidden bg-gray-900">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${title} – Bild ${i + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            i === current ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
          <span className="absolute bottom-3 right-4 text-white/60 text-xs">
            {current + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
