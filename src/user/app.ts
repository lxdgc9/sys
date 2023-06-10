import express from "express";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import { r as perm } from "./routes/perm";
import { r as permGroup } from "./routes/perm-group";
import { r as role } from "./routes/role";
import { r as user } from "./routes/user";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/users/permissions/groups", permGroup);
app.use("/api/users/permissions", perm);
app.use("/api/users/roles", role);
app.use("/api/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
