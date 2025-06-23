import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function CarCardSkeleton() {
  return (
    <div className="bg-gray-200 rounded-xl w-full max-w-sm aspect-square shadow-md flex flex-col p-3">
      {/* Haut : texte */}
      <div className="flex flex-col gap-1 text-sm text-black flex-shrink">
        <h3 className="text-xl font-bold ">
          Volkswagen ID.4
        </h3>
        <p className="text-sm text-gray-700">Match Pure</p>
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
          <span>170 BHP</span>
          <span>•</span>
          <span>Automatic</span>
          <span>•</span>
          <span>Electric</span>
          <span>•</span>
          <span>5 doors</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-[70%] rounded-lg overflow-hidden my-2">
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
            target.src = "/images/fallback.png";
          }}
        />
      </div>

      {/* Bloc prix */}
      <div className="bg-[#eeeeee] rounded-2xl flex justify-between items-center px-3 py-1 flex-shrink">
        <div className="text-xs flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <span className="bg-[#00e0b8] text-black text-xs font-semibold px-2 py-[2px] rounded-l-md">
              Amazing deal
            </span>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-[2px] rounded-r-md">
              9.6
            </span>
          </div>
          <div className="text-black font-medium">Buy Volkswagen ID.4</div>
          <div className=" text-black font-bold text-base">£49,590</div>
        </div>

        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <ChevronRight className="text-white w-4 h-4" />
        </div>
      </div>

      {/* Footer lien */}
      <div className="pt-2 text-center text-xs font-semibold underline text-black">
        BUYING DETAILS
      </div>
    </div>
  );
}
