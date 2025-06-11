// src/server/api/routers/user.ts
import { router, protectedProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return user;
  }),

  getAll: protectedProcedure.query(async () => {
    return await prisma.user.findMany();
  }),

  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.user.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
