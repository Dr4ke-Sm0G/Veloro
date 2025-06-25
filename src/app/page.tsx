"use client";

import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import TypeFilters from "@/components/sections/TypeFilters";
import ElectricSlider from "@/components/sections/ElectricSlider";
import BrandGrid from "@/components/sections/BrandGrid";
import PopularVariants from "@/components/sections/PopularVariants";
import FAQSection from "@/components/sections/FAQSection";
import ContentGridSection from "@/components/sections/ContentGridSection";
import VideoGallery from "@/components/sections/VideoGallery";
import HeroBanner from "@/components/sections/HeroBanner";
import QuickCategories from "@/components/sections/QuickCategories";
import DealsSection from "@/components/sections/DealsSection";
import Testimonials from "@/components/sections/Testimonials";


/** Type d’un élément renvoyé par listPreview */
type VariantPreview = inferRouterOutputs<AppRouter>["variant"]["listPreview"][number];

export default function Home() {
  const { data = [], isLoading } = trpc.variant.listPreview.useQuery({ limit: 3 });


  return (
    <main>
      {/* Hero Section */}
      <HeroBanner />

      {/* Catégories rapides */}
      <QuickCategories />

      {/* Deals section */}
      <DealsSection />

      {/* Testimonials section */}
      <Testimonials />

      {/* News section */}
      <ContentGridSection
        title="Latest car news"
        bg="dark"
        buttonLabel="View more car news"
        buttonHref="/news"
        items={[
          {
            img: "/hero3.jpg",
            title: "3 things you should NEVER say when taking out finance",
            href: "#",
          },
          {
            img: "/hero3.jpg",
            title: "10 best home EV chargers in the UK",
            href: "#",
          },
          {
            img: "/hero3.jpg",
            title: "Where To Charge Your EV For Free",
            href: "#",
          },
                    {
            img: "/hero3.jpg",
            title: "Where To Charge Your EV For Free",
            href: "#",
          },
                    {
            img: "/hero3.jpg",
            title: "Where To Charge Your EV For Free",
            href: "#",
          },
                              {
            img: "/hero3.jpg",
            title: "Where To Charge Your EV For Free",
            href: "#",
          },
                              {
            img: "/hero3.jpg",
            title: "Where To Charge Your EV For Free",
            href: "#",
          },

          
          
        ]}
      />
      {/* Reviews section */}
      <ContentGridSection
        title="Popular in-depth reviews"
        bg="dark"
        buttonLabel="Read more reviews"
        buttonHref="/reviews"
        items={[
                    {
            img: "images/daciaspring.jpg",
            title: "Dacia Spring",
            href: "#",
            badge: "9/10",
          },
          {
            img: "images/daciaspring.jpg",
            title: "Dacia Spring",
            href: "#",
            badge: "9/10",
          },
          {
            img: "images/2025-bmw-m5.avif",
            title: "BMW Starge X",
            href: "#",
            badge: "9/10",
          },
          {
            img: "images/byd.jpg",
            title: "BYD Seal Review",
            href: "#",
            badge: "9/10",
          },



        ]}
      />
      <VideoGallery
        videos={[
          {
            id: "u2SZ5FZfF6s",
            title: "I blew up a BMW, Audi & Merc: which lasted longest?",
            thumbnail: "https://img.youtube.com/vi/u2SZ5FZfF6s/hqdefault.jpg",
          },
          {
            id: "aBcDeFg1234",
            title: "This AMG has something the BMW M5 doesn't...",
            thumbnail: "https://img.youtube.com/vi/aBcDeFg1234/hqdefault.jpg",
          },
          {
            id: "ZyXwVuT9876",
            title: "Are new SUVs pointless ?",
            thumbnail: "https://img.youtube.com/vi/ZyXwVuT9876/hqdefault.jpg",
          },
        ]}
      />
      <ElectricSlider />
      <TypeFilters />
      <BrandGrid />
      <PopularVariants />
      <FAQSection />
    </main>
  );
}
