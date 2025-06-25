'use client';

import { useState } from 'react';

type Video = {
  id: string;
  title: string;
  thumbnail: string;
};

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <>
      <section className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Latest videos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="cursor-pointer" onClick={() => setSelectedVideo(video.id)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="rounded-lg mb-4 w-full"
                />
                <p className="font-semibold underline">{video.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="https://www.youtube.com/@carwow"
              target="_blank"
              className="inline-block bg-white text-gray-900 font-semibold px-32 py-3 rounded-lg hover:bg-gray-100"
            >
              Watch more videos
            </a>
          </div>
        </div>
      </section>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
