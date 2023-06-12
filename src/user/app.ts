import express from "express";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import permGroupRouter from "./routes/perm-group";
import permRouter from "./routes/perm";
import roleRouter from "./routes/role";
import userRouter from "./routes/user";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/users/permissions/groups", permGroupRouter);
app.use("/api/users/permissions", permRouter);
app.use("/api/users/roles", roleRouter);
app.use("/api/users", userRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Request not found" });
});

app.use(errHandler);

export default app;
