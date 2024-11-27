import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

const prisma = new PrismaClient();

export default fp(async (fastify) => {
  fastify.decorate("prisma", prisma);

  // Gracefully disconnect Prisma when the app shuts down
  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
