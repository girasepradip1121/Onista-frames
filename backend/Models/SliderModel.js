// Models/Slider.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Slider = sequelize.define("slider", {
  sliderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    tableName: "slider",
    timestamps: true,
  }

);

module.exports = Slider;