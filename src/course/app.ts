import { errHandler } from "@lxdgc9/pkg/dist/middleware";
import compress from "compression";
import express, { json } from "express";
import { r as school } from "./routes/school";
import { r as upload } from "./routes/upload";
import { r as user } from "./routes/user";

const app = express();

app.use(compress());
app.use(json());

app.use("/api/courses/schools", school);
app.use("/api/courses/users", user);
app.use("/api/courses/uploads", upload);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
