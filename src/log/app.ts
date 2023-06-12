import express from "express";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import { r as log } from "./routes";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/logs", log);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
