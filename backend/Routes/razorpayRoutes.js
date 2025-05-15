// routes/razorpayRoutes.js
const express = require("express");
const router = express.Router();
const { createRazorpayOrder,verifyPayment } = require("../Controllers/razorpayController");

router.post("/create-razorpay-order", createRazorpayOrder);
router.post('/verify-payment',verifyPayment)

module.exports = router;
