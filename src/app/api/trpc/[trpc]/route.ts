import { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/api/root";
import { createContext } from "@/server/context";

// Fonction interne : pas exportée
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

// Seuls ces exports sont autorisés par Next.js
export const GET = handler;
export const POST = handler;
