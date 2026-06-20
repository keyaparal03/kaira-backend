"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, image } = req.body;
        const exists = await Category_1.default.findOne({
            slug
        });
        if (exists) {
            return res.status(400)
                .json({
                success: false,
                message: "Category already exists"
            });
        }
        const category = await Category_1.default.create({
            name,
            slug,
            description,
            image
        });
        res.status(201).json({
            success: true,
            data: category
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find();
        res.json({
            success: true,
            data: categories
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404)
                .json({
                success: false,
                message: "Category not found"
            });
        }
        res.json({
            success: true,
            data: category
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};
exports.getCategoryById = getCategoryById;
const updateCategory = async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json({
            success: true,
            data: category
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        await Category_1.default.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Category deleted"
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};
exports.deleteCategory = deleteCategory;
