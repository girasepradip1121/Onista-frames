const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Image = sequelize.define(
  "image",
  {
    imageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    frameId: {
      type: DataTypes.INTEGER,
      references: {
        model: "frame",
        key: "frameId",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "image", timestamps: true }
);

module.exports = Image;
