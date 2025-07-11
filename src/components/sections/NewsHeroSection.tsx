// components/sections/NewsHeroSection.tsx
import Link from "next/link";

export default function NewsHeroSection() {
  return (
    <section className="bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-gray-200 rounded-xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm mb-4">
          <Link href="/" className="underline hover:text-primary">
            Home
          </Link>{" "}
          <span className="mx-2">›</span>
          <span className="font-medium">Editorial</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
          CAR NEWS, ADVICE <br className="hidden sm:block" /> & INFORMATION
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-800 mt-2">
          Our experts are here to help you with the latest news and advice for buying,
          selling and owning a car
        </p>
      </div>
    </section>
  );
}
