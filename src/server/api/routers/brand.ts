import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const brandRouter = router({
 createBrand: publicProcedure
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
      const slug = input.name.toLowerCase().replace(/\s+/g, "-");

      const brand = await ctx.prisma.brand.create({
        data: {
          name: input.name,
          slug,
        },
      });

      return brand;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.brand.findMany();
  }),
});
