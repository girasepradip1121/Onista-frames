const express = require("express");
const router = express.Router();
const sizeController = require("../Controllers/sizeController");
// const authMiddleware=require('../Middlewares/authMiddleware')
const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/createsize",authMiddleware, sizeController.createSize);
router.get("/getallsize", sizeController.getAllSizes);
router.get("/getsizebyid/:sizeId", sizeController.getSizeById);
router.put("/updatesize/:sizeId",authMiddleware, sizeController.updateSize);
router.delete("/deletesize/:sizeId", authMiddleware,sizeController.deleteSize);

module.exports = router;
