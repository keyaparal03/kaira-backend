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
  createProductValidator,
  validateRequest,
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;