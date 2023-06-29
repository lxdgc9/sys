import { FastifyPluginCallback } from "fastify";
import writePermissionGroup from "../handlers/permission_group/write";
import decodeJwt from "../pre-handlers/decode-token";
import readPermissionGroups from "../handlers/permission_group/read-batch";
import readPermissionGroup from "../handlers/permission_group/read";

const r: FastifyPluginCallback = (f, _opts, done) => {
  f.route({
    method: "GET",
    url: "/",
    preHandler: [decodeJwt],
    handler: readPermissionGroups,
  });

  f.route({
    method: "GET",
    url: "/:id",
    preHandler: [decodeJwt],
    handler: readPermissionGroup,
  });

  f.route({
    method: "POST",
    url: "/",
    preHandler: [decodeJwt],
    handler: writePermissionGroup,
  });

  done();
};

export default r;
