// models/News.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db"); // Adjust path

const News = sequelize.define(
  "news",
  {
    newsId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDesc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // Store image URL or filename
      allowNull: true,
    },
  },
  {
    tableName: "news",
    timestamps: true,
  }
);

module.exports = News;
