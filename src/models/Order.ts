import mongoose, {
  Schema,
  Document
} from "mongoose";

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

const orderSchema =
new Schema<IOrder>(
{
  user: {
    type:
      Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: {
        type:
          Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: Number,

      price: Number
    }
  ],

  shippingAddress: {
    type: String,
    required: true
  },

  city: String,

  state: String,

  postalCode: String,

  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    default: "COD"
  },

  paymentStatus: {
    type: String,
    enum: [
      "Pending",
      "Paid",
      "Failed"
    ],
    default: "Pending"
  },

  orderStatus: {
    type: String,
    enum: [
      "Pending",
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

export default mongoose.model<IOrder>(
  "Order",
  orderSchema
);