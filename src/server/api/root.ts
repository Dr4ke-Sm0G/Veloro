import { router } from "@/server/trpc";
import { healthRouter } from "./routers/health";
import { brandRouter } from "./routers/brand";
import { modelRouter } from "./routers/model";
import { userRouter } from "./routers/user";

export const appRouter = router({
  health: healthRouter,
  brand: brandRouter,
  model: modelRouter,
  user: userRouter,
});

// POUR TRPC CÔTÉ CLIENT
export type AppRouter = typeof appRouter;
