export default function Testimonials() {
  return (
    <section className="bg-[#e9e7e4] text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "Le processus d'achat de ma Tesla Model 3 a été incroyablement fluide. L'équipe a répondu à toutes mes questions sur l'autonomie et les bornes de recharge.",
              author: "Alexandre Martin",
              role: "Nouveau propriétaire d'une Model 3",
              rating: 5
            },
            {
              text: "Enfin un concessionnaire qui comprend vraiment les véhicules électriques ! Ils m'ont trouvé la Renault Zoé parfaite pour mes trajets quotidiens.",
              author: "Sophie Lambert",
              role: "Cliente satisfaite",
              rating: 5
            },
            {
              text: "Service après-vente exceptionnel. Quand j'ai eu un problème avec ma borne de recharge, ils ont tout arrangé en moins de 24h.",
              author: "Thomas Dubois",
              role: "Propriétaire d'une Nissan Leaf",
              rating: 4
            },
          ].map(({ text, author, role, rating }, i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg p-8 flex flex-col">
              {/* Étoiles de notation */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{text}"</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-gray-900 font-semibold">{author}</p>
                <p className="text-gray-600 text-sm">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}