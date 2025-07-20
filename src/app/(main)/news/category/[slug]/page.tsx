import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import ContentGridSection from "@/components/sections/ContentGridSection";
import Image from "next/image";
import { Metadata,ResolvingMetadata  } from "next";



export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  return {
    title: `Catégorie : ${category.name}`,
    description:
      category.description ??
      `Explorez les dernières actualités et articles dans ${category.name}`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug : string }>}) {
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
        <div className="mb-8 text-center">
          {category.image && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                priority
              />
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        <ContentGridSection
          title={`Derniers articles dans ${category.name}`}
          buttonLabel="Retour aux actualités"
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

