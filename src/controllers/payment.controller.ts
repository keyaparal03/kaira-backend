import { Request, Response } from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay";

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT ORDER
|--------------------------------------------------------------------------
*/

export const createPaymentOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { amount } = req.body;

    console.log("Incoming amount:", amount);

    /*
    Razorpay expects paise
    */

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    /*
    Create order
    */

    const order = await razorpay.orders.create(
      options
    );

    console.log("Razorpay order created:", order);

    /*
    IMPORTANT:
    frontend expects payment.order.id
    */

    res.status(200).json({
      success: true,
      order
    });

  } catch (error: any) {

    console.log(
      "RAZORPAY CREATE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| VERIFY PAYMENT
|--------------------------------------------------------------------------
*/

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

    /*
    Generate signature
    */

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET!
        )
        .update(body.toString())
        .digest("hex");

    /*
    Compare signature
    */

    const isValid =
      expectedSignature ===
      razorpay_signature;

    if (!isValid) {

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    console.log(
      "Payment verified successfully"
    );

    res.status(200).json({
      success: true,
      message: "Payment verified"
    });

  } catch (error: any) {

    console.log(
      "VERIFY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};