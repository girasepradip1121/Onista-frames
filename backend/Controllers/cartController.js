const Cart = require("../Models/cartModel");
const FrameSize = require("../Models/frameSizeModel");
const Frame=require('../Models/frameModel')
const Image=require('../Models/imageModel')
const Size=require('../Models/sizeModel')
const sequelize = require("../Config/db");

const cartController = {
  // Add item to cart
  addToCart: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { userId, frameSizeId, quantity, color } = req.body;
      // const userId = req.user.userId;

      // Validate input
      if (!frameSizeId || !quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Missing required fields: frameSizeId and quantity",
        });
      }

      // Check frame size availability
      const frameSize = await FrameSize.findByPk(frameSizeId, { transaction });
      if (!frameSize) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Frame size not found",
        });
      }

      // Check stock availability
      if (frameSize.remained_qty < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Insufficient stock available",
        });
      }

      // Check if item already exists in cart
      const existingCartItem = await Cart.findOne({
        where: {
          userId,
          frameId: frameSize.frameId,
          sizeId: frameSize.sizeId,
          frameSizeId,
        },
        transaction,
      });

      let cartItem;
      if (existingCartItem) {
        // Update quantity if item exists
        cartItem = await existingCartItem.update(
          {
            quantity: existingCartItem.quantity + quantity,
            price: frameSize.offer_price || frameSize.price,
          },
          { transaction }
        );
      } else {
        // Create new cart item
        cartItem = await Cart.create(
          {
            userId,
            frameId: frameSize.frameId,
            frameSizeId,
            color,
            sizeId: frameSize.sizeId,
            quantity,
            price: frameSize.offer_price || frameSize.price,
          },
          { transaction }
        );
      }

      await transaction.commit();
      res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: cartItem,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: "Error adding to cart",
        error: error.message,
      });
      
    }
  },

  // Get user's cart
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("userId",req.params);
      

      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Frame,
            include: [Image],
            attributes: ["frameId", "name", "description"],
          },
          {
            model: FrameSize,
            include: [Size],
            attributes: ["frameSizeId", "price", "offer_price"],
          },
        ],
      });

      if (!cartItems.length) {
        return res.status(404).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Calculate total price
      const total = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      res.status(200).json({
        success: true,
        data: {
          items: cartItems,
          total: total.toFixed(2),
          count: cartItems.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching cart",
        error: error.message,
      });
      console.log(error);

    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { cartId } = req.params;
      const { quantity } = req.body;
      // const userId = req.params;

      // Validate input
      if (!quantity || quantity < 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid quantity value",
        });
      }

      const cartItem = await Cart.findOne({
        where: { cartId },
        include: [FrameSize],
        transaction,
      });

      if (!cartItem) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      // Check stock availability
      if (cartItem.frameSize.remained_qty < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Insufficient stock available",
        });
      }

      const updatedItem = await cartItem.update({ quantity }, { transaction });
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Cart item updated",
        data: updatedItem,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: "Error updating cart item",
        error: error.message,
      });
      console.log(error);
      
    }
  },

  // Remove item from cart
  removeCartItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { cartId } = req.params;

      const cartItem = await Cart.findOne({
        where: { cartId },
        transaction,
      });

      if (!cartItem) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      await cartItem.destroy({ transaction });
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: "Error removing item from cart",
        error: error.message,
      });
    }
  },

  // Clear entire cart
  clearCart: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user.userId;

      await Cart.destroy({
        where: { userId },
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: "Error clearing cart",
        error: error.message,
      });
    }
  },
};

module.exports = cartController;
