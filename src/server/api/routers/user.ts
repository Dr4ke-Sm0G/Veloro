// src/server/api/routers/user.ts
import { router, protectedProcedure, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import { hash } from 'bcryptjs' // en haut du fichier


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
    register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email already in use.");
      }

      const hashedPassword = await hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "USER", // ou "DEALER" ou choix par frontend
        },
      });

      return { success: true, userId: user.id };
    }),

});

