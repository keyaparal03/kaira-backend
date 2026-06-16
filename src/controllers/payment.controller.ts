import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

export const createPaymentOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { amount } = req.body;

    const order =
      await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now()
      });

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET as string
        )
        .update(body)
        .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false
    });
  }
};