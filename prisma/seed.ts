// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const categories = ["Electric", "Buying", "Reviews", "News"];

async function main() {
  console.log("🚗 Seeding categories and articles...");

  for (const catName of categories) {
    const slug = catName.toLowerCase().replace(/\s+/g, "-");

    // 1. Create category
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug,
      },
    });

    // 2. Create 7 articles per category
    for (let i = 0; i < 7; i++) {
      const title = `${catName} article ${i + 1}`;
      const articleSlug = `${slug}-article-${i + 1}`;

      await prisma.article.upsert({
        where: { slug: articleSlug },
        update: {},
        create: {
          title,
          slug: articleSlug,
          excerpt: faker.lorem.sentence(),
          coverImage: `/hero3.jpg`, // image statique ou 
          content: `
            <p>${faker.lorem.paragraphs(2, "</p><p>")}</p>
            <h2>${faker.lorem.words(5)}</h2>
            <p>${faker.lorem.paragraphs(2, "</p><p>")}</p>
          `,
          published: true,
          publishedAt: faker.date.recent({ days: 90 }),
          categories: {
            connect: [{ id: category.id }],
          },
        },
      });
    }
  }

  console.log("✅ Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
