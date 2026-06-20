"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        let token;
        /*
        |--------------------------------------------------------------------------
        | Get Token
        |--------------------------------------------------------------------------
        */
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token =
                req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }
        /*
        |--------------------------------------------------------------------------
        | Verify Token
        |--------------------------------------------------------------------------
        */
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        /*
        |--------------------------------------------------------------------------
        | Find User
        |--------------------------------------------------------------------------
        */
        const user = await User_1.default.findById(decoded.id)
            .select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error.message,
        });
    }
};
exports.protect = protect;
/*
|--------------------------------------------------------------------------
| Admin Middleware
|--------------------------------------------------------------------------
*/
const adminOnly = (req, res, next) => {
    if (!req.user ||
        req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }
    next();
};
exports.adminOnly = adminOnly;
