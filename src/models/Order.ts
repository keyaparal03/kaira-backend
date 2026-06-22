import mongoose, {
  Schema,
  Document
} from "mongoose";

/*
-----------------------------------
ORDER INTERFACE
-----------------------------------
*/

export interface IOrder
  extends Document {

  user:
    mongoose.Types.ObjectId;

  items: {

    product:
      mongoose.Types.ObjectId;

    quantity: number;

    price: number;

  }[];

  shippingAddress: string;

  city: string;

  state: string;

  postalCode: string;

  totalAmount: number;

  paymentMethod: string;

  paymentStatus: string;

  orderStatus: string;
}

/*
-----------------------------------
ORDER SCHEMA
-----------------------------------
*/

const orderSchema =
new Schema<IOrder>(
{

  /*
  USER
  */

  user: {

    type:
      Schema.Types.ObjectId,

    ref: "User",

    required: true
  },

  /*
  ORDER ITEMS
  */

  items: [

    {

      product: {

        type:
          Schema.Types.ObjectId,

        ref: "Product",

        required: true
      },

      quantity: {

        type: Number,

        required: true,

        default: 1
      },

      price: {

        type: Number,

        required: true
      }
    }
  ],

  /*
  SHIPPING DETAILS
  */

  shippingAddress: {

    type: String,

    required: true
  },

  city: {

    type: String,

    required: true
  },

  state: {

    type: String,

    required: true
  },

  postalCode: {

    type: String,

    required: true
  },

  /*
  ORDER TOTAL
  */

  totalAmount: {

    type: Number,

    required: true
  },

  /*
  PAYMENT METHOD
  */

  paymentMethod: {

    type: String,

    enum: [

      "COD",

      "Razorpay"
    ],

    default: "COD"
  },

  /*
  PAYMENT STATUS
  */

  paymentStatus: {

    type: String,

    enum: [

      "Pending",

      "Paid",

      "Failed"
    ],

    default: "Pending"
  },

  /*
  ORDER STATUS
  */

  orderStatus: {

    type: String,

    enum: [

      "Pending",

      "Confirmed",   // optional

      "Processing",

      "Shipped",

      "Delivered",

      "Cancelled"
    ],

    default: "Pending"
  }

},

{
  timestamps: true
}
);

/*
-----------------------------------
EXPORT
-----------------------------------
*/

export default
mongoose.model<IOrder>(

  "Order",

  orderSchema
);