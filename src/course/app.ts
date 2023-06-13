import express from "express";
import compress from "compression";
import { errHandler } from "@lxdgc9/pkg/dist/handlers";
import schoolRouter from "./routes/school";
import classRouter from "./routes/class";
import uploadRouter from "./routes/upload";
import courseRouter from "./routes/course";
import lessonRouter from "./routes/lesson";
import userRouter from "./routes/user";

const app = express();

app.use(compress());
app.use(express.json());

app.use("/api/courses/schools", schoolRouter);
app.use("/api/courses/classes", classRouter);
app.use("/api/courses/uploads", uploadRouter);
app.use("/api/courses/courses", courseRouter);
app.use("/api/courses/lessons", lessonRouter);
app.use("/api/courses/users", userRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Request not found" });
});

app.use(errHandler);

export default app;
