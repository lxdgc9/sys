const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { param, body, validationResult } = require("express-validator");
const Category = require("./models/category");
const Product = require("./models/product");

const app = express();

app.use(cors());
app.use(express.json());

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDb");
} catch (e) {
  console.log(e);
  process.exit(1);
}

function validator(...chains) {
  const handler = async (req, res, next) => {
    await Promise.all(chains.map((ch) => ch.run(req)));

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({
        message: "Lỗi đầu vào",
        errs: errs.array(),
      });
    }

    next();
  };

  return handler;
}

const r = express.Router();

// Danh mục sản phẩm
r.get("/categories", async (_req, res, next) => {
  try {
    const categories = await Category.find().populate("products");
    res.json(categories);
  } catch (e) {
    next(e);
  }
});

// Tạo danh mục
r.post(
  "/categories",
  validator(
    body("label")
      .notEmpty()
      .withMessage("Trường bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi")
      .trim()
      .escape()
  ),
  async (req, res, next) => {
    const { label } = req.body;

    try {
      const nCategory = new Category({ label });
      await nCategory.save();

      res.status(201).json(nCategory);
    } catch (e) {
      next(e);
    }
  }
);

// Xóa danh mục
r.delete(
  "/categories/:id",
  validator(param("id").isMongoId().withMessage("Param không hợp lệ")),
  async (req, res, next) => {
    try {
      await Category.deleteOne({ _id: req.params.id });

      res.json({
        message: "Xóa danh mục thành công",
      });
    } catch (e) {
      next(e);
    }
  }
);

// Danh sách sản phẩm
r.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

// Chi tiết sản phẩm
r.get(
  "/products/:id",
  validator(param("id").isMongoId().withMessage("Param không hợp lệ")),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      if (!product) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json(product);
    } catch (e) {
      next(e);
    }
  }
);

// Tạo sản phẩm
r.post(
  "/products",
  validator(
    body("code")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("name")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("category_id")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isMongoId()
      .withMessage("Không hợp lệ"),
    body("types")
      .optional({ values: "undefined" })
      .isArray()
      .withMessage("Phải là mảng"),
    body("types.*")
      .optional({ values: "undefined" })
      .isString()
      .withMessage("Phải là chuỗi"),
    body("description")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("price")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("price_sale")
      .optional({ values: "undefined" })
      .isInt({ min: 0 })
      .withMessage("Phải là số nguyên dương"),
    body("taxes")
      .optional({ values: "undefined" })
      .isInt({ min: 0 })
      .withMessage("Phải là số nguyên dương")
  ),
  async (req, res, next) => {
    const {
      code,
      name,
      thumb_url,
      category_id,
      types,
      description,
      image_urls,
      price,
      price_sale,
      taxes,
    } = req.body;

    try {
      const isDupl = await Product.exists({ code });
      if (isDupl) {
        return res.status(400).json({
          message: "Trùng mã sản phẩm (code)",
        });
      }

      const nProduct = new Product({
        code,
        name,
        category: category_id,
        thumb_url,
        types,
        description,
        image_urls,
        price,
        price_sale,
        taxes,
      });
      await nProduct.save();

      await Promise.allSettled([
        Category.updateOne(
          { _id: category_id },
          {
            $addToSet: {
              products: nProduct._id,
            },
          }
        ),
        nProduct.populate("category"),
      ]);

      res.status(201).json(nProduct);
    } catch (e) {
      next(e);
    }
  }
);

// Xóa sản phẩm
r.delete("/products/:id", async (req, res, next) => {
  try {
    await Product.deleteOne({ _id: req.params.id });

    res.json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (e) {
    next(e);
  }
});

// Error handing
r.use((err, _req, res, _next) => {
  console.log(err);
  res.json({ message: "Có gì đó sai sai!!!" });
});

// Bắt unknow request
r.all("*", (_req, res) => {
  res.json({
    message: "Yêu cầu không tồn tại",
    related_requests: [
      {
        path: `${process.env.DOMAIN_URL}/helloworld`,
        method: "GET",
        description: "Lấy Danh mục sản phẩm",
      },
      {
        path: `${process.env.DOMAIN_URL}/helloworld`,
        method: "POST",
        description: "Tạo danh mục",
      },
    ],
  });
});

app.use("/api/landing", r);

app.listen(3000, () => console.log("Listening on port 3000!!!"));
