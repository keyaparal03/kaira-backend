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

router.post(
  "/:id",
  protect,
  adminOnly,

  upload.single("image"),   // added

  updateProduct
);

router.post(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;