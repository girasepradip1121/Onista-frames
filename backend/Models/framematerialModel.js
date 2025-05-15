const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const FrameMaterial = Sequelize.define(
  "frameMaterial",
  {
    frameMaterialId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    materialName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeframeMaterial",
    },
    multiplier: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "frameMaterial",
  }
);

module.exports = FrameMaterial;