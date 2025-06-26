'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import clsx from 'clsx';

type Item = {
  img: string;
  title: string;
  href: string;
  badge?: string;
  videoId?: string;
};

type CarouselGridProps = {
  items: Item[];
  onVideoClick?: (videoId: string) => void;
};

export default function CarouselGrid({ items, onVideoClick }: CarouselGridProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    trackMouse: true,
  });

  const paginate = (dir: number) => {
    setPage((prev) => {
      const next = prev + dir;
      return Math.max(0, Math.min(next, totalPages - 1));
    });
  };

  const handleItemClick = (item: Item, e: React.MouseEvent) => {
    if (item.videoId) {
      e.preventDefault();
      onVideoClick?.(item.videoId);
    }
  };

  // Découpe les items par page
  const pagedItems: Item[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pagedItems.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <div className="relative overflow-hidden" {...swipeHandlers}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${page * 100}%)`, width: '100%' }}
      >
        {pagedItems.map((group, groupIndex) => (
          <div key={groupIndex} className="flex w-full flex-shrink-0 px-1">
            {group.map((item, i) => (
              <div key={i} className="w-1/3 px-2">
                <a
                  href={item.href}
                  className="block cursor-pointer group"
                  onClick={(e) => handleItemClick(item, e)}
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
                </a>
                <a
                  href={item.href}
                  className="font-semibold underline block hover:text-cyan-400 transition-colors"
                  onClick={(e) => item.videoId && e.preventDefault()}
                >
                  {item.title}
                </a>
                {item.badge && (
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-400 text-black font-bold text-sm rounded-md">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {page > 0 && (
        <button
          onClick={() => paginate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full shadow hover:bg-black z-10"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {page < totalPages - 1 && (
        <button
          onClick={() => paginate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full shadow hover:bg-black z-10"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}