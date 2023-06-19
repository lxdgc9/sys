import express from "express";
import cors from "cors";
import compression from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import school from "./routes/school";
import _class from "./routes/class";
import upload from "./routes/upload";
import course from "./routes/course";
import lesson from "./routes/lesson";
import user from "./routes/user";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/courses/schools", school);
app.use("/api/courses/classes", _class);
app.use("/api/courses/uploads", upload);
app.use("/api/courses/courses", course);
app.use("/api/courses/lessons", lesson);
app.use("/api/courses/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Request not found" });
});

app.use(errHandler);

export default app;
