const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Size = Sequelize.define(
  "size",
  {
    sizeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    multiplier: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "size",
    indexes: [
      {
        unique: true,
        fields: ["width", "height"],
      },
    ],
    // defaultScope: {
    //   attributes: {
    //     include: [
    //       [
    //         Sequelize.literal(
    //           `CONCAT(size.width, ' x ', size.height, ' inch')`
    //         ),
    //         "label",
    //       ],
    //     ],
    //   },
    // },
  }
);

module.exports = Size;