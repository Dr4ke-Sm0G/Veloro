import { router } from "@/server/trpc";
import { healthRouter } from "./routers/health";
import { brandRouter } from "./routers/brand";
import { modelRouter } from "./routers/model";
import { userRouter } from "./routers/user";
import { variantRouter } from "./routers/variant";
import { adminRouter } from "./routers/admin";
import { articleRouter } from "./routers/article";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
  health: healthRouter,
  brand: brandRouter,
  model: modelRouter,
  user: userRouter,
  variant: variantRouter, 
  admin: adminRouter,
  article: articleRouter,
  category: categoryRouter,
});

// POUR TRPC CÔTÉ CLIENT
export type AppRouter = typeof appRouter;
