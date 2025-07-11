// components/cards/CategoryCard.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  href: string;
  image: string;
};

export default function CategoryCard({ title, href, image }: Props) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden rounded-xl group block aspect-[2/1] bg-gray-200"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
        <span className="font-bold text-lg">{title}</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </Link>
  );
}
