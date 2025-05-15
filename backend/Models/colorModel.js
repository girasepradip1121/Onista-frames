const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Color = Sequelize.define(
  "color",
  {
    colorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    colorName: {
      type: DataTypes.STRING, // Format: "WxH" like "17.5x11.5"
      allowNull: false,
      unique: "colorName",
    },
  },
  {
    tableName: "color",
  }
);

module.exports = Color;
