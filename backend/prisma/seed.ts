import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Authors with Books
  const author1 = await prisma.author.create({
    data: {
      name: "Author One",
      books: {
        create: [
          { title: "Book One by Author One" },
          { title: "Book Two by Author One" },
        ],
      },
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: "Author Two",
      books: {
        create: [
          { title: "Book One by Author Two" },
          { title: "Book Two by Author Two" },
        ],
      },
    },
  });

  console.log(`Created authors and books: ${author1.name}, ${author2.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
