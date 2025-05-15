const { DataTypes } = require("sequelize");
const Sequelize = require("../Config/db");

const Material = Sequelize.define("material", {
    materialId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    materialName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeMaterial'
    },
    multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: "material",
});

module.exports = Material;