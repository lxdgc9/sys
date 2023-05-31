import { errHandler } from "@lxdgc9/pkg/dist/middleware";
import compress from "compression";
import express from "express";
import { r as school } from "./route/school";
import { r as upload } from "./route/upload";

const app = express();

app.use(compress());
app.use(express.json());

app.use("/api/courses/schools", school);
app.use("/api/courses/uploads", upload);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
