export default function HeroBanner() {
  return (
    <section
      className="relative w-full h-[75vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Contenu centré */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            DRIVE DIFFERENT <br />DRIVE VELORO.
          </h1>

          <div className="mt-8">
            <a
              href="/search"
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-lg transition"
            >
              Find Your Perfect Car
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

