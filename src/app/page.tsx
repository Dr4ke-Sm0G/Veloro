"use client";

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
  icon={            <svg
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
/>    <TypeFilters />
      <BrandGrid />
      <PopularVariants />
      <FAQSection />
    </main>
  );
}