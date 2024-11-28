import { Author } from "@prisma/client";
import { FastifyInstance } from "fastify";

export default async function authorRoutes(fastify: FastifyInstance) {
  fastify.get("/authors", async (request, reply) => {
    const { limit } = request.query as {
      limit?: string;
    };

    const take =
      limit && parseInt(limit, 10) ? { take: parseInt(limit, 10) } : undefined;

    console.log("take", limit, take);
    const totalCount = await fastify.prisma.author.count();
    const author = await fastify.prisma.author.findMany({
      ...take,
      include: {
        books: {
          select: {
            id: true,
          },
        },
      },
    });

    return { data: author, totalCount };
  });

  fastify.post<{ Body: Author }>("/authors", async (request, reply) => {
    const name = request.body.name;
    const author = await fastify.prisma.author.findFirst({
      where: {
        name,
      },
    });

    if (author) {
      return reply.code(409).send({ message: "Author already exist" });
    }

    const newAuthor = await fastify.prisma.author.create({
      data: {
        name,
      },
    });

    return newAuthor;
  });

  fastify.get<{ Params: { id: string } }>(
    "/authors/:id",
    async (request, reply) => {
      const author = await fastify.prisma.author.findUnique({
        where: {
          id: request.params.id,
        },
      });

      if (!author) {
        return reply.code(404).send({ message: "Author not found" });
      }
      return author;
    }
  );

  fastify.put<{ Params: { id: string }; Body: Partial<Author> }>(
    "/authors/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;
      const author = await fastify.prisma.author.findUnique({
        where: {
          id,
        },
      });
      if (!author) {
        return reply.code(404).send({ message: "Author not found" });
      }
      const updatedAuthor = await fastify.prisma.author.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return updatedAuthor;
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/authors/:id",
    async (request, reply) => {
      const { id } = request.params;
      const author = await fastify.prisma.author.findUnique({
        where: {
          id,
        },
      });
      if (!author) {
        return reply.code(404).send({ message: "Author not found" });
      }

      await fastify.prisma.author.delete({
        where: {
          id,
        },
      });

      return reply.code(204).send("Successfully Deleted Author");
    }
  );
}
