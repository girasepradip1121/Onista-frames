const sequelize = require('../Config/db');
const User = require('./usermodel');
const Frame = require('./frameModel');
const Image=require('./imageModel')
const Material = require('./materialModel');
const FrameMaterial = require('./framematerialModel');
const Size = require('./sizeModel');
const FrameSize = require('./frameSizeModel');
// const FrameShape = require('./FrameShapeModel');
// const Color = require('./colorModel');
const Review = require('./reviewModel');
const Cart=require('./cartModel')
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');
const ContactUs = require('./contactUsModel');
const News = require('./newsModel');
const Section = require('./newsSectionModel');


const { Sequelize } = require('sequelize');

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Frame.hasMany(FrameSize,{as: 'frameSizes', foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
Frame.hasMany(Image, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Frame.hasMany(Cart, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Frame.hasMany(OrderItem, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// Frame.belongsTo(FrameShape, { foreignKey: 'frameShapeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Frame.belongsTo(Material, { foreignKey: 'materialId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Frame.belongsTo(FrameMaterial, { foreignKey: 'frameMaterialId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Material.hasMany(Frame, { foreignKey: 'materialId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FrameMaterial.hasMany(Frame, { foreignKey: 'frameMaterialId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


// FrameShape.hasMany(Frame, { foreignKey: 'frameShapeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Size.hasMany(FrameSize, { foreignKey: 'sizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

FrameSize.belongsTo(Frame, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FrameSize.belongsTo(Size, { foreignKey: 'sizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FrameSize.hasMany(Cart, { foreignKey: 'frameSizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Image.belongsTo(Frame, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Review.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Review.belongsTo(Frame, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(Frame, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(Size, { foreignKey: 'sizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(FrameSize, { foreignKey: 'frameSizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Frame, { foreignKey: 'frameId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Size, { foreignKey: 'sizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(FrameSize, { foreignKey: 'frameSizeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

News.hasMany(Section, { foreignKey: 'newsId', as: 'sections' });
Section.belongsTo(News, { foreignKey: 'newsId' });

module.exports = {
    Sequelize,
    sequelize,
    User,
    Frame,
    Image,
    Material,
    FrameMaterial,
    Size,
    FrameSize,
    News,
    Section,
    Review,
    Cart,
    Order,
    OrderItem,
    ContactUs,
};
