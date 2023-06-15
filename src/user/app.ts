import express from "express";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import catalogRouter from "./routes/rule-catalog";
import ruleRouter from "./routes/rule";
import roleRouter from "./routes/role";
import userRouter from "./routes/user";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/users/rules/catalogs", catalogRouter);
app.use("/api/users/rules", ruleRouter);
app.use("/api/users/roles", roleRouter);
app.use("/api/users", userRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Yêu cầu không tồn tại" });
});

app.use(errHandler);

export default app;
