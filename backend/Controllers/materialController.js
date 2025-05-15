const Material = require("../Models/materialModel");

exports.createMaterial = async (req, res) => {
  try {
    console.log("body",req.body);
    
    const { materialName,multiplier} = req.body;

    if (!materialName) {
      return res.status(400).json({ error: "Material name is required" });
    }

    const existing = await Material.findOne({ where: { materialName } });
    if (existing) {
      return res.status(409).json({ error: "Material already exists" });
    }

    const material = await Material.create({ materialName,multiplier });
    res.status(201).json(material);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findByPk(materialId);

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
exports.updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { materialName, multiplier } = req.body;

    // Validate inputs
    if (!materialName) {
      return res.status(400).json({ error: "Material name is required" });
    }
    if (multiplier == null || multiplier <= 0) {
      return res.status(400).json({ error: "Multiplier must be a positive number" });
    }

    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    // Check if new materialName already exists (excluding current material)
    const existing = await Material.findOne({
      where: { materialName },
      attributes: ['materialId']
    });
    if (existing && existing.materialId !== parseInt(materialId)) {
      return res.status(409).json({ error: "Material name already exists" });
    }

    await material.update({ materialName, multiplier });

    res.status(200).json({
      message: "Material updated successfully",
      material: {
        ...material.toJSON(),
        value: material.materialName
      }
    });
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findByPk(materialId);

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
