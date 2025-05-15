const express = require("express");
const router = express.Router();
const materialController = require("../Controllers/materialController");
const authMiddleware = require("../Middlewares/authMiddleware");


router.post("/creatematerial", authMiddleware,materialController.createMaterial);
router.get("/getallmaterial", materialController.getAllMaterials);
router.get("/getbyid/:materialId", materialController.getMaterialById);
router.put("/updatematerial/:materialId",authMiddleware, materialController.updateMaterial);
router.delete("/deletematerial/:materialId", authMiddleware,materialController.deleteMaterial);

module.exports = router;
