  const { DataTypes } = require("sequelize");
  const Sequelize = require("../Config/db");

  const FrameSize = Sequelize.define("frameSize", {
    frameSizeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    total_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Total Qty",
    },
    remained_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Total Qty - Purchased Qty",
    },
    purchased_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Purchased Qty",
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    offer_price: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },

  },{
      tableName: "frameSize",
    }

  );

  module.exports = FrameSize;
