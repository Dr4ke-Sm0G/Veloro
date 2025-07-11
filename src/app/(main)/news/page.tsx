import BrowseByCategorySection from "@/components/sections/BrowseByCategorySection";
import ContentGridSection from "@/components/sections/ContentGridSection";
import EditorialTeamSection from "@/components/sections/EditorialTeamSection";
import LatestArticlesSection from "@/components/sections/LatestArticlesSection";
import NewsHeroSection from "@/components/sections/NewsHeroSection";

export default function NewsPage() {
  return (
    <main>
      <NewsHeroSection />
      {/* Content Grid Section */}
      <LatestArticlesSection />
      <BrowseByCategorySection />
      <EditorialTeamSection />
    </main>
  );
}
