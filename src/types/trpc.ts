// src/types/trpc.ts

import type { RouterInputs, RouterOutputs } from "@/server/trpc";

export type { RouterInputs, RouterOutputs, VariantFull };

type VariantFull = RouterOutputs["variant"]["listByModel"][number];