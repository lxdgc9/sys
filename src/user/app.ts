import express from "express";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import catalog from "./routes/rule-catalog";
import rule from "./routes/rule";
import role from "./routes/role";
import user from "./routes/user";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/users/rules/catalogs", catalog);
app.use("/api/users/rules", rule);
app.use("/api/users/roles", role);
app.use("/api/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Request not found" });
});

app.use(errHandler);

export default app;
