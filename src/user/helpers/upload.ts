import fs from "fs";
import multer, { diskStorage } from "multer";

function uploader(path: string = "/") {
  const dest = `uploads/${path}`;

  if (!fs.existsSync(dest)) {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        throw err;
      }

      console.log("Directory created successfully!");
    });
  }

  return multer({
    storage: diskStorage({
      destination(_req, _file, cb) {
        cb(null, dest);
      },
      filename(_req, file, cb) {
        if (!file) {
          throw new Error("No file received");
        }

        if (!file.mimetype.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }

        file.originalname = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );

        cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
      },
    }),
    limits: { fileSize: 20971520 }, // ~20Mb
  });
}

export default uploader;
