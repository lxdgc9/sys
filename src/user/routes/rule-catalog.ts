import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_PERM,
  WRITE_PERM,
  UPDATE_PERM,
  DELETE_PERM,
} from "@lxdgc9/pkg/dist/rules/manage";
import readCatalog from "../handlers/perm_group/read";
import readCatalogs from "../handlers/perm_group/read-many";
import writeCatalog from "../handlers/perm_group/write";
import writeCatalogs from "../handlers/perm_group/write-many";
import modifyCatalog from "../handlers/perm_group/modify";
import deleteCatalog from "../handlers/perm_group/delete";
import deleteCatalogs from "../handlers/perm_group/delete-many";

const catalogRouter = Router();

catalogRouter
  .route("/")
  .get(guard(READ_PERM), readCatalogs)
  .post(
    guard(WRITE_PERM),
    validator(
      body("name")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeCatalog
  );

catalogRouter
  .route("/many")
  .get(guard(READ_PERM), readCatalogs)
  .post(
    guard(WRITE_PERM),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất một phần tử"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeCatalogs
  )
  .delete(
    guard(DELETE_PERM),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất một phần tử"),
      body("*").isMongoId().withMessage("Không đúng định dạng")
    ),
    deleteCatalogs
  );

catalogRouter
  .route("/:id")
  .get(
    guard(READ_PERM),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    readCatalog
  )
  .patch(
    guard(UPDATE_PERM),
    validator(
      param("id").isMongoId().withMessage("Không đúng định dạng"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    modifyCatalog
  )
  .delete(
    guard(DELETE_PERM),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    deleteCatalog
  );

export default catalogRouter;
