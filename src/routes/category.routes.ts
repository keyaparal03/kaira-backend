import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}
from "../controllers/category.controller";

import {
  protect
}
from "../middleware/auth.middleware";

import {
  adminOnly
}
from "../middleware/admin.middleware";

const router =
  express.Router();

router.get(
  "/",
  getCategories
);

router.get(
  "/:id",
  getCategoryById
);

router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

export default router;