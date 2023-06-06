import { connect } from "mongoose";
import { app } from "./app";
import { DeleteUserListener } from "./events/listener/user/delete";
import { DeleteManyUserListener } from "./events/listener/user/delete-many";
import { InsertUserListener } from "./events/listener/user/insert";
import { InsertManyUserListener } from "./events/listener/user/insert-many";
import { UpdateUserListener } from "./events/listener/user/update";
import { nats } from "./nats";

(async () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET must be defined");
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
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

    connect(process.env.MONGO_URI).then(() =>
      console.log("Connected to MongoDb")
    );
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log("Listening on port 3000!!!"));
})();
