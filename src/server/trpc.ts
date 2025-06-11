// src/server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context"; // ⬅️ le vrai Context avec prisma + session

/**
 * Initialise tRPC avec le contexte commun à tout le backend.
 * Le même `Context` est utilisé partout (routers, procedures, handlers API).
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/** Middleware de vérification d'authentification */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // ⚡️ ICI on “renvoie” un nouveau ctx dont session est typé non-nul
  return next({
    ctx: {
      ...ctx,
      session: ctx.session, // ← TypeScript sait maintenant qu’il n’est plus null
    },
  });
});

/** Helpers courants ------------------------------------------------------- */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * `protectedProcedure` — accessible seulement si l'utilisateur est connecté.
 */
export const protectedProcedure = t.procedure.use(isAuthed);
