const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
const { param, body, validationResult } = require("express-validator");
const Type = require("./models/type");
const Product = require("./models/product");
const Category = require("./models/category");

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
        success: false,
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
r.get("/types", async (_req, res, next) => {
  try {
    const types = await Type.find().populate("products");
    res.json({
      success: true,
      errorCode: 0,
      message: "Lấy danh sách loại sản phẩm thành công",
      types,
    });
  } catch (e) {
    next(e);
  }
});

// Tạo danh mục
r.post(
  "/types",
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
      const nType = new Type({ label });
      await nType.save();

      res.status(201).json({
        success: true,
        errorCode: 0,
        message: "Tạo loại sản phẩm thành công",
        type: nType,
      });
    } catch (e) {
      next(e);
    }
  }
);

// Chỉnh sửa thông tin danh mục
r.patch(
  "/types/:id",
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
      const type = await Type.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            label,
          },
        },
        { new: true }
      ).populate("products");
      if (!type) {
        return res.status(404).json({
          success: false,
          errorCode: 3,
          message: "Loại sản phẩm không tồn tại",
        });
      }

      res.json({
        success: true,
        errorCode: 0,
        type,
      });
    } catch (e) {
      next(e);
    }
  }
);

// Xóa nhiều danh mục
r.delete(
  "/types/batch",
  validator(
    body().isArray().withMessage("Phải là mảng"),
    body("*").isMongoId().withMessage("Phải là mongoId")
  ),
  async (req, res, next) => {
    const ids = req.body;

    try {
      await Type.deleteMany({ _id: { $in: ids } });

      res.json({
        success: true,
        errorCode: 0,
        message: "Xóa loại sản phẩm thành công",
      });
    } catch (e) {
      next(e);
    }
  }
);

// Xóa danh mục
r.delete(
  "/types/:id",
  validator(param("id").isMongoId().withMessage("Param không hợp lệ")),
  async (req, res, next) => {
    try {
      await Type.deleteOne({ _id: req.params.id });

      res.json({
        success: true,
        errorCode: 0,
        message: "Xóa loại sản phẩm thành công",
      });
    } catch (e) {
      next(e);
    }
  }
);

r.get("/categories", async (_req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      errorCode: 0,
      message: "Lấy danh mục sản phẩm thành công",
      categories,
    });
  } catch (e) {
    next(e);
  }
});

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

      res.status(201).json({
        success: true,
        errorCode: 0,
        message: "Tạo danh mục sản phẩm thành công",
        category: nCategory,
      });
    } catch (e) {
      next(e);
    }
  }
);

r.delete(
  "/categories/:id",
  validator(param("id").isMongoId().withMessage("Param không hợp lệ")),
  async (req, res, next) => {
    try {
      await Category.deleteOne({ _id: req.params.id });

      res.json({
        success: true,
        errorCode: 0,
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

    res.json({
      status: true,
      errorCode: 0,
      message: "Lấy danh sách sản phẩm thành công",
      products,
    });
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
          success: false,
          errorCode: 3,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json({
        success: false,
        errorCode: 0,
        message: "Không tìm thấy sản phẩm",
        product,
      });
    } catch (e) {
      next(e);
    }
  }
);

r.post("/products", async (req, res, next) => {
  const { type_id, category_id } = req.body;

  try {
    const nProduct = new Product({
      ...req.body,
      type: type_id,
      category: category_id,
    });
    await nProduct.save();

    await Promise.allSettled([
      Type.updateOne(
        { _id: type_id },
        {
          $addToSet: {
            products: nProduct._id,
          },
        }
      ),
      nProduct.populate("category"),
    ]);

    res.status(201).json({
      success: true,
      errorCode: 0,
      message: "Tạo mới sản phẩm thành công",
      product: nProduct,
    });
  } catch (e) {
    next(e);
  }
});

// Tạo nhiều sản phẩm
r.post("/products/many", async (req, res, next) => {
  const products = req.body;

  try {
    const nProducts = await Product.insertMany(products);

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
        await Type.updateOne(
          { _id: k },
          {
            $addToSet: {
              products: v,
            },
          }
        );
      }),
    ]);

    res.status(201).json({
      status: false,
      message: "Cập nhật sản phẩm thành công",
      products,
    });
  } catch (e) {
    next(e);
  }
});

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
    ).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        errorCode: 3,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      errorCode: 0,
      message: "Lấy thông tin sản phẩm thành công",
      product,
    });
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
      await Type.updateMany(
        { products: { $in: ids } },
        {
          $pullAll: {
            products: ids,
          },
        }
      );

      res.json({
        success: true,
        errorCode: 0,
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
        Type.updateMany(
          { products: req.params.id },
          {
            $pull: {
              products: req.params.id,
            },
          }
        ),
      ]);

      res.json({
        success: true,
        errorCode: 0,
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

  res.json({
    success: false,
    errorCode: 4,
    message: "Có gì đó sai sai!!!",
  });
});

// Bắt unknow request
r.all("*", (_req, res) => {
  res.json({
    success: false,
    errorCode: 5,
    message: "Yêu cầu không tồn tại",
  });
});

app.use("/api/landing", r);

app.listen(3000, () => console.log("Listening on port 3000!!!"));
