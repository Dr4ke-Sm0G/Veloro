const bodyTypes = [
  { label: "SUVs", value: "SUVs", icon: "suv.svg" },
  { label: "Hatchbacks", value: "hatchbacks", icon: "hatchback.svg" },
  { label: "Saloons", value: "saloons", icon: "saloon.svg" },
  { label: "Coupes", value: "coupes", icon: "coupe.svg" },
  { label: "Estate cars", value: "estate-cars", icon: "estate.svg" },
  { label: "Sports cars", value: "sports-cars", icon: "sports_car.svg" },
  { label: "Convertibles", value: "convertibles", icon: "convertible.svg" },
];

export default function TypeFilters() {
  return (
<section className="w-full bg-[#e9e7e4] py-10">
  <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-black">Browse by body type</h2>
    <div className="flex overflow-x-auto gap-3">
      {bodyTypes.map(({ label, value, icon }) => (
        <a
          key={value}
          href={`/car-chooser?body_type=${value}`}
          className="flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg p-3 w-37 h-25 shadow-sm hover:shadow-md transition border border-gray-200 hover:border-gray-300"
          data-interaction-element={`Body type - ${label}`}
          data-interaction-section="Browse by car type"
        >
          <img
            src={`/CarSVG/${icon}`}
            alt={label}
            className="w-20 h-20 object-contain mb-1"
          />
          <span className="text-sm font-medium text-gray-800 text-center">{label}</span>
        </a>
      ))}
    </div>
  </div>
</section>

  );
}
