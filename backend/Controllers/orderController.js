const sequelize = require("../Config/db");
const Order = require("../Models/orderModel");
const OrderItem = require("../Models/orderItemModel");
const Cart = require("../Models/cartModel");
const FrameSize = require("../Models/frameSizeModel");
const Frame = require("../Models/frameModel");
const Image = require("../Models/imageModel");
const Size = require("../Models/sizeModel");
const { Sequelize } = require("sequelize"); // or from your db instance

const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
  try {
    if (!req.body) {
      throw new Error("Request data is missing");
    }

    let orderData;
    try {
      orderData = JSON.parse(req.body.data);
    } catch (err) {
      throw new Error(`Invalid JSON data: ${err.message}`);
    }

    const {
      userId,
      shippingInfo,
      paymentMethod,
      cartItems = [],
      customOrder = null,
    } = orderData;

    if (!cartItems.length && !customOrder) {
      throw new Error("No items or custom order provided");
    }

    let subtotal = 0;
    const orderItemsData = [];

    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        // Fetch FrameSize with FOR UPDATE to lock the row
        const frameSize = await FrameSize.findByPk(item.frameSizeId, {
          include: [Frame, Size], // Include Size for user-friendly error
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!frameSize) {
          throw new Error(`Invalid frameSizeId: ${item.frameSizeId}`);
        }

        // Validate stock
        const currentRemaining = frameSize.remaining_qty;
        if (currentRemaining < item.quantity) {
          throw new Error(
            `Insufficient stock for frame "${frameSize.frame.name}" (Size: ${frameSize.size.name}). Requested: ${item.quantity}, Available: ${currentRemaining}`
          );
        }

        const price = frameSize.offer_price || frameSize.price;
        const total = price * item.quantity;

        subtotal += total;

        orderItemsData.push({
          frameId: frameSize.frame.frameId,
          sizeId: frameSize.sizeId,
          frameSizeId: item.frameSizeId,
          productType: "pre-listed",
          price: price,
          quantity: item.quantity,
          totalAmount: total,
          color: item.color || null,
        });

        // Update purchased_qty
        await FrameSize.update(
          {
            purchased_qty: sequelize.literal(
              `purchased_qty + ${item.quantity}`
            ),
          },
          { where: { frameSizeId: item.frameSizeId }, transaction }
        );

        // Update remaining_qty based on updated purchased_qty
        await FrameSize.update(
          {
            remaining_qty: sequelize.literal(`total_qty - purchased_qty`),
          },
          { where: { frameSizeId: item.frameSizeId }, transaction }
        );

        // Log updated FrameSize
        const updatedFrameSize = await FrameSize.findByPk(item.frameSizeId, {
          transaction,
        });
      }
    }

    if (customOrder) {
      const {
        price,
        quantity = 1,
        customSize,
        dimensions,
        material,
        frameShape,
        frameMaterial,
        thickness,
        glassThickness,
        instructions,
        color,
      } = customOrder;
      const total = price * quantity;

      let imageUrl = null;
      if (req.file) {
        imageUrl = `${req.file.filename}`;
        console.log("Saving imageUrl for custom order:", imageUrl); // Debug
      } else {
        throw new Error("Image is required for custom order");
      }

      subtotal += total;

      orderItemsData.push({
        productType: "custom",
        customSize: customSize || null,
        width: dimensions?.width || null,
        height: dimensions?.height || null,
        material: material || null,
        frameShape: frameShape || null,
        frameMaterial: frameMaterial || null,
        thickness: thickness || null,
        glassThickness: glassThickness || null,
        imageUrl: imageUrl,
        instructions: instructions || null,
        price: price,
        quantity: quantity,
        totalAmount: total,
        color: color || null,
      });
    }

    const tax = subtotal * 0.18;
    const shippingCharge = 0;
    const grandTotal = subtotal + tax + shippingCharge;

    const order = await Order.create(
      {
        userId,
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
        paymentMethod,
        shippingCharge,
        tax,
        totalPrice: subtotal,
        grandTotal,
        status: 1,
        razorpay_order_id: orderData.razorpay_order_id || null, // Add Razorpay fields
        razorpay_payment_id: orderData.razorpay_payment_id || null,
        razorpay_signature: orderData.razorpay_signature || null,
        paymentStatus: orderData.paymentStatus || "Pending", // Add paymentStatus
      },
      { transaction }
    );

    await Promise.all(
      orderItemsData.map((item) =>
        OrderItem.create(
          {
            ...item,
            orderId: order.orderId,
          },
          { transaction }
        )
      )
    );

    if (cartItems && cartItems.length > 0) {
      await Cart.destroy({
        where: { userId },
        transaction,
      });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      order,
      orderItems: orderItemsData,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Order error:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Order placement failed",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const whereClause = status ? { status } : {};

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: FrameSize,
              include: [
                {
                  model: Frame,
                  include: [
                    {
                      model: Image,
                      attributes: ["imageUrl"],
                    },
                  ],
                },
                {
                  model: Size,
                  attributes: ["sizeId", "width", "height", "multiplier"],
                },
              ],
              required: false,
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]],
    });

    const processedOrders = orders.rows.map((order) => ({
      ...order.toJSON(),
      OrderItems: order.OrderItems
        ? order.OrderItems.map((item) => {
            if (item.productType === "pre-listed") {
              return {
                ...item.toJSON(),
                Frame: item.FrameSize?.Frame
                  ? {
                      ...item.FrameSize.Frame.toJSON(),
                      images: item.FrameSize.Frame.Images.map((img) => ({
                        imageUrl: img.imageUrl,
                      })),
                    }
                  : null,
              };
            } else {
              return {
                ...item.toJSON(),
                customSize: item.customSize,
                width: item.width,
                height: item.height,
                material: item.material,
                frameShape: item.frameShape,
                frameMaterial: item.frameMaterial,
                thickness: item.thickness,
                glassThickness: item.glassThickness,
                imageUrl: item.imageUrl,
                instructions: item.instructions,
                color: item.color,
              };
            }
          })
        : [],
    }));

    res.json({
      data: processedOrders,
      total: orders.count,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: FrameSize,
              include: [
                {
                  model: Frame,
                  include: [
                    {
                      model: Image,
                      attributes: ["imageUrl"],
                    },
                  ],
                },
                {
                  model: Size,
                  attributes: ["sizeId", "width", "height", "multiplier"],
                },
              ],
              required: false,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const processedOrders = orders.map((order) => {
      return {
        ...order.toJSON(),
        orderItems: order.orderItems
          ? order.orderItems.map((item) => {
              if (item.productType === "pre-listed") {
                return {
                  ...item.toJSON(),
                  Frame: item.FrameSize?.Frame
                    ? {
                        ...item.FrameSize.Frame.toJSON(),
                        images: item.FrameSize.Frame.Images
                          ? item.FrameSize.Frame.Images.map((img) => ({
                              imageUrl: img.imageUrl,
                            }))
                          : [],
                      }
                    : null,
                };
              } else {
                return {
                  ...item.toJSON(),
                  customSize: item.customSize,
                  width: item.width,
                  height: item.height,
                  material: item.material,
                  frameShape: item.frameShape,
                  frameMaterial: item.frameMaterial,
                  thickness: item.thickness,
                  glassThickness: item.glassThickness,
                  imageUrl: item.imageUrl,
                  instructions: item.instructions,
                  color: item.color,
                };
              }
            })
          : [],
      };
    });

    res.json(processedOrders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: FrameSize,
              include: [
                {
                  model: Frame,
                  include: [
                    {
                      model: Image,
                      attributes: ["imageUrl"],
                    },
                  ],
                },
                {
                  model: Size,
                  attributes: ["sizeId", "width", "height", "multiplier"],
                },
              ],

              required: false,
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== req.user?.userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const processedOrder = {
      ...order.toJSON(),
      OrderItems: order.OrderItems
        ? order.OrderItems.map((item) => {
            if (item.productType === "pre-listed") {
              return {
                ...item.toJSON(),
                Frame: item.FrameSize?.Frame
                  ? {
                      ...item.FrameSize.Frame.toJSON(),
                      images: item.FrameSize.Frame.Images.map((img) => ({
                        imageUrl: img.imageUrl,
                      })),
                    }
                  : null,
              };
            } else {
              return {
                ...item.toJSON(),
                customSize: item.customSize,
                width: item.width,
                height: item.height,
                material: item.material,
                frameShape: item.frameShape,
                frameMaterial: item.frameMaterial,
                thickness: item.thickness,
                glassThickness: item.glassThickness,
                imageUrl: item.imageUrl,
                instructions: item.instructions,
                color: item.color,
              };
            }
          })
        : [],
    };

    res.json(processedOrder);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const updateOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.orderId, { transaction });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.update({ status }, { transaction });
    await transaction.commit();

    res.json(order);
  } catch (error) {
    await transaction.rollback();
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.orderId, { transaction });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== 1) {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    await order.update({ status: 5 }, { transaction });
    await transaction.commit();

    res.json(order);
  } catch (error) {
    await transaction.rollback();
    console.error("Cancel order error:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

const deleteOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.orderId, { transaction });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await OrderItem.destroy({
      where: { orderId: order.orderId },
      transaction,
    });

    await order.destroy({ transaction });
    await transaction.commit();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete order error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// const getSalesAnalytics = async (req, res) => {
//   try {
//     const totalSales = await Order.sum("grandTotal", {
//       where: { status: 4 },
//     });

//     const totalOrders = await Order.count();

//     const monthlyTrend = await Order.findAll({
//       attributes: [
//         [sequelize.fn("YEAR", sequelize.col("createdAt")), "year"],
//         [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
//         [sequelize.fn("SUM", sequelize.col("grandTotal")), "totalSales"],
//         [sequelize.fn("COUNT", sequelize.col("orderId")), "orderCount"],
//       ],
//       group: ["year", "month"],
//       order: [
//         [sequelize.col("year"), "ASC"],
//         [sequelize.col("month"), "ASC"],
//       ],
//     });

//     const statusDistribution = await Order.findAll({
//       attributes: [
//         "status",
//         [sequelize.fn("COUNT", sequelize.col("status")), "count"],
//       ],
//       group: ["status"],
//     });

//     const topProducts = await OrderItem.findAll({
//       where: { productType: "pre-listed" },
//       attributes: [
//         "frameId",
//         [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
//         [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalRevenue"],
//       ],
//       include: [
//         {
//           model: FrameSize,
//           include: [
//             {
//               model: Frame,
//               attributes: ["name"],
//               include: [
//                 {
//                   model: Image,
//                   attributes: ["imageUrl"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//       group: ["frameId"],
//       order: [[sequelize.literal("totalSold"), "DESC"]],
//       limit: 4,
//     });

//     res.json({
//       totalSales: totalSales || 0,
//       totalOrders,
//       monthlyTrend,
//       statusDistribution,
//       topProducts: topProducts.map((item) => ({
//         productId: item.frameId,
//         name: item.FrameSize?.Frame?.name,
//         image: item.FrameSize?.Frame?.Images[0]?.imageUrl,
//         totalSold: item.dataValues.totalSold,
//         totalRevenue: item.dataValues.totalRevenue,
//       })),
//     });
//   } catch (error) {
//     console.error("Analytics error:", error);
//     res.status(500).json({ error: "Failed to fetch analytics" });
//   }
// };

const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          attributes: [
            "orderItemId",
            "productType",
            "quantity",
            "totalAmount",
            "frameSizeId",
          ],
          include: [
            {
              model: FrameSize,
              attributes: ["frameSizeId", "frameId"],
              include: [
                {
                  model: Frame,
                  attributes: ["frameId", "name"],
                  include: [
                    {
                      model: Image,
                      attributes: ["imageUrl"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // Calculate analytics
    const totalSales = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    const totalOrders = orders.length;

    const monthlyTrend = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[key] = acc[key] || {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        totalSales: 0,
      };
      acc[key].totalSales += order.grandTotal;
      return acc;
    }, {});

    const statusDistribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate top products (only pre-listed)
    const topProducts = [];
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.productType === "pre-listed" && item.FrameSize?.Frame) {
          const productId = item.FrameSize.Frame.frameId;
          const product = topProducts.find((p) => p.productId === productId);
          if (product) {
            product.totalSold += item.quantity;
            product.totalRevenue += item.totalAmount;
          } else {
            topProducts.push({
              productId,
              productType: item.productType,
              name: item.FrameSize.Frame.name || "Unknown Frame",
              image: item.FrameSize.Frame.Images?.[0]?.imageUrl || "",
              totalSold: item.quantity,
              totalRevenue: item.totalAmount,
            });
          }
        }
      });
    });

    // Sort and limit to top 5
    topProducts.sort((a, b) => b.totalSold - a.totalSold);

    res.json({
      totalSales,
      totalOrders,
      monthlyTrend: Object.values(monthlyTrend),
      statusDistribution: Object.entries(statusDistribution).map(
        ([status, count]) => ({
          status: parseInt(status),
          count,
        })
      ),
      topProducts: topProducts.slice(0, 5),
    });
  } catch (error) {
    console.error("Sales management error:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
};

const hasPurchased = async (req, res) => {
  try {
    const { frameId } = req.params;
    const { userId } = req.body;

    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required in the request body",
      });
    }

    // Find a completed order for the user that contains the specified frameId
    const order = await Order.findOne({
      where: {
        userId: parseInt(userId), // Ensure userId is an integer
        status: 4, // Assuming status 4 is "completed"
      },
      include: [
        {
          model: OrderItem,
          where: {
            frameId: frameId,
            productType: "pre-listed", // Only consider pre-listed items
          },
          required: true,
        },
      ],
    });

    res.json({
      success: true,
      hasPurchased: !!order,
    });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check purchase status",
    });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getSalesAnalytics,
  hasPurchased,
};
