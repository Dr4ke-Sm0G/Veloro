import { prisma } from "@/server/db";

export async function getArticleBySlug(slug: string) {
  return await prisma.article.findUnique({
    where: { slug },
    include: {
      categories: true,
    },
  });
}
export async function getLatestArticles(limit = 6) {
  return await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
    },
  });
}