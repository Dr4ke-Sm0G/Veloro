'use client';

import { useState } from "react";
import CarouselGrid from "@/components/sections/CarouselGrid";

type Item = {
  img: string;
  title: string;
  href: string;
  badge?: string;
  videoId?: string;
};

type Props = {
  title: string;
  items: Item[];
  bg?: "dark" | "light";
  buttonLabel: string;
  buttonHref: string;
  carousel?: boolean;
  description?: string;
  icon?: React.ReactNode;
};

export default function ContentGridSection({
  title,
  items,
  bg = "light",
  buttonLabel,
  buttonHref,
  carousel,
  description,
  icon,
}: Props) {
  const isDark = bg === "dark";
  const bgColor = isDark ? "bg-gray-900 text-white" : "bg-white text-black";
  const shouldUseCarousel = carousel ?? items.length > 3;

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  return (
    <>
      <section className={`${bgColor} py-14`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>

          {(icon || description) && (
            <div className="flex items-center gap-4 mb-6">
              {icon && (
                <div className="bg-cyan-400 text-white p-2 rounded-full">
                  {icon}
                </div>
              )}
              {description && (
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {description}
                </p>
              )}
            </div>
          )}

          {shouldUseCarousel ? (
            <CarouselGrid 
              items={items} 
              onVideoClick={setSelectedVideoId}
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="group block cursor-pointer"
                  onClick={(e) => {
                    if (item.videoId) {
                      e.preventDefault();
                      setSelectedVideoId(item.videoId);
                    }
                  }}
                >
                  <div className="relative pb-[65%] overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.videoId && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="bg-cyan-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          ▶
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold underline group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </p>
                  {item.badge && (
                    <span className="inline-block mt-2 px-3 py-1 bg-emerald-400 text-black font-bold text-sm rounded-md">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}

          <div className="mt-8">
            <a
              href={buttonHref}
              className={`inline-block font-semibold px-8 py-3 rounded-lg transition ${
                isDark
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {buttonLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Modal YouTube */}
      {selectedVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setSelectedVideoId(null)}
              className="absolute -top-12 right-0 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition z-50"
              aria-label="Fermer la vidéo"
            >
              ✕
            </button>
            
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}