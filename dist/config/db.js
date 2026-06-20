"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        const dbName = process.env.MONGO_DB_NAME;
        await mongoose_1.default.connect(mongoUri, {
            dbName
        });
        console.log(`MongoDB Connected : ${dbName}`);
    }
    catch (error) {
        console.error("MongoDB Connection Error", error);
        process.exit(1);
    }
};
exports.default = connectDB;
