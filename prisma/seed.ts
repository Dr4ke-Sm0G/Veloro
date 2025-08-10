import { PrismaClient } from '@prisma/client';


export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
const prisma = new PrismaClient();
const categories = [
  'Auto News',
  'Road Tests',
  'Electric Cars',
  'Comparisons',
  'Buying Guides',
  'Maintenance Tips',
];

const articlesData = {
  'Auto News': [
    {
      title: 'The EV Market in 2025: Trends and Forecasts',
      excerpt: 'An analysis of current market dynamics, technological innovations, and growth forecasts for electric cars in 2025.',
      content: 'The electric vehicle (EV) market continues its rapid expansion in 2025, driven by constant innovations and increasing environmental awareness. Manufacturers are competing fiercely to offer increasingly high-performing models, with record autonomies and reduced charging times. We are witnessing a democratization of EVs, with the arrival of more affordable models, making this technology accessible to a wider audience. Government incentive policies also play a crucial role in this transition, with ecological bonuses and expanding charging infrastructure. However, challenges persist, particularly concerning battery production and component recycling. Automotive giants, as well as new players, are investing heavily in research and development to overcome these obstacles and shape the future of mobility. Electric SUVs, despite their higher carbon footprint during production, remain very popular, while electric city cars gain ground for urban commutes.',
      coverImage: 'https://placehold.co/1200x600/FF5733/FFFFFF?text=EV+News+2025',
    },
    {
      title: 'New European Regulations on EV Batteries: What\'s Changing',
      excerpt: 'An overview of new European laws concerning the manufacturing, recycling, and integration of recycled raw materials in electric car batteries.',
      content: 'The European Union has implemented strict new regulations concerning electric vehicle batteries, aiming to promote a circular economy and reduce environmental impact. These laws impose higher recycling quotas for key materials like cobalt, copper, nickel, and lithium, and require the integration of recycled raw materials into new batteries. The goal is to minimize reliance on virgin resources and ensure more sustainable management of batteries throughout their lifecycle. For manufacturers, this means increased investment in recycling technologies and more transparent and responsible supply chains. These measures are expected to not only reduce the carbon footprint of EVs but also stabilize battery prices in the long term, making electric vehicles even more competitive against combustion models.',
      coverImage: 'https://placehold.co/1200x600/33FF57/FFFFFF?text=EU+EV+Battery+Regs',
    },
    {
      title: 'Paris Motor Show 2024: The Electric Revelations Not to Miss',
      excerpt: 'A recap of the most striking launches and innovative concepts presented at the 2024 Paris Motor Show, with a focus on electric vehicles.',
      content: 'The 2024 Paris Motor Show was the scene of many exciting revelations in the world of electric vehicles. Manufacturers unveiled a range of new models, from compact city cars to family SUVs and luxury sedans. Among the stars of the show, we could admire the new Peugeot e-5008, a large 7-seater SUV promising impressive autonomy, and the Citroën ë-C3 Aircross, positioning itself as an affordable option for families. Renault also made a splash with the presentation of its new electric Renault 4, revisiting a classic with a modern touch. These launches demonstrate the brands\' commitment to accelerating the transition to electric mobility, offering vehicles adapted to all needs and budgets. Innovation was key, with advancements in design, connectivity, and battery performance.',
      coverImage: 'https://placehold.co/1200x600/3357FF/FFFFFF?text=Motor+Show+EVs',
    },
  ],
  'Road Tests': [
    {
      title: 'Full Review: Tesla Model 3 Long Range – The Autonomy Standard-Bearer',
      excerpt: 'Our detailed test of the Tesla Model 3 Long Range, its performance, real-world autonomy, and long-distance driving experience.',
      content: 'The Tesla Model 3 Long Range continues to assert itself as a benchmark in the electric vehicle market. During our road test, it demonstrated impressive autonomy, exceeding 500 km in real conditions, making it an ideal candidate for long journeys. The blistering acceleration and precise handling offer a dynamic and engaging driving experience. The minimalist yet high-tech interior, dominated by the large central screen, is intuitive and rich in features. Tesla\'s Supercharger network remains a major asset, guaranteeing fast and efficient charging. However, suspension comfort, though improved, can still be perceived as firm on some surfaces. Overall, the Model 3 Long Range confirms its leading position, combining performance, technology, and practicality for everyday use.',
      coverImage: 'https://placehold.co/1200x600/8A2BE2/FFFFFF?text=Tesla+Model+3+Test',
    },
    {
      title: 'Behind the Wheel of the Hyundai Ioniq 6: Futuristic Design and Energy Efficiency',
      excerpt: 'Discover our opinion on the Hyundai Ioniq 6, its aerodynamic design, embedded technologies, and optimized electrical consumption.',
      content: 'The Hyundai Ioniq 6 stands out with its bold and futuristic "streamliner" design, which leaves no one indifferent. But beyond its unique aesthetic, this electric sedan shines with its remarkable energy efficiency. Our test highlighted very low consumption, allowing it to achieve a theoretical range of over 600 km in some configurations. The interior is spacious and comfortable, with particular attention paid to sustainable materials. The embedded technologies are cutting-edge, offering seamless connectivity and advanced driving aids. Driving is smooth and quiet, ideal for daily commutes as well as longer distances. The Ioniq 6 is proof that electric can rhyme with style, performance, and environmental respect.',
      coverImage: 'https://placehold.co/1200x600/DAA520/FFFFFF?text=Hyundai+Ioniq+6+Test',
    },
    {
      title: 'Skoda Elroq: The New Electric Family SUV on Test',
      excerpt: 'Our test of the Skoda Elroq, the compact electric SUV that aims to combine space, practicality, and autonomy for families.',
      content: 'The Skoda Elroq enters the compact electric SUV market with strong arguments to appeal to families. During our test, we appreciated its generous habitability, typical of Skoda, offering comfortable space for all passengers and a substantial boot volume. Based on the Volkswagen Group\'s MEB platform, the Elroq offers balanced driving, focused on comfort and versatility. The announced range, around 300 to 400 km depending on the version, is sufficient for most daily uses and weekend getaways. The user interface is intuitive and driving aids are effective. The Skoda Elroq positions itself as a serious and pragmatic alternative for families wishing to switch to electric without compromising space and practicality.',
      coverImage: 'https://placehold.co/1200x600/008080/FFFFFF?text=Skoda+Elroq+Test',
    },
  ],
  'Electric Cars': [
    {
      title: 'Top 10 Electric Cars with the Longest Range in 2025',
      excerpt: 'A ranking of electric vehicles offering the greatest ranges on the market in 2025, with their key specifications.',
      content: 'Range is an essential criterion for many electric car buyers, and manufacturers are constantly pushing the boundaries. In 2025, several models stand out for their impressive capabilities. The Lucid Air Grand Touring leads the way with a record range of nearly 900 km, closely followed by the Mercedes-Benz EQS. The Tesla Model S and Hyundai Ioniq 6 also rank well, offering ranges over 600 km. These vehicles integrate large-capacity batteries and advanced energy optimization technologies. This ranking highlights the rapid progress of the industry in terms of battery performance, making long electric journeys increasingly accessible and serene. The choice of model will depend on individual needs in terms of range, budget, and driving style.',
      coverImage: 'https://placehold.co/1200x600/BDB76B/FFFFFF?text=Longest+Range+EVs',
    },
    {
      title: 'Affordable Electric City Cars: Ideal for the City?',
      excerpt: 'Focus on economical small electric cars, their advantages for urban driving, and the most popular models.',
      content: 'For urban and suburban commutes, electric city cars represent an ideal mobility solution, combining compactness, agility, and low running costs. Models like the Dacia Spring and Citroën ë-C3 are positioned as very affordable options, making access to electric easier. Despite their modest size, they offer sufficient range for daily commutes, often between 200 and 300 km. Their small size facilitates parking and maneuverability in the city. Maintenance is reduced, and home charging costs are significantly lower than fuel. These vehicles are perfect for drivers who prioritize economy, practicality, and reduced environmental impact for their urban travel.',
      coverImage: 'https://placehold.co/1200x600/CD853F/FFFFFF?text=Affordable+EVs',
    },
    {
      title: 'Electric SUVs: Luxury, Performance, and Versatility',
      excerpt: 'Exploration of high-end and versatile electric SUVs, their features, performance, and innovations.',
      content: 'Electric SUVs have become an undeniable segment of the market, combining the comfort and space of traditional SUVs with the benefits of electric powertrains. Models like the Tesla Model Y, Kia EV6, and BMW iX offer an impressive blend of luxury, performance, and versatility. They are characterized by spacious interiors, advanced infotainment systems, and fast charging capabilities. Range is also a strong point, allowing for longer journeys without anxiety. These vehicles are designed to meet the needs of families and drivers looking for a car capable of adapting to various situations, from daily commutes to outdoor adventures, all while benefiting from a silent and powerful drive.',
      coverImage: 'https://placehold.co/1200x600/8B0000/FFFFFF?text=Luxury+EV+SUVs',
    },
  ],
  'Comparisons': [
    {
      title: 'Comparison: Tesla Model 3 vs Hyundai Ioniq 6 – The Electric Sedan Battle',
      excerpt: 'A detailed head-to-head between two flagship electric sedans, analyzing their performance, range, technologies, and value for money.',
      content: 'The electric sedan market is booming, and the Tesla Model 3 faces increasingly fierce competition, notably with the arrival of the Hyundai Ioniq 6. This comparison explores the strengths and weaknesses of these two models. The Model 3 excels with its charging network and raw performance, while the Ioniq 6 seduces with its distinctive design, aerodynamic efficiency, and spacious interior. In terms of range, both are very close, offering sufficient capacities for most uses. The embedded technology is advanced in both cases, but the approach differs, with Tesla opting for minimalism and Hyundai for a more classic integration. The final choice will depend on individual preferences regarding design, user interface, and priority between pure performance and travel comfort.',
      coverImage: 'https://placehold.co/1200x600/4682B4/FFFFFF?text=Tesla+vs+Ioniq+6',
    },
    {
      title: 'Dacia Spring vs Citroën ë-C3: Which Affordable Electric City Car to Choose?',
      excerpt: 'Comparative analysis of the two most accessible electric city cars on the market, to help you make the best choice according to your budget and needs.',
      content: 'For those looking to go electric without breaking the bank, the Dacia Spring and the new Citroën ë-C3 are two very attractive options. This comparison pits them against each other to determine which offers the best value for money. The Dacia Spring is unbeatable on price, positioning itself as the cheapest electric car on the market, ideal for purely urban use with a modest range. The Citroën ë-C3, while slightly more expensive, offers a more modern design, improved comfort, and superior range, making it more versatile for suburban journeys. Both are eligible for ecological bonuses, further reducing their acquisition cost. The choice between these two models will depend on your specific budget and the intensity of your urban or mixed use.',
      coverImage: 'https://placehold.co/1200x600/D2B48C/FFFFFF?text=Dacia+vs+Citroen',
    },
    {
      title: 'Compact Electric SUVs: Kia EV6 vs Volkswagen ID.4 – The Duel',
      excerpt: 'An in-depth comparison between the Kia EV6 and Volkswagen ID.4, two popular electric SUVs, in terms of design, performance, range, and technology.',
      content: 'The compact electric SUV segment is highly competitive, and the Kia EV6 and Volkswagen ID.4 are two major players. The EV6 stands out with its bold and sporty design, ultra-fast charging capabilities, and dynamic performance. The ID.4, on the other hand, relies on a more classic design, high ride comfort, and generous habitability. In terms of range, both offer similar figures, suitable for long journeys. The EV6\'s interior is more driver-oriented, with integrated screens, while the ID.4 favors a more streamlined and intuitive approach. The choice between these two excellent SUVs will depend on your aesthetic preferences, your priority between sportiness and comfort, and the importance you place on charging speed.',
      coverImage: 'https://placehold.co/1200x600/98FB98/FFFFFF?text=EV6+vs+ID4',
    },
  ],
  'Buying Guides': [
    {
      title: 'Buying a Used Electric Car: Pitfalls to Avoid',
      excerpt: 'A comprehensive guide to buying a used electric vehicle, with tips on battery checks, history, and warranties.',
      content: 'Buying a used electric car can be an excellent opportunity to save money, but it\'s crucial to remain vigilant. The most important point is the battery\'s condition, which represents a significant part of the vehicle\'s value. Always request a State of Health (SOH) diagnosis for the battery and check if it\'s still under warranty. Beware of older models with very limited range or outdated charging technologies. Prefer vehicles with a clear maintenance history and reasonable mileage. Consider the total cost of ownership (TCO), including insurance, maintenance, and consumption. Going through a reliable professional or a specialized platform can secure your purchase by offering guarantees and thorough inspections. Don\'t forget to check compatibility with the charging stations you will use most often.',
      coverImage: 'https://placehold.co/1200x600/FFD700/FFFFFF?text=Used+EV+Guide',
    },
    {
      title: 'Scrappage Scheme and Ecological Bonus 2025: Optimize Your EV Purchase',
      excerpt: 'Everything you need to know about government aid available in 2025 for purchasing an electric car, new or used.',
      content: 'Government aid schemes for purchasing electric vehicles, such as the Scrappage Scheme and the Ecological Bonus, continue to evolve in 2025 to encourage the energy transition. It is essential to understand the eligibility conditions and amounts of these aids to optimize your investment. The Ecological Bonus applies to new vehicles and sometimes to used ones under certain conditions, while the Scrappage Scheme is linked to scrapping an old polluting vehicle. Criteria may vary depending on taxable income and vehicle type. Inquire about additional regional or local aid that may be available in your area. These subsidies can significantly reduce the acquisition cost of an EV, making electric cars more accessible to a larger number of households.',
      coverImage: 'https://placehold.co/1200x600/FFA07A/FFFFFF?text=EV+Incentives+2025',
    },
    {
      title: 'Installing a Home Charging Station: Practical Guide and Costs',
      excerpt: 'A detailed guide for installing a private charging station, including types of stations, costs, and possible financial aid.',
      content: 'Charging your electric car at home is the most convenient and often the most economical solution. Installing a charging station (Wallbox) is an investment that offers comfort and peace of mind. This practical guide explains the different types of stations available (7.4 kW, 11 kW, 22 kW), the electrical prerequisites for your installation, and the key steps of the process. It is recommended to use a qualified EV Charging Infrastructure (IRVE) electrician to ensure a safe and standard-compliant installation. Financial aid, such as tax credits or reduced VAT, can alleviate the cost of installation. A home charging station allows you to take advantage of off-peak electricity rates and always have a charged car ready to go, maximizing the benefits of your electric vehicle.',
      coverImage: 'https://placehold.co/1200x600/7B68EE/FFFFFF?text=Home+Charger+Guide',
    },
  ],
  'Maintenance Tips': [
    {
      title: 'Extending Your Electric Car Battery Life: Best Practices',
      excerpt: 'Essential tips to optimize the health and longevity of your EV battery, including charging and driving habits.',
      content: 'The battery is the heart of your electric car, and its maintenance is crucial to ensure its longevity and performance. To extend its lifespan, avoid complete discharges and systematic 100% recharges. Ideally, maintain the charge level between 20% and 80% for daily use. Avoid frequent fast charging, which can generate more heat and stress the battery. Adopt a smooth driving style, using regenerative braking to recover energy, which reduces wear on brakes and the battery. Also, avoid exposing your vehicle to extreme temperatures, whether very hot or very cold, for long periods. Follow the manufacturer\'s recommendations for regular revisions and software updates, which can optimize battery management.',
      coverImage: 'https://placehold.co/1200x600/FF6347/FFFFFF?text=EV+Battery+Care',
    },
    {
      title: 'Electric Car Maintenance: Less Complex, But Specific',
      excerpt: 'Comparison of EV maintenance versus combustion vehicles, and key points to monitor for optimal operation.',
      content: 'Electric car maintenance is generally simpler and less expensive than that of a combustion vehicle, thanks to a reduced number of moving parts. No more oil changes, spark plug replacements, or timing belt changes! However, an EV requires specific maintenance. Points to monitor include the battery and motor cooling system, brake fluid, tires (which may wear out faster due to instant torque), and the auxiliary 12V battery. The braking system is less stressed thanks to regenerative braking, but regular checks remain essential. It is crucial to entrust your EV\'s maintenance to authorized technicians trained in the specificities of electric vehicles to ensure the safety and performance of your car.',
      coverImage: 'https://placehold.co/1200x600/40E0D0/FFFFFF?text=EV+Maintenance+Guide',
    },
    {
      title: 'Optimizing Your EV Charging: Tips to Save Money and Time',
      excerpt: 'Practical tips for efficient charging of your electric car, at home and at public stations, to maximize savings and minimize time.',
      content: 'Charging is an integral part of the electric car experience, and there are several tips to optimize it. At home, prioritize charging during off-peak hours if your electricity contract allows, to benefit from more advantageous rates. Installing a dedicated charging station (Wallbox) is recommended for faster and safer charging. At public stations, plan your trips to identify available fast charging stations on your route, and use dedicated apps to check their compatibility and real-time availability. Do not systematically charge to 100% at fast chargers, especially if you don\'t need to, as the last percentages are the slowest to charge. Good planning and knowledge of different types of charging stations will allow you to charge your EV efficiently and economically.',
      coverImage: 'https://placehold.co/1200x600/EE82EE/FFFFFF?text=EV+Charging+Tips',
    },
  ],
};

const createSeed = async () => {
  console.log('🔄 Seeding categories and articles...');

  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: {},
      create: {
        name: categoryName,
        slug: slugify(categoryName),
      },
    });

    const articles = articlesData[categoryName as keyof typeof articlesData];

    if (articles) {
      for (const article of articles) {
        await prisma.article.create({
          data: {
            title: article.title,
            slug: slugify(article.title),
            content: article.content,
            excerpt: article.excerpt,
            coverImage: article.coverImage,
            published: true,
            publishedAt: new Date(),
            categories: {
              connect: { id: category.id },
            },
          },
        });
      }
    }
  }

  console.log('✅ Seed terminé.');
};

createSeed()
  .catch((e) => {
    console.error('❌ Erreur de seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
