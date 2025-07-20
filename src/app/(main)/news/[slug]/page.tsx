// app/(main)/news/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata,ResolvingMetadata  } from "next";
import { getArticleBySlug } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;        

  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug : string }>}) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

  // Get the first category if it exists
  const firstCategory = article.categories[0];

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        ›{" "}
        <Link href="/news" className="hover:underline">
          News
        </Link>
        {firstCategory && ( // Add category to breadcrumb if it exists
          <>
            {" "}›{" "}
            <Link href={`/news/category/${firstCategory.slug}`} className="hover:underline">
              {firstCategory.name}
            </Link>
          </>
        )}
      </div>

      {/* Category Image and Name (Optional: Displayed before article title) */}
      {firstCategory && ( // Check if there's at least one category
        <div className="flex items-center gap-4 mb-6">
          {firstCategory.image && ( // Display category image if available
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={firstCategory.image}
                alt={firstCategory.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw" // Optimize image loading
              />
            </div>
          )}
          <Link href={`/news/category/${firstCategory.slug}`} className="text-xl font-semibold text-primary-600 hover:underline">
            {firstCategory.name}
          </Link>
        </div>
      )}

      {/* Titre */}
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      {/* Auteur + Date */}
      {article.publishedAt && (
        <p className="text-sm text-gray-500 mb-6">
          Published on{" "}
          {new Date(article.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {/* Image principale de l'article */}
      {article.coverImage && (
        <div className="relative w-full h-72 md:h-96 mb-6 overflow-hidden rounded-lg shadow-sm">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority // Article cover image is usually a high-priority asset
            sizes="(max-width: 768px) 100vw, 700px" // Optimize image loading for responsive layouts
          />
        </div>
      )}

      {/* Contenu */}
      <div
        className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200" // Added dark mode support for prose
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

