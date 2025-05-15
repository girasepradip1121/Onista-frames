const express = require("express");
const router = express.Router();
const newsController = require("../Controllers/newsController");
const upload = require("../Middlewares/uploadMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");

// Create a new frame
router.post("/createnews", authMiddleware,upload.single("image"), newsController.createNews);

router.get("/getallnews", newsController.getAllNews);

router.get("/getbyid/:newsId", newsController.getNewsById);

router.put(
  "/updatenews/:newsId",authMiddleware,
  upload.single("image"),
  newsController.updateNews
);

router.delete("/deletenews/:newsId",authMiddleware, newsController.deleteNews);
module.exports = router;
