import { errHandler } from "@lxdgc9/pkg/dist/middleware";
import compression from "compression";
import express from "express";
import { r as perm } from "./routes/perm";
import { r as permGroup } from "./routes/perm-grp";
import { r as role } from "./routes/role";
import { r as user } from "./routes/user";

const app = express();

app.use(compression());
app.use(express.json());

app.use("/api/users/perms/groups", permGroup);
app.use("/api/users/perms", perm);
app.use("/api/users/roles", role);
app.use("/api/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Request not found" });
});

app.use(errHandler);

export { app };
