// Models/SocialPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const SocialPost = sequelize.define("socialpost", {
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instagramLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
    tableName: "socialpost",
    timestamps: true,
  }
);

module.exports = SocialPost;