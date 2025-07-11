// app/(main)/news/category/[slug]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import ContentGridSection from "@/components/sections/ContentGridSection";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 12,
      },
    },
  });

  if (!category || category.articles.length === 0) return notFound();

  return (
    <main className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">{category.name}</h1>

        <ContentGridSection
          title={`Latest in ${category.name}`}
          buttonLabel="Back to all news"
          buttonHref="/news"
          carousel={false}
          items={category.articles.map((article) => ({
            title: article.title,
            href: `/news/${article.slug}`,
            img: article.coverImage ?? "/placeholder.jpg",
          }))}
        />
      </div>
    </main>
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  return {
    title: `Category: ${category.name}`,
    description: `Explore the latest news and articles in ${category.name}`,
  };
}
