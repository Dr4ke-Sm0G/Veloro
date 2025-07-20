// page.tsx
"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import TypeFilters from "@/components/filters/TypeFilters";
import BrandGrid from "@/components/sections/BrandGrid";
import PopularVariants from "@/components/sections/PopularVariants";
import FAQSection from "@/components/sections/FAQSection";
import ContentGridSection from "@/components/sections/ContentGridSection";
import HeroBanner from "@/components/sections/HeroBanner";
import QuickCategories from "@/components/sections/QuickCategories";
import DealsSection from "@/components/sections/DealsSection";
import Testimonials from "@/components/sections/Testimonials";

// No longer importing getLatestArticles directly here as it's a server function

/** Type d’un élément renvoyé par listPreview */
type VariantPreview = inferRouterOutputs<AppRouter>["variant"]["listPreview"][number];

// Define a type for your articles if you haven't already
type Article = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
};

export default function Home() {
  const { data = [], isLoading } = trpc.variant.listPreview.useQuery({ limit: 3 });

  const [articles, setArticles] = useState<Article[]>([]); // State to hold articles
  const [articlesLoading, setArticlesLoading] = useState(true); // State to manage loading
  const [articlesError, setArticlesError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setArticlesLoading(true);
        setArticlesError(null);
        // Fetch from your new API route
        const response = await fetch('/api/articles/latest?limit=6'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (error: any) {
        console.error("Error fetching articles:", error);
        setArticlesError("Failed to load latest news. Please try again later.");
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array means this runs once on mount

  const items = articles.map((article) => ({
    img: article.coverImage ?? "/placeholder.jpg",
    title: article.title,
    href: `/news/${article.slug}`,
  }));

  return (
    <main>
      {/* Hero Section */}
      <HeroBanner />

      {/* Quick Categories */}
      <QuickCategories />

      {/* Deals section */}
      <DealsSection />

      {/* Testimonials section */}
      <Testimonials />

      {/* News section */}
      {articlesError ? (
        <div className="text-red-500 text-center py-8">{articlesError}</div>
      ) : articlesLoading ? (
        <div className="py-8 text-center text-gray-500">Loading latest car news...</div> 
      ) : (
        <ContentGridSection
          title="Latest car news"
          bg="dark"
          buttonLabel="View more car news"
          buttonHref="/news"
          items={items}
        />
      )}

      {/* ... rest of your components ... */}

      <ContentGridSection
        title="Latest videos"
        bg="dark"
        buttonLabel="Watch more videos"
        buttonHref="https://www.youtube.com/@carwow"
        carousel
        items={[
          {
            img: "https://img.youtube.com/vi/lO4rVikAslM/hqdefault.jpg",
            title: "Best EV cars 2025 (Don't buy those...) | Which car ? ",
            href: "https://www.youtube.com/watch?v=lO4rVikAslM",
            videoId: "lO4rVikAslM",
          },
          {
            img: "https://img.youtube.com/vi/9vmCYY6TzyQ/hqdefault.jpg",
            title: " Is Living With an EV Worth it? My Honest Thoughts.",
            href: "https://www.youtube.com/watch?v=9vmCYY6TzyQ",
            videoId: "9vmCYY6TzyQ",
          },
          {
            img: "https://img.youtube.com/vi/xNZR4wB-T80/hqdefault.jpg",
            title: " Electric Cars For DUMMIES: Absolutely EVerything Explained ",
            href: "https://youtu.be/xNZR4wB-T80",
            videoId: "xNZR4wB-T80",
          },
        ]}
      />

      <ContentGridSection
        icon={<svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
        </svg>}
        title="Join the electric revolution!"
        description="Check out our electric car tools and other helpful advice"
        bg="light"
        buttonLabel="Compare the best electric cars"
        buttonHref="/search?fuel=electric"
        carousel
        items={[
          {
            img: "/charging-map.png",
            title: "Electric car charging point map",
            href: "#",
          },
          {
            img: "/charging-kid.png",
            title: "Electric car costs comparison",
            href: "#",
          },
          {
            img: "/charging-honda.png",
            title: "Find out how much it costs to charge an electric car",
            href: "#",
          },
          {
            img: "/charging-kid.png",
            title: "How long does it take to charge a car?",
            href: "#",
          },
          {
            img: "/charging-kid.png",
            title: "EV charger types explained",
            href: "#",
          },
        ]}
      />
      <TypeFilters />
      <BrandGrid />
      <PopularVariants />
      <FAQSection />
    </main>
  );
}