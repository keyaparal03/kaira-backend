"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
/*
========================================
GET CART
========================================
*/
const getCart = async (req, res) => {
    const cart = await Cart_1.default.findOne({
        user: req.user._id
    })
        .populate("items.product");
    res.json({
        success: true,
        data: cart
    });
};
exports.getCart = getCart;
/*
========================================
ADD TO CART
========================================
*/
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        /*
        MAX QUANTITY
        */
        if (quantity > 10) {
            return res
                .status(400)
                .json({
                message: "Maximum quantity is 10"
            });
        }
        let cart = await Cart_1.default.findOne({
            user: req.user._id
        });
        /*
        CREATE NEW CART
        */
        if (!cart) {
            cart =
                await Cart_1.default.create({
                    user: req.user._id,
                    items: [
                        {
                            product: productId,
                            quantity
                        }
                    ]
                });
        }
        else {
            /*
            CHECK EXISTING
            */
            const existingItem = cart.items.find((item) => item.product
                .toString() ===
                productId);
            if (existingItem) {
                const newQty = existingItem.quantity +
                    quantity;
                if (newQty > 10) {
                    return res
                        .status(400)
                        .json({
                        message: "Maximum quantity is 10"
                    });
                }
                existingItem.quantity =
                    newQty;
            }
            else {
                cart.items.push({
                    product: productId,
                    quantity
                });
            }
            await cart.save();
        }
        /*
        IMPORTANT
        REFETCH POPULATED
        */
        const updatedCart = await Cart_1.default.findOne({
            user: req.user._id
        })
            .populate("items.product");
        res.json({
            success: true,
            data: updatedCart
        });
    }
    catch (error) {
        res.status(500)
            .json({
            message: "Server Error"
        });
    }
};
exports.addToCart = addToCart;
/*
========================================
UPDATE QUANTITY
========================================
*/
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart_1.default.findOne({
            user: req.user._id
        });
        if (!cart) {
            return res
                .status(404)
                .json({
                message: "Cart not found"
            });
        }
        /*
        FIND ITEM
        */
        const item = cart.items.find((item) => item._id.toString()
            === req.params.id);
        /*
        REMOVE IF ZERO
        */
        if (quantity <= 0) {
            cart.items =
                cart.items.filter((item) => item._id.toString()
                    !== req.params.id);
        }
        else {
            /*
            MAX 10
            */
            if (quantity > 10) {
                return res
                    .status(400)
                    .json({
                    message: "Maximum quantity is 10"
                });
            }
            if (item) {
                item.quantity =
                    quantity;
            }
        }
        await cart.save();
        /*
        REFETCH UPDATED
        */
        const updatedCart = await Cart_1.default.findOne({
            user: req.user._id
        })
            .populate("items.product");
        res.json({
            success: true,
            data: updatedCart
        });
    }
    catch (error) {
        res.status(500)
            .json({
            message: "Server Error"
        });
    }
};
exports.updateCartItem = updateCartItem;
/*
========================================
REMOVE ITEM
========================================
*/
const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart_1.default.findOne({
            user: req.user._id
        });
        if (!cart) {
            return res
                .status(404)
                .json({
                message: "Cart not found"
            });
        }
        /*
        REMOVE
        */
        cart.items =
            cart.items.filter((item) => item._id.toString()
                !== req.params.id);
        await cart.save();
        /*
        REFETCH UPDATED
        */
        const updatedCart = await Cart_1.default.findOne({
            user: req.user._id
        })
            .populate("items.product");
        res.json({
            success: true,
            data: updatedCart
        });
    }
    catch (error) {
        res.status(500)
            .json({
            message: "Server Error"
        });
    }
};
exports.removeCartItem = removeCartItem;
