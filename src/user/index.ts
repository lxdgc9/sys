import mongoose from "mongoose";
import redis from "./redis";
import app from "./app";
import nats from "./nats";

async function main() {
  [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MONGO_URI",
    "REDIS_URI",
    "NATS_CLUSTER_ID",
    "NATS_CLIENT_ID",
    "NATS_URL",
  ].forEach((k) => {
    if (!process.env[k]) {
      throw new Error(`${k} must be defined`);
    }
  });

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    nats.cli.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => nats.cli.close());
    process.on("SIGTERM", () => nats.cli.close());

    mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDb");

    await redis.connect();
    await redis.ping();
    console.log("Connected to Redis");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log("Listening on port 3000!!!"));
}

main();
