const express = require("express");
const MedialController = require("../Controllers/socialPostController");
const router = express.Router();
const upload = require("../Middlewares/uploadMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");

router.get("/getallpost", MedialController.getAllPosts);
router.post(
  "/createpost",authMiddleware,
  upload.single("image"),
  MedialController.createPost
);
router.delete("/deletepost/:postId",authMiddleware, MedialController.deletePost);
router.put("/updatepost/:postId",authMiddleware, upload.single("image"),MedialController.updatePost);

module.exports = router;
