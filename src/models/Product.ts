import mongoose,
{
  Document,
  Schema
}
from "mongoose";

export interface IProduct
  extends Document {

  name: string;

  description: string;

  category:
  mongoose.Types.ObjectId;

  price: number;

  stock: number;

  image: string;

  brand: string;

  rating: number;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const productSchema =
new Schema<IProduct>(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  image: {
    type: String,
    default: ""
  },

  brand: {
    type: String,
    default: "KAIRA"
  },

  rating: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
}
);

export default mongoose.model<IProduct>(
  "Product",
  productSchema
);