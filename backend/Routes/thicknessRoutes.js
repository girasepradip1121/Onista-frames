const express = require("express");
const router = express.Router();
const thicknessController = require("../Controllers/thicknessController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.get("/getallthickness", thicknessController.getAllThicknesses);
router.post("/addthickness",authMiddleware, thicknessController.createThickness);
router.put("/updatethickness/:thicknessId", authMiddleware,thicknessController.updateThickness);
router.delete("/deletethickness/:thicknessId", authMiddleware,thicknessController.deleteThickness);

module.exports = router;