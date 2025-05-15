// models/Section.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const News = require("./newsModel");

const Section = sequelize.define(
  "section",
  {
    sectionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sectionTitle: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    bullets: {
      type: DataTypes.JSON,
    },
    newsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: "section",
    timestamps: true,
  }
);

module.exports = Section;
