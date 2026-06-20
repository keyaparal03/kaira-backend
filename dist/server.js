"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const auth_routes_2 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// DATABASE
(0, db_1.default)();
/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use((0, cors_1.default)({
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
}));
/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
/*
|--------------------------------------------------------------------------
| STATIC IMAGE
|--------------------------------------------------------------------------
*/
app.use("/uploads", express_1.default.static("uploads"));
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
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/users", auth_routes_2.default);
/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
