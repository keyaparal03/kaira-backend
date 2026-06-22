import express from "express";

import {
  getProfile
} from "../controllers/user.controller"

import {
  protect
} from "../middleware/auth.middleware";

const router =
  express.Router();

/*
----------------------------
GET PROFILE
----------------------------
*/

router.get(
  "/profile",
  protect,
  getProfile
);

export default router;