import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    /*
    |--------------------------------------------------------------------------
    | Get Token
    |--------------------------------------------------------------------------
    */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
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

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user =
      await User.findById(decoded.id)
        .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin Middleware
|--------------------------------------------------------------------------
*/

export const adminOnly = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required",
    });
  }

  next();
};