import bcrypt from "bcryptjs";

import User from "../models/User";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt";

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const register =
async (
  req: any,
  res: any
) => {
  try {

    let {
      name,
      email,
      password
    } = req.body;

    /* VALIDATION */

    if (
      !name ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "All fields are required"
        });
    }

    name =
      name.trim();

    email =
      email
        .trim()
        .toLowerCase();

    if (
      name.length < 3
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Name must be minimum 3 characters"
        });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid email format"
        });
    }

    if (
      password.length < 8
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Password must be minimum 8 characters"
        });
    }

    /* CHECK USER */

    const userExists =
      await User.findOne({
        email
      });

    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "User already exists"
        });
    }

    /* HASH PASSWORD */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    /* CREATE USER */

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword
      });

    res.status(201).json({
      success: true,
      message:
        "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login =
async (
  req: any,
  res: any
) => {
  try {

    let {
      email,
      password
    } = req.body;

    /* VALIDATION */

    if (
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Email and password are required"
        });
    }

    email =
      email
        .trim()
        .toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid email format"
        });
    }

    /* FIND USER */

    const user: any =
      await User.findOne({
        email
      });

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid email"
        });
    }

    /* CHECK PASSWORD */

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid password"
        });
    }

    /* GENERATE TOKENS */

    const accessToken =
      generateAccessToken(
        user._id.toString()
      );

    const refreshToken =
      generateRefreshToken(
        user._id.toString()
      );

    /* SAVE REFRESH TOKEN */

    user.refreshToken =
      refreshToken;

    await user.save();

    /* COOKIE */

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      }
    );

    /* RESPONSE */

    res.status(200).json({
      success: true,
      message:
        "Login successful",

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
*/

export const refreshToken =
async (
  req: any,
  res: any
) => {

  const token =
    req.cookies
      .refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message:
          "No refresh token"
      });
  }

  try {

    const jwt =
      require(
        "jsonwebtoken"
      );

    const decoded: any =
      jwt.verify(
        token,
        process.env
          .JWT_REFRESH_SECRET
      );

    const accessToken =
      generateAccessToken(
        decoded.id
      );

    res.status(200).json({
      success: true,
      accessToken
    });

  } catch (error) {

    res.status(403)
      .json({
        success: false,
        message:
          "Invalid token"
      });

  }
};


/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

export const getCurrentUser =
async (
  req: any,
  res: any
) => {

  try {

    /*
    req.user comes from
    auth middleware
    */

    res.status(200).json({

      success: true,

      user: {
        id: req.user._id,

        name: req.user.name,

        email: req.user.email,

        role: req.user.role
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch user"
    });
  }
};