import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
}
from "../controllers/product.controller";

import {
  protect
}
from "../middleware/auth.middleware";

import {
  adminOnly
}
from "../middleware/admin.middleware";

import upload from
"../middleware/upload.middleware";

import {
  createProductValidator
}
from "../validators/product.validator";

import {
  validateRequest
}
from "../middleware/validation.middleware";

const router =
  express.Router();

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProductById
);

router.post(
  "/",
  protect,
  adminOnly,

  upload.single("image"),   // added

  createProductValidator,
  validateRequest,

  createProduct
);

/* UPDATE USING POST */
router.post(
  "/update/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

/* DELETE USING POST */
router.post(
  "/delete/:id",
  protect,
  adminOnly,
  deleteProduct
);


export default router;