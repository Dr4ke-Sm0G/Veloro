import { prisma } from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/** ----------------------------------------------------------------
 * Type du contexte accessible dans tous les routers / procedures
 * ---------------------------------------------------------------- */
export type Context = {
  prisma: typeof prisma;
  session: Session | null;
  ip?: string;
};

/** ----------------------------------------------------------------
 * Fonction appelée par l’adapteur `fetchRequestHandler`
 * Doit accepter exactement `FetchCreateContextFnOptions`
 * ---------------------------------------------------------------- */
export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<Context> {
  const { req } = opts;

  // Récupère la session (v4) — si tu es en Next-Auth v5, remplace par `auth()`
  const session = await getServerSession(authOptions);

  const ip = req.headers.get("x-forwarded-for") ?? "";

  return { prisma, session, ip };
}

/** ----------------------------------------------------------------
 * Contexte interne pour les appels serveurs (createCaller)
 * ---------------------------------------------------------------- */
export function createInnerTRPCContext(opts: {
  session: Session | null;
  ip?: string;
}): Context {
  return {
    prisma,
    session: opts.session,
    ip: opts.ip,
  };
}
