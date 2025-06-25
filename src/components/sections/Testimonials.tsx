export default function Testimonials() {
  return (
    <section className="bg-[#e9e7e4] text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8">What our users are saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "This app has been a game changer for me! I highly recommend it to anyone looking to streamline their workflow.",
              author: "John Doe, CEO",
            },
            {
              text: "I've tried a lot of different apps, but this one really stands out. It's so easy to use, and the features are exactly what I need.",
              author: "Jane Smith, Designer",
            },
            {
              text: "I love how customizable this app is. I can really make it work for me, no matter what project I'm working on.",
              author: "Bob Johnson, Developer",
            },
          ].map(({ text, author }, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-8">
              <p className="text-gray-700 mb-4">"{text}"</p>
              <p className="text-gray-700 font-medium">- {author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
