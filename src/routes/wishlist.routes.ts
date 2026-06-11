import express from "express";

import {
 getWishlist,
 addToWishlist,
 removeWishlistItem
}
from "../controllers/wishlist.controller";

import {
 protect
}
from "../middleware/auth.middleware";

const router =
express.Router();

router.get(
 "/",
 protect,
 getWishlist
);

router.post(
 "/",
 protect,
 addToWishlist
);

router.delete(
 "/:id",
 protect,
 removeWishlistItem
);

export default router;