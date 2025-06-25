import { filters } from "@/components/filters/CategoryFilters";

export default function QuickCategories() {
  return (
    <section className="w-full bg-[#e9e7e4] py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
        {filters.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full bg-white text-sm text-gray-800 hover:bg-gray-100 transition"
          >
            <span className="w-5 h-5">{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
