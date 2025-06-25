type Item = {
  img: string;
  title: string;
  href: string;
  badge?: string;
};

type Props = {
  title: string;
  items: Item[];
  bg?: "dark" | "light";
  buttonLabel: string;
  buttonHref: string;
};

export default function ContentGridSection({
  title,
  items,
  bg = "light",
  buttonLabel,
  buttonHref,
}: Props) {
  const isDark = bg === "dark";
  const bgColor = isDark ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <section className={`${bgColor} py-14`}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ img, title, href, badge }, i) => (
            <div key={i}>
              <img src={img} alt={title} className="rounded-lg mb-4" />
              <a href={href} className="font-semibold underline block">
                {title}
              </a>
              {badge && (
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-400 text-black font-bold text-sm rounded-md">
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a
            href={buttonHref}
            className={`inline-block font-semibold px-32 py-3 rounded-lg hover:bg-gray-100 ${
              isDark ? "bg-white text-gray-900" : "bg-gray-900 text-white"
            }`}
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
