import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Order
 * POST /api/orders
 */
router.post(
  "/",
  protect,
  createOrder
);

/**
 * Get Logged In User Orders
 * GET /api/orders/my-orders
 */
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

/**
 * Get Order Details
 * GET /api/orders/:id
 */
router.get(
  "/:id",
  protect,
  getOrderById
);

/**
 * Cancel Order
 * PUT /api/orders/:id/cancel
 */
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Get All Orders
 * GET /api/orders/admin/all
 */
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

/**
 * Update Order Status
 * PUT /api/orders/admin/:id
 */
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;