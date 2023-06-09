const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
const { param, body, validationResult } = require("express-validator");
const Category = require("./models/category");
const Product = require("./models/product");

const app = express();

app.use(cors());
app.use(compression());
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
    const categories = await Category.find().lean().populate("products");
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

// Chỉnh sửa thông tin danh mục
r.patch(
  "/categories/:id",
  validator(
    param("id").isMongoId().withMessage("Param không hợp lệ"),
    body("label")
      .optional({ values: "undefined" })
      .isString()
      .withMessage("Phải là chuỗi")
      .trim()
      .escape()
  ),
  async (req, res, next) => {
    const { label } = req.body;

    try {
      const product = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            label,
          },
        },
        { new: true }
      )
        .lean()
        .populate("products");
      if (!product) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      res.json(product);
    } catch (e) {
      next(e);
    }
  }
);

// Xóa nhiều danh mục
r.delete(
  "/categories/many",
  validator(
    body().isArray().withMessage("Phải là mảng"),
    body("*").isMongoId().withMessage("Phải là mongoId")
  ),
  async (req, res, next) => {
    const ids = req.body;

    try {
      await Category.deleteMany({ _id: { $in: ids } });

      res.json({
        message: "Xóa danh mục thành công",
      });
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
      const product = await Product.findById(req.params.id)
        .lean()
        .populate("category");
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
      .isString()
      .withMessage("Phải là chuỗi"),
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
        return res.status(409).json({
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

// Tạo nhiều sản phẩm
r.post(
  "/products/many",
  validator(
    body().isArray().withMessage("Phải là mảng"),
    body("*.code")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.name")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.category_id")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isMongoId()
      .withMessage("Không hợp lệ"),
    body("*.types")
      .optional({ values: "undefined" })
      .isArray()
      .withMessage("Phải là mảng"),
    body("*.types.*")
      .optional({ values: "undefined" })
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.description")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.price")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.price_sale")
      .optional({ values: "undefined" })
      .isString()
      .withMessage("Phải là chuỗi"),
    body("*.taxes")
      .optional({ values: "undefined" })
      .isInt({ min: 0 })
      .withMessage("Phải là số nguyên dương")
  ),
  async (req, res, next) => {
    const products = req.body;

    try {
      const isDupl = await Product.exists({
        code: products.map((el) => el.code),
      });
      if (isDupl) {
        return res.status(409).json({
          message: "Trùng mã sản phẩm (code)",
        });
      }

      const nProducts = await Product.insertMany(
        products.map(
          ({
            code,
            name,
            category_id,
            thumb_url,
            types,
            description,
            image_urls,
            price,
            price_sale,
            taxes,
          }) => ({
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
          })
        )
      );

      const productMap = nProducts.reduce((map, product) => {
        const k = product.category.toString();
        if (!map.has(k)) {
          map.set(k, []);
        }
        map.get(k).push(product._id);
        return map;
      }, new Map());

      await Promise.allSettled([
        [...productMap.entries()].forEach(async ([k, v]) => {
          await Category.updateOne(
            { _id: k },
            {
              $addToSet: {
                products: v,
              },
            }
          );
        }),
      ]);

      res.status(201).json(nProducts);
    } catch (e) {
      next(e);
    }
  }
);

// Chỉnh sửa thông tin sản phẩm
r.patch("/products/:id", async (req, res, next) => {
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
    if (code) {
      const isDupl = await Product.exists({
        _id: { $ne: req.params.id },
        code,
      });
      if (isDupl) {
        return res.status(409).json({
          message: "Trùng mã sản phẩm",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
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
        },
      },
      {
        new: true,
      }
    )
      .lean()
      .populate("category");
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json(product);
  } catch (e) {
    next(e);
  }
});

// Xóa nhiều sản phẩm
r.delete(
  "/products/many",
  validator(
    body().isArray().withMessage("Phải là mảng"),
    body("*").isMongoId().withMessage("Phải là mongoId")
  ),
  async (req, res, next) => {
    const ids = req.body;

    try {
      await Product.deleteMany({ _id: { $in: ids } });
      await Category.updateMany(
        { products: { $in: ids } },
        {
          $pullAll: {
            products: ids,
          },
        }
      );

      res.json({
        message: "Xóa sản phẩm thành công",
      });
    } catch (e) {
      next(e);
    }
  }
);

// Xóa sản phẩm
r.delete(
  "/products/:id",
  validator(param("id").isMongoId().withMessage("Param không hợp lệ")),
  async (req, res, next) => {
    try {
      await Promise.allSettled([
        Product.deleteOne({ _id: req.params.id }),
        Category.updateMany(
          { products: req.params.id },
          {
            $pull: {
              products: req.params.id,
            },
          }
        ),
      ]);

      res.json({
        message: "Xóa sản phẩm thành công",
      });
    } catch (e) {
      next(e);
    }
  }
);

// Error handing
r.use((err, _req, res, _next) => {
  console.log(err);
  res.json({ message: "Có gì đó sai sai!!!" });
});

// Bắt unknow request
r.all("*", (_req, res) => {
  res.json({
    message: "Yêu cầu không tồn tại",
  });
});

app.use("/api/landing", r);

app.listen(3000, () => console.log("Listening on port 3000!!!"));
