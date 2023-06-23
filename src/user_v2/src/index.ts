import fastify from "fastify";
import userRouter from "./routes/permission-group";

const f = fastify({ logger: true });

f.register(userRouter, { prefix: '/api/users' });

f.listen({ port: 8000 });
