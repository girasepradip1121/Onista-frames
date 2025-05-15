const { DataTypes } = require('sequelize');
const Sequelize = require('../Config/db');

const Review = Sequelize.define('review', {
    ratingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    frameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "frame",
            key: 'frameId'
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title:{
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName:'review',
    timestamps: true,
    indexes: [
        {
            unique: true,
            name: 'frame_unique',
            fields: ['userId', 'frameId'] 
        }
    ]
});

module.exports=Review
