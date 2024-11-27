import Fastify from "fastify";
import bookingRoutes from "./routes/book";
import authorRoutes from "./routes/author";
import dotenv from "dotenv";
import prismaPlugin from "./plugins/prisma";

dotenv.config();
const startServer = async () => {
  const server = Fastify({ logger: true });

  server.register(prismaPlugin);
  server.register(bookingRoutes);
  server.register(authorRoutes);

  try {
    await server.listen({ port: 5000 });
    console.log("Server running on http://localhost:5000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
