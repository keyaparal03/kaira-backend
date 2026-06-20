"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = async (req, res) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search || "");
        const category = String(req.query.category || "");
        const sort = String(req.query.sort || "");
        const query = {
            isActive: true
        };
        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }
        if (category) {
            query.category =
                category;
        }
        let productsQuery = Product_1.default.find(query)
            .populate("category");
        if (sort === "asc") {
            productsQuery =
                productsQuery.sort({
                    price: 1
                });
        }
        if (sort === "desc") {
            productsQuery =
                productsQuery.sort({
                    price: -1
                });
        }
        const products = await productsQuery
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Product_1.default.countDocuments(query);
        res.json({
            success: true,
            data: products,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate("category");
        if (!product) {
            return res.status(404)
                .json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json({
            success: true,
            data: product
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        await Product_1.default.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Product deleted"
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};
exports.deleteProduct = deleteProduct;
