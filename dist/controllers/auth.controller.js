"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        /* VALIDATION */
        if (!name ||
            !email ||
            !password) {
            return res
                .status(400)
                .json({
                success: false,
                message: "All fields are required"
            });
        }
        name =
            name.trim();
        email =
            email
                .trim()
                .toLowerCase();
        if (name.length < 3) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Name must be minimum 3 characters"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Invalid email format"
            });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Password must be minimum 8 characters"
            });
        }
        /* CHECK USER */
        const userExists = await User_1.default.findOne({
            email
        });
        if (userExists) {
            return res
                .status(400)
                .json({
                success: false,
                message: "User already exists"
            });
        }
        /* HASH PASSWORD */
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        /* CREATE USER */
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
exports.register = register;
/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        /* VALIDATION */
        if (!email ||
            !password) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Email and password are required"
            });
        }
        email =
            email
                .trim()
                .toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Invalid email format"
            });
        }
        /* FIND USER */
        const user = await User_1.default.findOne({
            email
        });
        if (!user) {
            return res
                .status(401)
                .json({
                success: false,
                message: "Invalid email"
            });
        }
        /* CHECK PASSWORD */
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({
                success: false,
                message: "Invalid password"
            });
        }
        /* GENERATE TOKENS */
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        /* SAVE REFRESH TOKEN */
        user.refreshToken =
            refreshToken;
        await user.save();
        /* COOKIE */
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        /* RESPONSE */
        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
exports.login = login;
/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
*/
const refreshToken = async (req, res) => {
    const token = req.cookies
        .refreshToken;
    if (!token) {
        return res
            .status(401)
            .json({
            success: false,
            message: "No refresh token"
        });
    }
    try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env
            .JWT_REFRESH_SECRET);
        const accessToken = (0, jwt_1.generateAccessToken)(decoded.id);
        res.status(200).json({
            success: true,
            accessToken
        });
    }
    catch (error) {
        res.status(403)
            .json({
            success: false,
            message: "Invalid token"
        });
    }
};
exports.refreshToken = refreshToken;
