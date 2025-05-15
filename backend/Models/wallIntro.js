// Models/Slider.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Wall = sequelize.define(
  "wall",
  {
    wallId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "wall",
    timestamps: true,
  }
);

module.exports = Wall;
