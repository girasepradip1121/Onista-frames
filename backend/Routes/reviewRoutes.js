const express = require("express");
const router = express.Router();
const reviewController = require("../Controllers/reviewController");
// const upload = require("../Middlewares/uploadMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");

router.get("/getallreviews", reviewController.getAllReviews);
router.get("/getall/:frameId", reviewController.getReviewsByFrameId);
router.post("/submit", authMiddleware, reviewController.submitReview);
router.delete("/deletereview/:reviewId", authMiddleware, reviewController.deleteReview);

module.exports = router;
