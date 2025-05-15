const {DataTypes}=require('sequelize')
const Sequelize=require('../Config/db')

const Request=Sequelize.define("request",{
    contactId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{tableName:"request",timestamps:true})

module.exports=Request;