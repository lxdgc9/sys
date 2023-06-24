import fastify from "fastify";
import { permissionGroupRouter } from "./routes";

const f = fastify({ logger: true });

f.register(permissionGroupRouter, { prefix: "/api/users/permission-groups" });

f.listen({ port: 8000 });
