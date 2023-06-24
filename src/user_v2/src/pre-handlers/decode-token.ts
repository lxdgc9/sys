import { preHandlerHookHandler } from "fastify";

const decodeJwt: preHandlerHookHandler = async (_req, _rep, done) => {
  console.log("Pass decodeJwt pre handler");

  done();
};

export default decodeJwt;
