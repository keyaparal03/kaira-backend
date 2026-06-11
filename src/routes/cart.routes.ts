import express from "express";

import {
 getCart,
 addToCart,
 updateCartItem,
 removeCartItem
}
from "../controllers/cart.controller";

import {
 protect
}
from "../middleware/auth.middleware";

const router =
express.Router();

router.get(
 "/",
 protect,
 getCart
);

router.post(
 "/",
 protect,
 addToCart
);

router.put(
 "/:id",
 protect,
 updateCartItem
);

router.delete(
 "/:id",
 protect,
 removeCartItem
);

export default router;