export default function HeroBanner() {
  return (
    <section
      className="relative w-full h-[75vh] bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-white pt-[120px]">
        <h1 className="text-5xl font-black leading-tight max-w-xl">
          DRIVE DIFFERENT <br />DRIVE VELORO.
        </h1>
        <div className="mt-8 flex gap-4 flex-wrap">
          <a href="/search" className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-lg transition">
            Find Your Perfect Car
          </a>
        </div>
      </div>
    </section>
  );
}
