import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name required"),

  body("description")
    .notEmpty()
    .withMessage("Description required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be numeric"),

  body("stock")
    .isNumeric()
    .withMessage("Stock must be numeric"),

  body("category")
    .notEmpty()
    .withMessage("Category required")
];