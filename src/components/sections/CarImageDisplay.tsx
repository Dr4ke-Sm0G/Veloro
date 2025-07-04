'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  images: string[];
};

export default function CarImageDisplay({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const prevImage = () =>
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % images.length);

  return (
    <>
      {/* Section avec miniatures + image principale */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Miniatures */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:col-span-1">
          {images.map((img, i) => (
            <Image
              key={i}
              src={`/images/${img}`}
              alt={`Thumbnail ${i}`}
              width={104}
              height={68}
              onClick={() => setSelectedIndex(i)}
              className={`rounded-lg border cursor-pointer flex-shrink-0 transition ${
                i === selectedIndex ? 'ring-2 ring-cyan-500' : ''
              }`}
            />
          ))}
        </div>

        {/* Image principale */}
        <div className="col-span-1 md:col-span-4 relative group">
          <Image
            src={`/images/${images[selectedIndex]}`}
            alt="Main image"
            width={800}
            height={600}
            onClick={() => setIsOpen(true)}
            className="rounded-xl border cursor-pointer object-contain w-full h-auto"
          />

          {/* Chevrons visibles en tout temps sur mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </section>

      {/* Modale responsive */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="relative bg-white rounded-xl p-4 w-full max-w-5xl max-h-[90vh] overflow-auto shadow-lg">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Image avec chevrons */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={`/images/${images[selectedIndex]}`}
                alt="Full view"
                className="rounded-lg object-contain max-h-[70vh] w-full"
              />
              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Pagination */}
            <p className="text-sm text-gray-600 text-center mt-2">
              {selectedIndex + 1}/{images.length}
            </p>

            {/* Miniatures bas, scrollable horizontalement sur mobile */}
            <div className="mt-4 flex gap-2 overflow-x-auto justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`border-2 rounded-lg overflow-hidden flex-shrink-0 ${
                    i === selectedIndex ? 'border-cyan-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={`/images/${img}`}
                    alt={`Thumb ${i}`}
                    width={80}
                    height={60}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
