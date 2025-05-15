const thicknessModel = require("../Models/thicknessModel");

exports.getAllThicknesses = async (req, res) => {
  try {
    const thicknesses = await thicknessModel.findAll({
      order: [["thicknessValue", "ASC"]],
    });
    return res.status(200).json({
      count: thicknesses.length,
      thicknesses: thicknesses.map((thickness) => ({
        thicknessId: thickness.thicknessId,
        thicknessValue: thickness.thicknessValue,
        multiplier: thickness.multiplier,
        value: thickness.thicknessValue,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createThickness = async (req, res) => {
  try {
    const { thicknessValue, multiplier } = req.body;
    if (!thicknessValue || !multiplier) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const thickness = await thicknessModel.create({
      thicknessValue,
      multiplier,
    });
    return res.status(201).json({
      message: "Thickness created successfully",
      thickness: {
        thicknessId: thickness.thicknessId,
        thicknessValue: thickness.thicknessValue,
        multiplier: thickness.multiplier,
        value: thickness.thicknessValue,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Thickness value already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateThickness = async (req, res) => {
  try {
    const { thicknessId } = req.params;
    const { thicknessValue, multiplier } = req.body;
    if (!thicknessValue || !multiplier) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const thickness = await thicknessModel.findByPk(thicknessId);
    if (!thickness) {
      return res.status(404).json({ error: "Thickness not found" });
    }
    await thickness.update({ thicknessValue, multiplier });
    return res.status(200).json({
      message: "Thickness updated successfully",
      thickness: {
        thicknessId: thickness.thicknessId,
        thicknessValue: thickness.thicknessValue,
        multiplier: thickness.multiplier,
        value: thickness.thicknessValue,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Thickness value already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteThickness = async (req, res) => {
  try {
    const { thicknessId } = req.params;
    const thickness = await thicknessModel.findByPk(thicknessId);
    if (!thickness) {
      return res.status(404).json({ error: "Thickness not found" });
    }
    await thickness.destroy();
    return res.status(200).json({ message: "Thickness deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};