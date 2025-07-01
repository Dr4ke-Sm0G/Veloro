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
      {/* Grid normale */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Miniatures */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
          {images.map((img, i) => (
            <Image
              key={i}
              src={`/images/${img}`}
              alt={`Thumbnail ${i}`}
              width={104}
              height={68}
              onClick={() => setSelectedIndex(i)}
              className={`rounded-lg border cursor-pointer transition ${
                i === selectedIndex ? 'ring-2 ring-cyan-500' : ''
              }`}
            />
          ))}
        </div>

        {/* Image principale avec chevrons */}
        <div className="col-span-1 md:col-span-4 relative group">
          <Image
            src={`/images/${images[selectedIndex]}`}
            alt="Main image"
            width={800}
            height={600}
            onClick={() => setIsOpen(true)}
            className="rounded-xl border cursor-pointer object-contain w-full h-auto"
          />

          {/* Chevron gauche */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {/* Chevron droit */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </section>

      {/* Modale centrée */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* Image modale */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={`/images/${images[selectedIndex]}`}
                alt="Full view"
                className="rounded-lg object-contain max-h-[70vh] mx-auto"
              />
              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Pagination */}
            <p className="text-sm text-gray-600 text-center mt-2">
              {selectedIndex + 1}/{images.length}
            </p>

            {/* Miniatures en bas */}
            <div className="flex justify-center mt-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`border-2 rounded-lg overflow-hidden ${
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
