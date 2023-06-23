import { preHandlerHookHandler } from "fastify";

const decodeJwt: preHandlerHookHandler =  async (req, rep, done) => {
  console.log('go here');
  done();
}

export default decodeJwt;