import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import compress from "compression";
import express from "express";
import { r as _class } from "./routes/class";
import { r as course } from "./routes/course";
import { r as lesson } from "./routes/lesson";
import { r as school } from "./routes/school";
import { r as upload } from "./routes/upload";
import { r as user } from "./routes/user";

const app = express();

app.use(compress());
app.use(express.json());

app.use("/api/courses/schools", school);
app.use("/api/courses/classes", _class);
app.use("/api/courses/uploads", upload);
app.use("/api/courses/courses", course);
app.use("/api/courses/lessons", lesson);
app.use("/api/courses/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
