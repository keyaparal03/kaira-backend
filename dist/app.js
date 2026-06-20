"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
/*
NEW PAYMENT ROUTE
*/
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
/*
|--------------------------------------------------------------------------
| Express App
|--------------------------------------------------------------------------
*/
const app = (0, express_1.default)();
/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/
app.use((0, helmet_1.default)());
/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/
app.use((0, morgan_1.default)("dev"));
/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
/*
|--------------------------------------------------------------------------
| Cookie Parser
|--------------------------------------------------------------------------
*/
app.use((0, cookie_parser_1.default)());
/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    credentials: true
}));
/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Kaira Backend Running 🚀"
    });
});
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/orders", order_routes_1.default);
/*
RAZORPAY PAYMENT API
*/
app.use("/api/payment", payment_routes_1.default);
/*
|--------------------------------------------------------------------------
| Route Not Found
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});
/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message ||
            "Internal Server Error"
    });
});
exports.default = app;
