// src/server/api/routers/user.ts

import { router, protectedProcedure, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import { hash, compare } from "bcryptjs";

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
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

      if (existingUser) throw new Error("Email already in use.");

      const hashedPassword = await hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "USER",
        },
      });

      return { success: true, userId: user.id };
    }),

  dashboardData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [favorites, savedSearches] = await Promise.all([
      prisma.favorite.findMany({ where: { userId }, select: { id: true } }),
      prisma.savedSearch.findMany({ where: { userId }, select: { id: true } }),
    ]);

    return {
      favoritesCount: favorites.length,
      savedSearchesCount: savedSearches.length,
      hasSettings: true,
    };
  }),

  updateUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        city: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await prisma.user.update({
        where: { id: userId },
        data: {
          name: `${input.firstName} ${input.lastName}`,
          city: input.city,
          zip: input.zip,
          country: input.country,
          location: input.location,
        },
      });

      return { success: true };
    }),

updateAvatar: protectedProcedure
  .input(z.object({ image: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return await prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { image: input.image }, // Ex: "/uploads/avatars/1719971234-avatar.png"
    });
  }),


  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.password) throw new Error("No password set");

      const isValid = await compare(input.currentPassword, user.password);
      if (!isValid) throw new Error("Incorrect password");

      const hashed = await hash(input.newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });

      return { success: true };
    }),
});
