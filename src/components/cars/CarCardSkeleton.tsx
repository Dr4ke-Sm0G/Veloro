import Image from "next/image";
import { ScaleIcon } from "lucide-react"; // ou ton propre icône de comparaison

export default function CarCardSkeleton() {
  return (
    <div className="bg-gray-200 rounded-xl w-[400px] h-[400px] p-4 flex flex-col justify-between">
      {/* Contenu principal */}
      <div className="space-y-3">
        {/* Titre */}
        <h3 className="px-2 font-bold text-gray-900">Volkswagen ID.4</h3>

        {/* Variante */}    
        <div className="text-sm text-gray-700">Match Pure</div>

        {/* Specs list inline */}
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
          <span>170 BHP</span>
          <span>•</span>
          <span>Automatic</span>
          <span>•</span>
          <span>Electric</span>
          <span>•</span>
          <span>5 doors</span>
        </div>

        {/* Image */}
        <div className="relative w-full h-60 rounded-lg overflow-hidden">
          <Image
            src="/images/vw.png"
            alt="Volkswagen ID.4"
            fill
            className="object-cover"
          />
        </div>

        {/* Score + prix */}
        <div className="flex justify-between items-center mt-2">
          <div className="pl-2">
            <div className="font-semibold text-gray-900">From £25,000</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Score */}
            <div className="bg-black text-white rounded-full px-6 py-2 text-sm font-bold">
              9.6
            </div>

            {/* Bouton de comparaison */}
            <button
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-300 transition"
              aria-label="Compare"
            >
              <ScaleIcon size={16} className="text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Bouton vers specs */}
      <div className="text-center mt-4">
        <button className="text-sm text-gray-800 underline hover:text-black">
          Car specifications
        </button>
      </div>
    </div>
  );
}
