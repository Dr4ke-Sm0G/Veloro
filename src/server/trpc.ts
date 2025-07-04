// src/server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { Context } from "./context"; // ⬅️ le vrai Context avec prisma + session
import { AppRouter } from "./api/root";
import { Session } from "next-auth";

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

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
      session: ctx.session,
    } satisfies AuthedContext, // 👈 force le type correctement
  });
});


/** Helpers courants ------------------------------------------------------- */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * `protectedProcedure` — accessible seulement si l'utilisateur est connecté.
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/* Types aides pour React Query */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;


type AuthedContext = Context & {
  session: Exclude<Context["session"], null>; // session n'est plus nullable
  user: Session["user"]; // pour accès direct via `ctx.user`
};
