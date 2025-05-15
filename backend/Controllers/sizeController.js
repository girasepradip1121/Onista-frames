// controllers/sizeController.js
const Size = require("../Models/sizeModel");
const Sequelize=require('sequelize')

// Create New Size
const createSize = async (req, res) => {
  try {
    const { width, height, multiplier } = req.body;
    if (!width || !height || !multiplier) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (width <= 0 || height <= 0 || multiplier <= 0) {
      return res.status(400).json({ error: "Width, height, and multiplier must be positive" });
    }
    const size = await Size.create({ width, height, multiplier });
    return res.status(201).json({
      message: "Size created successfully",
      size: {
        sizeId: size.sizeId,
        width: size.width,
        height: size.height,
        multiplier: size.multiplier,
        label: `${size.width} x ${size.height} inch`,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Size with this width and height already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get All Sizes

const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      order: [["width", "ASC"]],
      attributes: [
        "sizeId",
        "width",
        "height",
        "multiplier",
        [
          Sequelize.literal(`CONCAT(width, ' x ', height, ' inch')`),
          "label",
        ],
      ],
    });
    return res.status(200).json({
      count: sizes.length,
      sizes: sizes.map((size) => ({
        sizeId: size.sizeId,
        width: size.width,
        height: size.height,
        multiplier: size.multiplier,
        label: size.label || `${size.width} x ${size.height} inch`,      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Single Size by ID
const getSizeById = async (req, res) => {
  try {
    const { sizeId } = req.params;

    const size = await Size.findByPk(sizeId);

    if (!size) {
      return res.status(404).json({
        error: "Size not found",
      });
    }

    res.status(200).json({
      ...size.toJSON(),
      label: size.label,
    });
  } catch (error) {
    console.error("Error fetching size:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Update Size
const updateSize = async (req, res) => {
  try {
    const { sizeId } = req.params;
    const { width, height, multiplier } = req.body;
    if (!width || !height || !multiplier) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (width <= 0 || height <= 0 || multiplier <= 0) {
      return res.status(400).json({ error: "Width, height, and multiplier must be positive" });
    }
    const size = await Size.findByPk(sizeId);
    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }
    await size.update({ width, height, multiplier });
    return res.status(200).json({
      message: "Size updated successfully",
      size: {
        sizeId: size.sizeId,
        width: size.width,
        height: size.height,
        multiplier: size.multiplier,
        label: `${size.width} x ${size.height} inch`,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Size with this width and height already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Delete Size
const deleteSize = async (req, res) => {
  try {
    const { sizeId } = req.params;

    const size = await Size.findByPk(sizeId);

    if (!size) {
      return res.status(404).json({
        error: "Size not found",
      });
    }

    await size.destroy();

    res.status(200).json({
      message: "Size deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting size:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
};
