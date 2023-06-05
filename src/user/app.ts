import { errHandler } from "@lxdgc9/pkg/dist/middleware";
import compress from "compression";
import express, { json } from "express";
import { r as perm } from "./routes/perm";
import { r as permGrp } from "./routes/perm-grp";
import { r as role } from "./routes/role";
import { r as user } from "./routes/user";

const app = express();

app.use(compress());
app.use(json());

app.use("/api/users/roles/perms/grps/", permGrp);
app.use("/api/users/roles/perms", perm);
app.use("/api/users/roles", role);
app.use("/api/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
