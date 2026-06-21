import express from "express";

import {
  register,
  login,
  refreshToken,
  getCurrentUser
} from "../controllers/auth.controller";

import {
  protect
} from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

/* ADD THIS */
router.get(
  "/me",
  protect,
  getCurrentUser
);

export default router;