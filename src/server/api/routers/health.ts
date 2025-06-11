// src/server/api/routers/health.ts
import { publicProcedure, router } from "../../trpc";

export const healthRouter = router({
  ping: publicProcedure.query(() => {
    return { status: "ok", date: new Date() };
  }),
});
