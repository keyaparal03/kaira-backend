import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

import express from "express";

import connectDB from "./config/db";

// Routes
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import userRoutes from "./routes/auth.routes";

import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import contactRoutes from "./routes/contact.routes";
const app = express();

// DATABASE
connectDB();


// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// STATIC IMAGE FOLDER
app.use(
  "/uploads",
  express.static("uploads")
);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("KAIRA API Running");
});


// API ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);
// app.use(
//   "/api/checkout",
//   checkoutRoutes
// );


// 404
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "API Not Found"
//   });
// });


// SERVER
const PORT =
  process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});