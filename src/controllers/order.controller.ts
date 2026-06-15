import { Request, Response } from "express";

import Order from "../models/Order";
import Cart from "../models/Cart";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export const createOrder = async (
  req: any,
  res: Response
) => {
  try {
    const {
      shippingAddress,
      city,
      state,
      postalCode,
      paymentMethod,
    } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const items = cart.items.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = cart.items.reduce(
      (total: number, item: any) =>
        total + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
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

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get My Orders
|--------------------------------------------------------------------------
*/

export const getMyOrders = async (
  req: any,
  res: Response
) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Order By Id
|--------------------------------------------------------------------------
*/

export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
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

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin Get All Orders
|--------------------------------------------------------------------------
*/

export const getAllOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderStatus } = req.body;

    const order: any =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus =
      orderStatus;

    if (
      orderStatus ===
      "Delivered"
    ) {
      order.paymentStatus =
        "Paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Cancel Order
|--------------------------------------------------------------------------
*/

export const cancelOrder = async (
  req: any,
  res: Response
) => {
  try {
    const order: any =
      await Order.findOne({
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

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};