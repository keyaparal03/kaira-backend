import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../models/Order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

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

    const razorpayOrder =
      await razorpay.orders.create({

        amount: amount * 100,

        currency: "INR",

        receipt:
          "receipt_" + Date.now()
      });

    return res.status(200).json({

      success: true,

      order: razorpayOrder,

      key:
        process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message
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

      razorpay_signature,

      /*
      Mongo order id
      */

      orderId

    } = req.body;

    /*
    CREATE SIGNATURE
    */

    const body =

      razorpay_order_id +

      "|" +

      razorpay_payment_id;

    /*
    SECRET
    */

    const secret =
      process.env
        .RAZORPAY_KEY_SECRET;

    /*
    EXPECTED SIGNATURE
    */

    const expectedSignature =

      crypto

        .createHmac(
          "sha256",
          secret!
        )

        .update(body)

        .digest("hex");

    /*
    INVALID SIGNATURE
    */

    if (

      expectedSignature !==

      razorpay_signature

    ) {

      return res.status(400)
        .json({

          success: false,

          message:
            "Payment verification failed"
        });
    }

    /*
    FIND ORDER
    */

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {

      return res.status(404)
        .json({

          success: false,

          message:
            "Order not found"
        });
    }

    /*
    UPDATE ORDER STATUS
    */

    order.paymentStatus =
      "Paid";

    order.orderStatus =
      "Confirmed";

    /*
    OPTIONAL
    SAVE PAYMENT ID
    */

    // order.paymentId =
    // razorpay_payment_id;

    await order.save();

    /*
    SUCCESS
    */

    return res.status(200)
      .json({

        success: true,

        message:
          "Payment successful",

        order
      });

  } catch (error: any) {

    console.log(error);

    return res.status(500)
      .json({

        success: false,

        message:
          "Server Error"
      });
  }
};