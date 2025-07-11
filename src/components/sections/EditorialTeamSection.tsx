// components/sections/EditorialTeamSection.tsx
import Link from "next/link";

export default function EditorialTeamSection() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm flex gap-4 items-start">
          {/* Icône */}
          <div className="flex-shrink-0">
            <div className="bg-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>

          {/* Texte */}
          <div>
            <h3 className="font-bold text-lg mb-1">Veloro editorial team</h3>
            <p className="text-gray-700 mb-2">
              Our team of car experts are here to help with everything you need to
              know about cars. looking for your next one, our experienced team have the latest news,
              detailed reviews, how-to guides and much, much more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
