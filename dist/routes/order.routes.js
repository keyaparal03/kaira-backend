"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/
/**
 * Create Order
 * POST /api/orders
 */
router.post("/", auth_middleware_1.protect, order_controller_1.createOrder);
/**
 * Get Logged In User Orders
 * GET /api/orders/my-orders
 */
router.get("/my-orders", auth_middleware_1.protect, order_controller_1.getMyOrders);
/**
 * Get Order Details
 * GET /api/orders/:id
 */
router.get("/:id", auth_middleware_1.protect, order_controller_1.getOrderById);
/**
 * Cancel Order
 * PUT /api/orders/:id/cancel
 */
router.put("/:id/cancel", auth_middleware_1.protect, order_controller_1.cancelOrder);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
/**
 * Get All Orders
 * GET /api/orders/admin/all
 */
router.get("/admin/all", auth_middleware_1.protect, admin_middleware_1.adminOnly, order_controller_1.getAllOrders);
/**
 * Update Order Status
 * PUT /api/orders/admin/:id
 */
router.put("/admin/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, order_controller_1.updateOrderStatus);
exports.default = router;
