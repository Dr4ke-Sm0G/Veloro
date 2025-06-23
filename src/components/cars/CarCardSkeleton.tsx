import Image from "next/image";
import { ChevronRight } from "lucide-react"; // ou un <svg> custom

export default function CarCardSkeleton() {
  return (
<div className="bg-gray-200 rounded-xl w-full max-w-sm h-[450px] p-4 flex flex-col justify-between">
      {/* Contenu principal */}
      <div className="space-y-3">
        {/* Titre */}
        <h3 className="!px-4 !mt-4 text-black !font-bold">Volkswagen ID.4</h3>
        {/* Variante */}
        <div className="!px-4 text-sm text-gray-700">Match Pure</div>

        {/* Specs list inline */}
        <div className="!px-4 text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
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
            sizes="(max-width: 768px) 100vw, 400px"
            placeholder="blur"
            blurDataURL="/images/vw-blur.png"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/fallback.png"; // ajoute cette image si souhaité
            }}
          />
        </div>
        {/* Score + prix */}
        <div className="!ml-3 !mr-3 !pl-5 bg-[#eeeeee] rounded-2xl flex items-center justify-between">
          <div>
            {/* Étiquette + note */}
            <div className="flex items-center !gap-1 !mb-2">
              <div className="bg-[#00e0b8] text-black text-xs font-semibold !px-2 !py-0.5 rounded-l-md">
                Amazing deal
              </div>
              <div className="bg-black text-white text-xs font-bold !px-2 !py-0.5 rounded-r-md">
                9.6
              </div>
            </div>

            {/* Texte + prix */}
            <div className=" text-xs text-black">
              Buy Volkswagen ID.4
            </div>
            <div className=" text-lg font-bold text-black">
              £49,590
            </div>
          </div>

          {/* Flèche dans rond */}
          <div className="!mr-4 w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <ChevronRight className="text-white w-5 h-5" />
          </div>
        </div>
      </div>
      <a className="text-center underline font-semibold !text-black !pb-4">Buying details</a>
    </div>
  );
}
