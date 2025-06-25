'use client';

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    title: "Electric car charging point map",
    image: "/charging-map.png",
    href: "#",
  },
  {
    title: "Electric car costs comparison",
    image: "/charging-kid.png",
    href: "#",
  },
  {
    title: "Find out how much it costs to charge an electric car",
    image: "/charging-honda.png",
    href: "#",
  },
  {
    title: "How long does it take to charge a car?",
    image: "/charging-kid.png",
    href: "#",
  },
  {
    title: "EV charger types explained",
    image: "/charging-kid.png",
    href: "#",
  },
];

export default function ElectricSlider() {
  const [startIndex, setStartIndex] = useState(0);

  const canGoNext = startIndex + 3 < slides.length;
  const canGoPrev = startIndex > 0;

  const next = () => {
    if (canGoNext) setStartIndex(startIndex + 1);
  };

  const prev = () => {
    if (canGoPrev) setStartIndex(startIndex - 1);
  };

  const visibleSlides = slides.slice(startIndex, startIndex + 3);

  return (
    <section className="bg-[#e9e7e4] text-gray-900 py-14 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-cyan-400 text-white p-2 rounded-full">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Join the electric revolution!</h2>
            <p className="text-gray-700 text-sm">
              Check out our electric car tools and other helpful advice
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center">
          {/* Left arrow */}
          {canGoPrev && (
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute -left-5 z-10 bg-black text-white p-3 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Cards */}
          <div className="flex space-x-6 transition-transform duration-500 ease-in-out w-full overflow-hidden">
            {visibleSlides.map((slide, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <a href={slide.href} className="block">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <p className="text-sm font-bold underline">{slide.title}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {canGoNext && (
            <button
              onClick={next}
              aria-label="Next"
              className="absolute -right-5 z-10 bg-black text-white p-3 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <a
            href="/search?fuel=electric"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
          >
            Compare the best electric cars
          </a>
        </div>
      </div>
    </section>
  );
}
