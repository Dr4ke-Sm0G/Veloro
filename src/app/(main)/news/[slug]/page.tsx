// app/(main)/news/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticleBySlug } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

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
      </div>

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

      {/* Image principale */}
      {article.coverImage && (
        <div className="relative w-full h-72 md:h-96 mb-6 overflow-hidden rounded-lg shadow-sm">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Contenu */}
      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
