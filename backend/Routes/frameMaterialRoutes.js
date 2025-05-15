const express = require("express");
const router = express.Router();
const framematerialController = require("../Controllers/frameMaterialController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/createframemat",authMiddleware,framematerialController.createMaterial);
router.get("/getallframemat",framematerialController.getAllMaterials);
router.get("/getbyid/:frameMaterialId", framematerialController.getMaterialById);
router.put("/updatematerial/:frameMaterialId",authMiddleware, framematerialController.updateFrameMaterial);
router.delete("/deletematerial/:frameMaterialId", authMiddleware,framematerialController.deleteMaterial);

module.exports = router;
