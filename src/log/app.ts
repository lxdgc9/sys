import { errHandler } from "@lxdgc9/pkg/dist/middleware/err-handler";
import compress from "compression";
import express, { json } from "express";
import { r as log } from "./routes";

const app = express();

app.use(compress());
app.use(json());

app.use("/api/logs", log);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
