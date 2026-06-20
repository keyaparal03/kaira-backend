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

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001"
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

/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

/*
|--------------------------------------------------------------------------
| STATIC IMAGE
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static("uploads")
);

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("KAIRA API Running");
});

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 3500;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );
});