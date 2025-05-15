const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");
const Frame = Sequelize.define(
  "frame",
  {
    frameId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull:false, // Kitne logon ne rate kiya
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "material",
        key: "materialId",
      },
    },
    frameMaterialId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "frameMaterial",
        key: "frameMaterialId",
      },
    },
    frameShape:{
      type:DataTypes.STRING,
      allowNull:true
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    careInstruction: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    includes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0, // Default 0
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Kitne logon ne rate kiya
    },
    isNewArrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOffer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    tableName: "frame",
    timestamps: true,
  }
);

module.exports = Frame;
