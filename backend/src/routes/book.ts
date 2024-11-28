import { Book } from "@prisma/client";
import { FastifyInstance, RouteShorthandOptions } from "fastify";

export default async function bookRoutes(fastify: FastifyInstance) {
  fastify.get("/books", async (request, reply) => {
    const { limit } = request.query as {
      limit?: string;
    };

    const take =
      limit && parseInt(limit, 10) ? { take: parseInt(limit, 10) } : undefined;
    const totalCount = await fastify.prisma.book.count();

    const books = await fastify.prisma.book.findMany({
      ...take,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      data: books,
      totalCount,
    };
  });

  fastify.post<{ Body: Book }>("/books", async (request, reply) => {
    const { title, authorId } = request.body;

    const author = await fastify.prisma.author.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!author) {
      return reply.code(404).send({ message: "Author not found" });
    }
    const book = await fastify.prisma.book.findFirst({
      where: {
        title,
      },
    });

    if (book) {
      return reply.code(409).send({ message: "Book already exist" });
    }

    const newBook = await fastify.prisma.book.create({
      data: {
        title,
        authorId,
      },
    });

    return newBook;
  });

  fastify.get<{ Params: { id: string } }>(
    "/books/:id",
    async (request, reply) => {
      const book = await fastify.prisma.book.findUnique({
        where: {
          id: request.params.id,
        },
      });

      if (!book) {
        return reply.code(404).send({ message: "Book not found" });
      }
      return book;
    }
  );

  fastify.put<{ Params: { id: string }; Body: Partial<Book> }>(
    "/books/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { title, authorId } = request.body;
      const book = await fastify.prisma.book.findUnique({
        where: {
          id,
        },
      });
      if (!book) {
        return reply.code(404).send({ message: "Book not found" });
      }
      const updatedBook = await fastify.prisma.book.update({
        where: {
          id,
        },
        data: {
          title,
          authorId,
        },
      });

      return updatedBook;
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/books/:id",
    async (request, reply) => {
      const { id } = request.params;
      const book = await fastify.prisma.book.findUnique({
        where: {
          id,
        },
      });

      if (!book) {
        return reply.code(404).send({ message: "Book not found" });
      }

      await fastify.prisma.book.delete({
        where: {
          id,
        },
      });
      return reply.code(204).send("Successfully Deleted Book");
    }
  );
}
