const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Thickness = Sequelize.define(
  "thickness",
  {
    thicknessId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thicknessValue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "thicknessname",
    },
    multiplier: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "thickness",
  }
);

module.exports = Thickness;
