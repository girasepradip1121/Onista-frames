const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/addtocart",authMiddleware,cartController.addToCart);
router.get("/getcartitems/:userId",authMiddleware,cartController.getCart);
router.put("/updatecart/:cartId",authMiddleware, cartController.updateCartItem);
router.delete("/removeitem/:cartId", authMiddleware,cartController.removeCartItem);
router.delete("/clear",authMiddleware,cartController.clearCart);

module.exports = router;