const FrameMaterial = require("../Models/framematerialModel");

exports.createMaterial = async (req, res) => {
  try {
    const { materialName,multiplier} = req.body;

    if (!materialName) {
      return res.status(400).json({ error: "Material name is required" });
    }

    const existing = await FrameMaterial.findOne({ where: { materialName } });
    if (existing) {
      return res.status(409).json({ error: "Material already exists" });
    }

    const material = await FrameMaterial.create({ materialName,multiplier});
    res.status(201).json(material);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await FrameMaterial.findAll();
    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const { frameMaterialId } = req.params;
    const material = await FrameMaterial.findByPk(frameMaterialId);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.status(200).json(material);
  } catch (error) {
    console.error("Error fetching material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Material
exports.updateFrameMaterial = async (req, res) => {
  try {
    const { frameMaterialId } = req.params;
    const { materialName, multiplier } = req.body;

    // Validate inputs
    if (!materialName) {
      return res.status(400).json({ error: "Frame material name is required" });
    }
    if (multiplier == null || multiplier <= 0) {
      return res.status(400).json({ error: "Multiplier must be a positive number" });
    }

    const frameMaterial = await FrameMaterial.findByPk(frameMaterialId);
    if (!frameMaterial) {
      return res.status(404).json({ error: "Frame material not found" });
    }

    // Check if new materialName already exists (excluding current frame material)
    const existing = await FrameMaterial.findOne({
      where: { materialName },
      attributes: ['frameMaterialId']
    });
    if (existing && existing.frameMaterialId !== parseInt(frameMaterialId)) {
      return res.status(409).json({ error: "Frame material name already exists" });
    }

    await frameMaterial.update({ materialName, multiplier });

    res.status(200).json({
      message: "Frame material updated successfully",
      frameMaterial: {
        ...frameMaterial.toJSON(),
        value: frameMaterial.materialName
      }
    });
  } catch (error) {
    console.error("Error updating frame material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const { frameMaterialId } = req.params;
    const material = await FrameMaterial.findByPk(frameMaterialId);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    await material.destroy();
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
