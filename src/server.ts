import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";

// Routes
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import userRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();


// DATABASE
connectDB();

app.use((req, res, next) => {

  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3001"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  next();
});
// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",   // React frontend
      "http://localhost:3001"    // Next admin
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