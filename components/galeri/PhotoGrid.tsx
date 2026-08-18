"use client";

import { useState } from "react";
import { Lightbox, type FotoGaleri } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  photos: FotoGaleri[];
};

export function PhotoGrid({ photos }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((foto, i) => (
          <Reveal key={i} delay={(i % 3) * 90} className="aspect-[4/3]">
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative h-full w-full overflow-hidden rounded-xl bg-hijau-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.src}
                alt={foto.caption ?? "Foto galeri"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {foto.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hijau-950/80 to-transparent px-3 pb-2 pt-8 text-left text-xs font-medium text-krem-50">
                  {foto.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
