"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const product_validator_1 = require("../validators/product.validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = express_1.default.Router();
router.get("/", product_controller_1.getProducts);
router.get("/:id", product_controller_1.getProductById);
router.post("/", auth_middleware_1.protect, admin_middleware_1.adminOnly, product_validator_1.createProductValidator, validation_middleware_1.validateRequest, product_controller_1.createProduct);
router.put("/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, product_controller_1.deleteProduct);
exports.default = router;
