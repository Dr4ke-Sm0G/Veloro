// app/(main)/news/category/[slug]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import ContentGridSection from "@/components/sections/ContentGridSection";
import Image from "next/image"; 

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

  // Si la catégorie n'existe pas ou n'a pas d'articles publiés, on renvoie une 404
  if (!category || category.articles.length === 0) return notFound();

  return (
    <main className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* SECTION DE L'IMAGE ET DU TITRE DE LA CATÉGORIE */}
        <div className="mb-8 text-center"> {/* Ajoutez une marge inférieure et centrez le texte/image */}
          {category.image && ( // <--- AFFICHE L'IMAGE SI ELLE EXISTE
            <div className="relative w-full h-64 sm:h-80 md:h-96 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={category.image}
                alt={category.name}
                fill // Permet à l'image de remplir le conteneur parent
                style={{ objectFit: 'cover' }} // Assure que l'image couvre le conteneur sans distorsion
                className="rounded-lg" // Applique des bords arrondis à l'image
                priority // Charge l'image prioritairement car c'est une image "héro"
              />
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            {category.name}
          </h1>
          {category.description && ( // <--- AFFICHE LA DESCRIPTION SI ELLE EXISTE
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
        {/* FIN DE LA SECTION DE L'IMAGE ET DU TITRE DE LA CATÉGORIE */}

        <ContentGridSection
          title={`Derniers articles dans ${category.name}`} // Texte mis à jour pour correspondre au contexte
          buttonLabel="Retour aux actualités" // Texte mis à jour
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

// Le générateur de métadonnées reste inchangé, mais assurez-vous que la description est pertinente
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  return {
    title: `Catégorie : ${category.name}`,
    description: category.description || `Explorez les dernières actualités et articles dans ${category.name}`, // Utilise la description de la catégorie ou une valeur par défaut
  };
}