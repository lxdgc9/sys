import { errHandler } from "@lxdgc9/pkg/dist/middleware";
import compress from "compression";
import express, { json } from "express";
import { r as school } from "./route/school";
import { r as upload } from "./route/upload";
import { r as user } from "./route/user";

const app = express();

app.use(compress());
app.use(json());

app.use("/api/courses/schools/classes");
app.use("/api/courses/schools", school);
app.use("/api/courses/users", user);
app.use("/api/courses/uploads", upload);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
