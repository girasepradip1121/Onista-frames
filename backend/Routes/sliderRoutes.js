const express = require("express");
const SliderController = require("../Controllers/sliderController");
const router = express.Router();
const upload=require('../Middlewares/uploadMiddleware')
const authMiddleware = require("../Middlewares/authMiddleware");


router.get("/active", SliderController.getImages);
router.post("/createslider",authMiddleware,upload.single('imageUrl'),SliderController.uploadImage);
router.delete("/delete/:sliderId",authMiddleware, SliderController.deleteImage);


module.exports = router;