"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const findProducts = async (query, page, limit, sort) => {
    const products = await Product_1.default.find(query)
        .populate("category")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await Product_1.default.countDocuments(query);
    return {
        products,
        total
    };
};
exports.findProducts = findProducts;
