// const { DataTypes } = require("sequelize");
// const Sequelize = require("../Config/db");

// const OrderItem = Sequelize.define(
//   "orderItem",
//   {
//     orderItemId: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
// orderId: {
//   type: DataTypes.INTEGER,
//   defaultValue: null,
//   references: {
//     model: "order",
//     key: "orderId",
//   },
// },
//     frameId: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: "frame",
//         key: "frameId",
//       },
//     },
//     sizeId: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: "size",
//         key: "sizeId",
//       },
//     },
//     frameSizeId: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: "frameSize",
//         key: "frameSizeId",
//       },
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     totalAmount: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "orderitem",
//     timestamps: true,
//   }
// );

// module.exports = OrderItem;

// Models/orderItemModel.js

const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const OrderItem = Sequelize.define(
  "orderItem",
  {
    orderItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "order",
        key: "orderId",
      },
    },
    frameId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null for custom products
      references: {
        model: "frame",
        key: "frameId",
      },
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null for custom products
      references: {
        model: "size",
        key: "sizeId",
      },
    },
    frameSizeId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null for custom products
      references: {
        model: "frameSize",
        key: "frameSizeId",
      },
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pre-listed", // "pre-listed" or "custom"
    },
    customSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: true, // e.g., 17.5
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true, // e.g., 11.5
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "Acrylic"
    },
    frameShape: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "Four Corner Round"
    },
    frameMaterial: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "PVC"
    },
    thickness: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "3mm"
    },
    glassThickness: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "3mm"
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // URL of uploaded image
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true, // Special instructions
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "orderItem",
    timestamps: true,
  }
);

module.exports = OrderItem;
