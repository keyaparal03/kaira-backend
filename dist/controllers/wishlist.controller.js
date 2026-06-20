"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWishlistItem = exports.addToWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const getWishlist = async (req, res) => {
    const wishlist = await Wishlist_1.default.findOne({
        user: req.user._id
    })
        .populate("products");
    res.json({
        success: true,
        data: wishlist
    });
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    let wishlist = await Wishlist_1.default.findOne({
        user: req.user._id
    });
    if (!wishlist) {
        wishlist =
            await Wishlist_1.default.create({
                user: req.user._id,
                products: [
                    productId
                ]
            });
    }
    else {
        const exists = wishlist.products.some((id) => id.toString()
            === productId);
        if (!exists) {
            wishlist.products.push(productId);
        }
        await wishlist.save();
    }
    res.json({
        success: true,
        data: wishlist
    });
};
exports.addToWishlist = addToWishlist;
const removeWishlistItem = async (req, res) => {
    const wishlist = await Wishlist_1.default.findOne({
        user: req.user._id
    });
    if (!wishlist) {
        return res.status(404)
            .json({
            message: "Wishlist not found"
        });
    }
    wishlist.products =
        wishlist.products.filter((id) => id.toString()
            !== req.params.id);
    await wishlist.save();
    res.json({
        success: true
    });
};
exports.removeWishlistItem = removeWishlistItem;
