"use client";

import { useEffect, useState } from "react";

export type FotoGaleri = {
  src: string;
  caption?: string | null;
};

export function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: FotoGaleri[];
  index: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(index);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [photos.length, onClose]);

  if (photos.length === 0) return null;
  const foto = photos[idx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-hijau-950/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        ✕
      </button>

      <button
        type="button"
        aria-label="Sebelumnya"
        onClick={(e) => {
          e.stopPropagation();
          setIdx((i) => (i - 1 + photos.length) % photos.length);
        }}
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
      >
        ‹
      </button>

      <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto.src}
          alt={foto.caption ?? "Foto galeri"}
          className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-krem-100">
          {foto.caption && <span className="font-medium">{foto.caption}</span>}
          <span className="ml-2 text-krem-100/60">
            {idx + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        aria-label="Berikutnya"
        onClick={(e) => {
          e.stopPropagation();
          setIdx((i) => (i + 1) % photos.length);
        }}
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
      >
        ›
      </button>
    </div>
  );
}
