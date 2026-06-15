import express, {
  Application,
  Request,
  Response,
  NextFunction
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import orderRoutes from "./routes/order.routes";

/*
NEW PAYMENT ROUTE
*/

import paymentRoutes from "./routes/payment.routes";

/*
|--------------------------------------------------------------------------
| Express App
|--------------------------------------------------------------------------
*/

const app: Application = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Body Parsers
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
| Cookie Parser
|--------------------------------------------------------------------------
*/

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  "/",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({
      success: true,
      message:
        "Kaira Backend Running 🚀"
    });

  }
);

/*
|--------------------------------------------------------------------------
| API Routes
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

/*
RAZORPAY PAYMENT API
*/

app.use(
  "/api/payment",
  paymentRoutes
);

/*
|--------------------------------------------------------------------------
| Route Not Found
|--------------------------------------------------------------------------
*/

app.use(
  (
    req: Request,
    res: Response
  ) => {

    res.status(404).json({
      success: false,
      message: "Route Not Found"
    });

  }
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    console.error(
      "Global Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal Server Error"

    });

  }
);

export default app;