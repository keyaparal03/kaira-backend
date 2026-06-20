"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.protect, cart_controller_1.getCart);
router.post("/", auth_middleware_1.protect, cart_controller_1.addToCart);
router.put("/:id", auth_middleware_1.protect, cart_controller_1.updateCartItem);
router.delete("/:id", auth_middleware_1.protect, cart_controller_1.removeCartItem);
exports.default = router;
