import mongoose from "mongoose";
import app from "./app";
import nats from "./nats";
import { InsertUserListener } from "./events/listener/user/insert";
import { InsertManyUserListener } from "./events/listener/user/insert-many";
import { UpdateUserListener } from "./events/listener/user/update";
import { DeleteUserListener } from "./events/listener/user/delete";
import { DeleteManyUserListener } from "./events/listener/user/delete-many";

async function main() {
  [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MONGO_URI",
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

    new InsertUserListener(nats.cli).listen();
    new InsertManyUserListener(nats.cli).listen();
    new UpdateUserListener(nats.cli).listen();
    new DeleteUserListener(nats.cli).listen();
    new DeleteManyUserListener(nats.cli).listen();

    mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDb");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log("Listening on port 3000!!!"));
}

main();
