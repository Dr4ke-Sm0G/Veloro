// src/components/comparison/ComparisonBar.tsx
"use client";

import { useComparisonStore } from "@/store/comparison-store";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, Trash2, XCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function ComparisonBar() {
  const { selectedIds, removeCar, clear } = useComparisonStore();
  const router = useRouter();

  const { data: variants } = api.variant.getVariantsByIds.useQuery(
    { ids: selectedIds },
    { enabled: selectedIds.length > 0 }
  );

  // Ne rien afficher si aucune voiture n'est sélectionnée pour la comparaison
  if (!selectedIds.length) return null;

  return (
    <TooltipProvider delayDuration={100}>
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm text-white"
        >
          {/* Ligne de dégradé supérieure pour un effet visuel moderne */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            
            {/* 🧩 Conteneur des slots pour les voitures */}
            <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
              {Array.from({ length: 3 }).map((_, i) => {
                const variant = variants?.find(v => v.id === selectedIds[i]);
                const id = selectedIds[i];
                const nextVariantExists = variants?.find(v => v.id === selectedIds[i + 1]);

                return (
                  <React.Fragment key={id ?? `empty-${i}`}>
                    <AnimatePresence>
                      {id && variant ? (
                        // ✅ Slot rempli avec une voiture sélectionnée
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="group relative w-44 h-24 flex flex-col items-center justify-center gap-2 p-2 border border-slate-700 bg-slate-800/50 rounded-lg shadow-lg transition-transform hover:scale-105"
                        >
                          <Image
                            src={`/BrandLogos/${variant.brandName.toLowerCase()}.svg`}
                            alt={variant.brandName}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                          <div className="text-center text-xs leading-tight">
                            <div className="font-bold">{variant.brandName} {variant.modelName}</div>
                            <div className="text-slate-400">{variant.trim} • {variant.year}</div>
                          </div>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => removeCar(id)}
                                className="absolute top-1 right-1 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <XCircle size={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Retirer</p>
                            </TooltipContent>
                          </Tooltip>

                        </motion.div>
                      ) : (
                        // 텅 Slot vide pour ajouter une voiture
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => router.push("/#car-grid")} // Navigue vers la section de recherche
                              className="w-44 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-800/30 rounded-lg transition-colors hover:bg-slate-800/60"
                            >
                              <PlusCircle size={24} className="text-slate-500" />
                              <span className="text-sm text-slate-500">Ajouter</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ajouter une voiture</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </AnimatePresence>
                    
                    {/* Séparateur "VS" entre les voitures */}
                    {variant && nextVariantExists && (
                       <div className="hidden md:flex text-slate-600 text-xl font-black">VS</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* 🎯 Conteneur pour les boutons d'action */}
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-700/50 pt-3 md:pt-0 md:pl-5 mt-2 md:mt-0">
              <Button
                size="lg"
                disabled={selectedIds.length < 2}
                onClick={() => router.push(`/compare?ids=${selectedIds.join(",")}`)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Scale size={18} className="mr-2" />
                Comparer ({selectedIds.length})
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clear}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <Trash2 size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réinitialiser</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
}