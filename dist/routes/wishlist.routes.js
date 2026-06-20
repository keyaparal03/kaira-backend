"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.protect, wishlist_controller_1.getWishlist);
router.post("/", auth_middleware_1.protect, wishlist_controller_1.addToWishlist);
router.delete("/:id", auth_middleware_1.protect, wishlist_controller_1.removeWishlistItem);
exports.default = router;
