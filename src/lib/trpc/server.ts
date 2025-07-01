"use server";

import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/context";

export const serverClient = async () => {
  return appRouter.createCaller(
    createInnerTRPCContext({ session: null })
  );
};