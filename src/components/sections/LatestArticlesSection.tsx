// components/sections/LatestArticlesSection.tsx
import ContentGridSection from "./ContentGridSection";
import { getLatestArticles } from "@/lib/api";

export default async function LatestArticlesSection() {
  const articles = await getLatestArticles();

  const items = articles.map((article) => ({
    title: article.title,
    href: `/news/${article.slug}`,
    img: article.coverImage ?? "/placeholder.jpg", // Fallback image
  }));

  return (
    <ContentGridSection
      title="Latest car news"
      bg="dark"
      buttonLabel="View more car news"
      buttonHref="/news"
      items={items}
    />
  );
}
