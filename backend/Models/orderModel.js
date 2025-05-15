const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Order = Sequelize.define(
  "order",
  {
    orderId: {
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    grandTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "1-pending, 2-processing, 3-shipped ,4-delivered, 5-cancelled",
    },
    razorpay_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "order",
    timestamps: true,
  }
);

module.exports = Order;
