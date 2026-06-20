"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, city, state, postalCode, paymentMethod, } = req.body;
        const cart = await Cart_1.default.findOne({
            user: req.user._id,
        }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }
        const items = cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        }));
        const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const order = await Order_1.default.create({
            user: req.user._id,
            items,
            shippingAddress,
            city,
            state,
            postalCode,
            totalAmount,
            paymentMethod,
            paymentStatus: "Pending",
            orderStatus: "Pending",
        });
        /*
        CLEAR CART AFTER ORDER
        */
        cart.items = [];
        await cart.save();
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createOrder = createOrder;
/*
|--------------------------------------------------------------------------
| Get My Orders
|--------------------------------------------------------------------------
*/
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({
            user: req.user._id,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getMyOrders = getMyOrders;
/*
|--------------------------------------------------------------------------
| Get Order By Id
|--------------------------------------------------------------------------
*/
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate("user")
            .populate("items.product");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getOrderById = getOrderById;
/*
|--------------------------------------------------------------------------
| Admin Get All Orders
|--------------------------------------------------------------------------
*/
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find()
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllOrders = getAllOrders;
/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        order.orderStatus =
            orderStatus;
        if (orderStatus ===
            "Delivered") {
            order.paymentStatus =
                "Paid";
        }
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order updated",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
/*
|--------------------------------------------------------------------------
| Cancel Order
|--------------------------------------------------------------------------
*/
const cancelOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        order.orderStatus =
            "Cancelled";
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order cancelled",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.cancelOrder = cancelOrder;
