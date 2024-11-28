import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Array of realistic authors and books
  const authorsWithBooks = [
    {
      name: "Jane Austen",
      books: [
        { title: "Pride and Prejudice" },
        { title: "Sense and Sensibility" },
      ],
    },
    {
      name: "George Orwell",
      books: [{ title: "1984" }, { title: "Animal Farm" }],
    },
    {
      name: "J.K. Rowling",
      books: [
        { title: "Harry Potter and the Philosopher's Stone" },
        { title: "Harry Potter and the Chamber of Secrets" },
        { title: "Harry Potter and the Prisoner of Azkaban" },
      ],
    },
    {
      name: "J.R.R. Tolkien",
      books: [
        { title: "The Hobbit" },
        { title: "The Fellowship of the Ring" },
        { title: "The Two Towers" },
        { title: "The Return of the King" },
      ],
    },
    {
      name: "Agatha Christie",
      books: [
        { title: "Murder on the Orient Express" },
        { title: "And Then There Were None" },
        { title: "The Murder of Roger Ackroyd" },
      ],
    },
    {
      name: "Mark Twain",
      books: [
        { title: "The Adventures of Tom Sawyer" },
        { title: "The Adventures of Huckleberry Finn" },
      ],
    },
    {
      name: "Ernest Hemingway",
      books: [
        { title: "The Old Man and the Sea" },
        { title: "A Farewell to Arms" },
      ],
    },
    {
      name: "F. Scott Fitzgerald",
      books: [{ title: "The Great Gatsby" }, { title: "Tender Is the Night" }],
    },
    {
      name: "Stephen King",
      books: [{ title: "The Shining" }, { title: "It" }, { title: "Carrie" }],
    },
    {
      name: "Isabel Allende",
      books: [{ title: "The House of the Spirits" }, { title: "Eva Luna" }],
    },
  ];

  // Seed authors and their books
  for (const authorData of authorsWithBooks) {
    await prisma.author.create({
      data: {
        name: authorData.name,
        books: {
          create: authorData.books,
        },
      },
    });
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
