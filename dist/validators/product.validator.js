"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createProductValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Product name required"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description required"),
    (0, express_validator_1.body)("price")
        .isNumeric()
        .withMessage("Price must be numeric"),
    (0, express_validator_1.body)("stock")
        .isNumeric()
        .withMessage("Stock must be numeric"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("Category required")
];
