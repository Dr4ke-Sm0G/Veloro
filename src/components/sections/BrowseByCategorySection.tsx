// components/sections/BrowseByCategorySection.tsx
import { prisma } from "@/server/db";
import CategoryCard from "../cards/CategoryCard";

export default async function BrowseByCategorySection() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 9,
  });

  return (
    <section className="bg-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.name}
              href={`/news/category/${category.slug}`}
              image={`/images/categories/${category.slug}.jpg`} // tu peux standardiser les noms d’image
            />
          ))}
        </div>
      </div>
    </section>
  );
}
