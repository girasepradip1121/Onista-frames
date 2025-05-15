const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Cart = Sequelize.define(
  "cart",
  {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "user",
        key: "userId",
      },
    },
    frameId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "frame",
        key: "frameId",
      },
    },
    sizeId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "size",
        key: "sizeId",
      },
    },
    frameSizeId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "frameSize",
        key: "frameSizeId",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    color:{
      type:DataTypes.STRING,
      allowNull:true
    }
  },
  {
    tableName: "cart",
  }
);

module.exports = Cart;
