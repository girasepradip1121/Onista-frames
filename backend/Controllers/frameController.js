// const {
//   Frame,
//   FrameSize,
//   Size,
//   Image,
//   FrameMaterial,
//   Material,
// } = require("../Models");
// const { Op } = require("sequelize");
// const { Sequelize } = require('sequelize');

// const frameController = {
//   // Create a new frame with associated sizes and images

//   async createFrame(req, res) {
//     try {
//       const {
//         name,
//         description,
//         colors, // Changed from colorsStr
//         materialId,
//         frameMaterialId,
//         frameShape,
//         weight,
//         origin,
//         careInstruction, // Changed from careInstructionStr
//         includes, // Changed from includesStr
//         isNewArrival,
//         isOffer,
//         sizes: rawSizes, // Array of { sizeId, total_qty, price, offer_price }
//       } = req.body;

//       // Parse if they are strings (FormData sends them as JSON strings)
//       const parsedColors =
//         typeof colors === "string" ? JSON.parse(colors) : colors || [];
//       const parsedCareInstruction =
//         typeof careInstruction === "string"
//           ? JSON.parse(careInstruction)
//           : careInstruction || [];
//       const parsedIncludes =
//         typeof includes === "string" ? JSON.parse(includes) : includes || [];

//       const sizes =
//         typeof rawSizes === "string" ? JSON.parse(rawSizes) : rawSizes || [];

//       // Create frame
//       const frame = await Frame.create({
//         name,
//         basePrice,
//         description,
//         colors: parsedColors,
//         materialId,
//         frameMaterialId,
//         frameShape,
//         weight,
//         origin,
//         careInstruction: parsedCareInstruction,
//         includes: parsedIncludes,
//         isNewArrival,
//         isOffer,
//       });

//       // Create frame sizes
//       if (sizes && sizes.length > 0) {
//         const frameSizes = sizes.map((size) => ({
//           frameId: frame.frameId,
//           sizeId: size.sizeId,
//           total_qty: size.total_qty,
//           remained_qty: size.total_qty,
//           purchased_qty: 0,
//           price: size.price,
//           offer_price: size.offer_price,
//         }));
//         await FrameSize.bulkCreate(frameSizes);
//       }

//       // Create images
//       if (req.files && req.files.length > 0) {
//         const images = req.files.map((file) => ({
//           frameId: frame.frameId,
//           imageUrl: `/${file.filename}`, // Ensure this matches your multer configuration
//         }));
//         await Image.bulkCreate(images);
//       }

//       // Fetch the created frame with associations
//       const createdFrame = await Frame.findByPk(frame.frameId, {
//         include: [{ model: FrameSize, include: [Size] }, { model: Image }],
//       });

//       res.status(201).json({
//         success: true,
//         data: createdFrame,
//       });
//     } catch (error) {
//       console.error("Error creating frame:", error);
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   },

//   // Get all frames with filtering and pagination
//   async getAllFrames(req, res) {
//     try {
//       const {
//         page = 1,
//         limit = 12,
//         search,
//         frameMaterialIds,
//         sizeIds,
//         frameShapes,
//         materialIds,
//         minPrice,
//         maxPrice,
//       } = req.query;

//       const materialIdsArray = materialIds ? materialIds.split(",") : [];
//       const frameMaterialIdsArray = frameMaterialIds
//         ? frameMaterialIds.split(",")
//         : [];
//       const sizeIdsArray = sizeIds ? sizeIds.split(",") : [];
//       const frameShapesArray = frameShapes ? frameShapes.split(",") : [];

//       const offset = (page - 1) * limit;
//       const where = {};
//       const include = [
//         {
//           model: FrameSize,
//           include: [Size],
//           where: {},
//           required: false,
//         },
//         {
//           model: Image,
//           required: false,
//         },
//         {
//           model: FrameMaterial,
//           required: false,
//         },
//         {
//           model: Material,
//           required: false,
//         },
//       ];

//       if (search) {
//         where.name = {
//           [Op.like]: `%${search.toLowerCase()}%`,
//         };
//       }
//       if (materialIdsArray.length > 0) {
//         where.materialId = { [Op.in]: materialIdsArray };
//       }
//       if (frameMaterialIdsArray.length > 0) {
//         where.frameMaterialId = { [Op.in]: frameMaterialIdsArray };
//       }
//       if (frameShapesArray.length > 0) {
//         where.frameShape = { [Op.in]: frameShapesArray };
//       }
//       if (sizeIdsArray.length > 0) {
//         include[0].where.sizeId = { [Op.in]: sizeIdsArray };
//         include[0].required = true;
//       }

//       // if (minPrice || maxPrice) {
//       //   include[0].where.price = {
//       //     [Op.between]: [minPrice || 0, maxPrice || 999999],
//       //   };
//       //   include[0].required = true;
//       // }

//       // console.log("include",include);

//       const frames = await Frame.findAndCountAll({
//         where,
//         include,
//         distinct: true,
//         limit: parseInt(limit),
//         offset: parseInt(offset),
//         order: [["createdAt", "DESC"]],
//       });

//       res.status(200).json({
//         success: true,
//         data: frames.rows,
//         pagination: {
//           total: frames.count,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(frames.count / limit),
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//       console.log(error);
//     }
//   },

//   // Get single frame by ID
//   async getFrameById(req, res) {
//     try {
//       const { frameId } = req.params;

//       const frame = await Frame.findByPk(frameId, {
//         include: [
//           {
//             model: FrameSize,
//             include: [Size],
//             attributes: [
//               "frameSizeId",
//               "total_qty",
//               "remained_qty",
//               "price",
//               "offer_price",
//             ],
//           },
//           {
//             model: Image,
//             attributes: ["imageId", "imageUrl"],
//           },
//           {
//             model: Material,
//             attributes: ["materialId", "materialName"],
//           },
//           {
//             model: FrameMaterial,
//             attributes: ["frameMaterialId", "materialName"],
//           },
//         ],
//       });

//       if (!frame) {
//         return res.status(404).json({
//           success: false,
//           error: "Frame not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: frame,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   },

//   // Update frame
//   async updateFrame(req, res) {
//     try {
//       const { frameId } = req.params;
//       console.log("body:", req.body);
//       console.log("files:", req.files); // Debug: Check uploaded files

//       const {
//         name,
//         basePrice,
//         description,
//         colors,
//         materialId,
//         frameMaterialId,
//         frameShape,
//         weight,
//         origin,
//         careInstruction,
//         includes,
//         isNewArrival,
//         isOffer,
//         sizes: rawSizes,
//         existingImages, // Add this to handle existing images
//       } = req.body;

//       // Parse JSON fields
//       const colorsStr = colors ? JSON.parse(colors) : [];
//       const careInstructionStr = careInstruction
//         ? JSON.parse(careInstruction)
//         : [];
//       const includeStr = includes ? JSON.parse(includes) : [];
//       const sizes =
//         typeof rawSizes === "string" ? JSON.parse(rawSizes) : rawSizes;
//       const existingImageIds = existingImages ? JSON.parse(existingImages) : [];

//       // Find frame
//       const frame = await Frame.findByPk(frameId);
//       if (!frame) {
//         return res.status(404).json({
//           success: false,
//           error: "Frame not found",
//         });
//       }

//       // Update frame details
//       await frame.update({
//         name,
//         basePrice,
//         description,
//         colors: colorsStr,
//         materialId,
//         frameMaterialId,
//         frameShape,
//         weight,
//         origin,
//         careInstruction: careInstructionStr,
//         includes: includeStr,
//         isNewArrival,
//         isOffer,
//       });

//       // Update sizes if provided
//       if (sizes) {
//         await FrameSize.destroy({ where: { frameId } });
//         const frameSizes = sizes.map((size) => ({
//           frameId,
//           sizeId: size.sizeId,
//           total_qty: size.total_qty,
//           remained_qty: size.total_qty,
//           purchased_qty: 0,
//           price: size.price,
//           offer_price: size.offer_price,
//         }));
//         await FrameSize.bulkCreate(frameSizes);
//       }

//       // Handle images
//       // Step 1: Delete images that are not in existingImageIds
//       await Image.destroy({
//         where: {
//           frameId,
//           imageId: { [Op.notIn]: existingImageIds }, // Sequelize operator to keep only specified IDs
//         },
//       });

//       // Step 2: Add new images from req.files
//       if (req.files && req.files.length > 0) {
//         const frameImages = req.files.map((file) => ({
//           frameId,
//           imageUrl: `/${file.filename}`, // Adjust path based on your setup
//         }));
//         await Image.bulkCreate(frameImages);
//       }

//       // Fetch updated frame
//       const updatedFrame = await Frame.findByPk(frameId, {
//         include: [{ model: FrameSize, include: [Size] }, { model: Image }],
//       });

//       res.status(200).json({
//         success: true,
//         data: updatedFrame,
//       });
//     } catch (error) {
//       console.error("Error updating frame:", error);
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   },

//   // Delete frame
//   async deleteFrame(req, res) {
//     try {
//       const { frameId } = req.params;

//       const frame = await Frame.findByPk(frameId);
//       if (!frame) {
//         return res.status(404).json({
//           success: false,
//           error: "Frame not found",
//         });
//       }

//       // Delete associated records
//       await FrameSize.destroy({ where: { frameId } });
//       await Image.destroy({ where: { frameId } });
//       await Frame.destroy({ where: { frameId } });

//       res.status(200).json({
//         success: true,
//         message: "Frame deleted successfully",
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   },

//   // Update frame rating
//   async updateFrameRating(req, res) {
//     try {
//       const { frameId } = req.params;
//       const { rating } = req.body;

//       if (rating < 1 || rating > 5) {
//         return res.status(400).json({
//           success: false,
//           error: "Rating must be between 1 and 5",
//         });
//       }

//       const frame = await Frame.findByPk(frameId);
//       if (!frame) {
//         return res.status(404).json({
//           success: false,
//           error: "Frame not found",
//         });
//       }

//       const newTotalRatings = frame.totalRatings + 1;
//       const newAverageRating =
//         (frame.averageRating * frame.totalRatings + rating) / newTotalRatings;

//       await frame.update({
//         averageRating: newAverageRating,
//         totalRatings: newTotalRatings,
//       });

//       res.status(200).json({
//         success: true,
//         data: {
//           frameId,
//           averageRating: newAverageRating,
//           totalRatings: newTotalRatings,
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   },

//   async getNewArrivals(req, res) {
//     try {
//       const frames = await Frame.findAll({
//         where: { isNewArrival: true },
//         // include: [{ model: Image, as: "images" }],
//         include: [
//           {
//             model: FrameSize,
//             include: [Size],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: FrameMaterial,
//           },
//           {
//             model: Material,
//           },
//         ],

//         order: [["createdAt", "DESC"]],
//         limit: 4,
//       });
//       // const formatted = frames.map((frame) => {
//       //   const frameJSON = frame.toJSON();
//       //   return {
//       //     ...frameJSON,
//       //     images: frameJSON.images.map((img) => img.imageUrl),
//       //   };
//       // });

//       res.status(200).json(frames);
//     } catch (error) {
//       console.error("Get New Arrivals Error:", error);
//       res.status(500).json({ message: "Failed to fetch new arrivals" });
//     }
//   },

//   async getBestSellers(req, res) {
//     try {
//       const bestSellers = await Frame.findAll({
//         include: [
//           {
//             model: FrameSize,
//             as: 'frameSizes', 
//             attributes: [],
//             required: true,
//           },
//           {
//             model: Image,
//           },
//           {
//             model: FrameMaterial,
//           },
//           {
//             model: Material,
//           },
//         ],
//         attributes: {
//           include: [
//             [
//               Sequelize.fn("SUM", Sequelize.col("frameSizes.purchased_qty")),
//               "totalSold",
//             ],
//           ],
//         },
//         group: ["Frame.frameId"],
//         order: [[Sequelize.literal("totalSold"), "DESC"]],
//         limit: 4,
//         logging: console.log,
//       });

//       res.status(200).json(bestSellers);
//     } catch (error) {
//       console.error("Get Best Sellers Error:", error);
//       res.status(500).json({ message: "Failed to fetch best sellers" });
//     }
//   },
// };

// module.exports = frameController;


const { Frame, FrameSize, Size, Image, FrameMaterial, Material } = require("../Models");
const { Op, Sequelize } = require("sequelize");

const frameController = {
  // Create a new frame with associated sizes and images
  async createFrame(req, res) {
    try {
      const {
        name,
        basePrice,
        description,
        colors,
        materialId,
        frameMaterialId,
        frameShape,
        weight,
        origin,
        careInstruction,
        includes,
        isNewArrival,
        isOffer,
        sizes: rawSizes,
      } = req.body;

      // Parse if they are strings (FormData sends them as JSON strings)
      const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors || [];
      const parsedCareInstruction =
        typeof careInstruction === "string" ? JSON.parse(careInstruction) : careInstruction || [];
      const parsedIncludes = typeof includes === "string" ? JSON.parse(includes) : includes || [];
      const sizes = typeof rawSizes === "string" ? JSON.parse(rawSizes) : rawSizes || [];

      // Create frame
      const frame = await Frame.create({
        name,
        basePrice,
        description,
        colors: parsedColors,
        materialId,
        frameMaterialId,
        frameShape,
        weight,
        origin,
        careInstruction: parsedCareInstruction,
        includes: parsedIncludes,
        isNewArrival,
        isOffer,
      });

      // Create frame sizes
      if (sizes && sizes.length > 0) {
        const frameSizes = sizes.map((size) => ({
          frameId: frame.frameId,
          sizeId: size.sizeId,
          total_qty: size.total_qty,
          remained_qty: size.total_qty,
          purchased_qty: 0,
          price: size.price,
          offer_price: size.offer_price,
        }));
        await FrameSize.bulkCreate(frameSizes);
      }

      // Create images
      if (req.files && req.files.length > 0) {
        const images = req.files.map((file) => ({
          frameId: frame.frameId,
          imageUrl: `/${file.filename}`,
        }));
        await Image.bulkCreate(images);
      }

      // Fetch the created frame with associations
      const createdFrame = await Frame.findByPk(frame.frameId, {
        include: [
          { model: FrameSize, as: "frameSizes", include: [Size] },
          { model: Image, as: "images" },
        ],
      });

      res.status(201).json({
        success: true,
        data: createdFrame,
      });
    } catch (error) {
      console.error("Error creating frame:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get all frames with filtering and pagination
  async getAllFrames(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        frameMaterialIds,
        sizeIds,
        frameShapes,
        materialIds,
        minPrice,
        maxPrice,
      } = req.query;

      const materialIdsArray = materialIds ? materialIds.split(",") : [];
      const frameMaterialIdsArray = frameMaterialIds ? frameMaterialIds.split(",") : [];
      const sizeIdsArray = sizeIds ? sizeIds.split(",") : [];
      const frameShapesArray = frameShapes ? frameShapes.split(",") : [];

      const offset = (page - 1) * limit;
      const where = {};
      const include = [
        {
          model: FrameSize,
          as: "frameSizes",
          include: [Size],
          where: {},
          required: false,
        },
        {
          model: Image,
          as: "images",
          required: false,
        },
        {
          model: FrameMaterial,
          as: "frameMaterial",
          required: false,
        },
        {
          model: Material,
          as: "material",
          required: false,
        },
      ];

      console.log("Query Parameters:", {
        page,
        limit,
        search,
        frameMaterialIds,
        sizeIds,
        frameShapes,
        materialIds,
        minPrice,
        maxPrice,
      });

      if (search) {
        where.name = { [Op.like]: `%${search.toLowerCase()}%` };
      }
      if (materialIdsArray.length > 0) {
        where.materialId = { [Op.in]: materialIdsArray };
      }
      if (frameMaterialIdsArray.length > 0) {
        where.frameMaterialId = { [Op.in]: frameMaterialIdsArray };
      }
      if (frameShapesArray.length > 0) {
        where.frameShape = { [Op.in]: frameShapesArray };
      }
      if (sizeIdsArray.length > 0) {
        include[0].where.sizeId = { [Op.in]: sizeIdsArray };
        include[0].required = true;
      }

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) {
          where.basePrice[Op.gte] = parseFloat(minPrice); // Greater than or equal to minPrice
        }
        if (maxPrice) {
          where.basePrice[Op.lte] = parseFloat(maxPrice); // Less than or equal to maxPrice
        }
      }

      console.log("Where Clause:", where);

      const frames = await Frame.findAndCountAll({
        where,
        include,
        distinct: true,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: frames.rows,
        pagination: {
          total: frames.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(frames.count / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching frames:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get single frame by ID
  async getFrameById(req, res) {
    try {
      const { frameId } = req.params;

      const frame = await Frame.findByPk(frameId, {
        include: [
          {
            model: FrameSize,
            as: "frameSizes",
            include: [Size],
            attributes: ["frameSizeId", "total_qty", "remained_qty", "price", "offer_price"],
          },
          {
            model: Image,
            as: "images",
            attributes: ["imageId", "imageUrl"],
          },
          {
            model: Material,
            as: "material",
            attributes: ["materialId", "materialName"],
          },
          {
            model: FrameMaterial,
            as: "frameMaterial",
            attributes: ["frameMaterialId", "materialName"],
          },
        ],
      });

      if (!frame) {
        return res.status(404).json({
          success: false,
          error: "Frame not found",
        });
      }

      res.status(200).json({
        success: true,
        data: frame,
      });
    } catch (error) {
      console.error("Error fetching frame:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Update frame
  async updateFrame(req, res) {
    try {
      const { frameId } = req.params;
      const {
        name,
        basePrice,
        description,
        colors,
        materialId,
        frameMaterialId,
        frameShape,
        weight,
        origin,
        careInstruction,
        includes,
        isNewArrival,
        isOffer,
        sizes: rawSizes,
        existingImages,
      } = req.body;

      // Parse JSON fields
      const colorsStr = colors ? JSON.parse(colors) : [];
      const careInstructionStr = careInstruction ? JSON.parse(careInstruction) : [];
      const includeStr = includes ? JSON.parse(includes) : [];
      const sizes = typeof rawSizes === "string" ? JSON.parse(rawSizes) : rawSizes;
      const existingImageIds = existingImages ? JSON.parse(existingImages) : [];

      // Find frame
      const frame = await Frame.findByPk(frameId);
      if (!frame) {
        return res.status(404).json({
          success: false,
          error: "Frame not found",
        });
      }

      // Update frame details
      await frame.update({
        name,
        basePrice,
        description,
        colors: colorsStr,
        materialId,
        frameMaterialId,
        frameShape,
        weight,
        origin,
        careInstruction: careInstructionStr,
        includes: includeStr,
        isNewArrival,
        isOffer,
      });

      // Update sizes if provided
      if (sizes) {
        await FrameSize.destroy({ where: { frameId } });
        const frameSizes = sizes.map((size) => ({
          frameId,
          sizeId: size.sizeId,
          total_qty: size.total_qty,
          remained_qty: size.total_qty,
          purchased_qty: 0,
          price: size.price,
          offer_price: size.offer_price,
        }));
        await FrameSize.bulkCreate(frameSizes);
      }

      // Handle images
      await Image.destroy({
        where: {
          frameId,
          imageId: { [Op.notIn]: existingImageIds },
        },
      });

      if (req.files && req.files.length > 0) {
        const frameImages = req.files.map((file) => ({
          frameId,
          imageUrl: `/${file.filename}`,
        }));
        await Image.bulkCreate(frameImages);
      }

      // Fetch updated frame
      const updatedFrame = await Frame.findByPk(frameId, {
        include: [
          { model: FrameSize, as: "frameSizes", include: [Size] },
          { model: Image, as: "images" },
        ],
      });

      res.status(200).json({
        success: true,
        data: updatedFrame,
      });
    } catch (error) {
      console.error("Error updating frame:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Delete frame
  async deleteFrame(req, res) {
    try {
      const { frameId } = req.params;

      const frame = await Frame.findByPk(frameId);
      if (!frame) {
        return res.status(404).json({
          success: false,
          error: "Frame not found",
        });
      }

      await FrameSize.destroy({ where: { frameId } });
      await Image.destroy({ where: { frameId } });
      await Frame.destroy({ where: { frameId } });

      res.status(200).json({
        success: true,
        message: "Frame deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting frame:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Update frame rating
  async updateFrameRating(req, res) {
    try {
      const { frameId } = req.params;
      const { rating } = req.body;

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: "Rating must be between 1 and 5",
        });
      }

      const frame = await Frame.findByPk(frameId);
      if (!frame) {
        return res.status(404).json({
          success: false,
          error: "Frame not found",
        });
      }

      const newTotalRatings = frame.totalRatings + 1;
      const newAverageRating =
        (frame.averageRating * frame.totalRatings + rating) / newTotalRatings;

      await frame.update({
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
      });

      res.status(200).json({
        success: true,
        data: {
          frameId,
          averageRating: newAverageRating,
          totalRatings: newTotalRatings,
        },
      });
    } catch (error) {
      console.error("Error updating frame rating:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get new arrivals
  async getNewArrivals(req, res) {
    try {
      const frames = await Frame.findAll({
        where: { isNewArrival: true },
        include: [
          {
            model: FrameSize,
            as: "frameSizes",
            include: [Size],
          },
          {
            model: Image,
            as: "images",
          },
          {
            model: FrameMaterial,
            as: "frameMaterial",
          },
          {
            model: Material,
            as: "material",
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 4,
      });

      res.status(200).json({
        success: true,
        data: frames,
      });
    } catch (error) {
      console.error("Get New Arrivals Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch new arrivals",
      });
    }
  },

  // Get best sellers
  async getBestSellers(req, res) {
    try {
      const bestSellers = await Frame.findAll({
        attributes: [
          "frameId",
          "name",
          "basePrice",
          "description",
          "colors",
          "materialId",
          "frameMaterialId",
          "frameShape",
          "weight",
          "origin",
          "careInstruction",
          "includes",
          "averageRating",
          "totalRatings",
          "isNewArrival",
          "isOffer",
          "createdAt",
          "updatedAt",
          [
            Sequelize.fn("SUM", Sequelize.col("frameSizes.purchased_qty")),
            "totalSold",
          ],
        ],
        include: [
          {
            model: FrameSize,
            as: "frameSizes",
            include: [Size],
          },
          {
            model: Image,
            as: "images",
            attributes: ["imageId", "frameId", "imageUrl", "createdAt", "updatedAt"],
          },
          {
            model: FrameMaterial,
            as: "frameMaterial",
            attributes: ["frameMaterialId", "materialName", "createdAt", "updatedAt"],
          },
          {
            model: Material,
            as: "material",
            attributes: ["materialId", "materialName", "createdAt", "updatedAt"],
          },
        ],
        group: ["Frame.frameId", "images.imageId", "frameMaterial.frameMaterialId", "material.materialId"],
        order: [[Sequelize.literal("totalSold"), "DESC"]],
        limit: 4,
        subQuery: false,
      });

      res.status(200).json({
        success: true,
        data: bestSellers,
      });
    } catch (error) {
      console.error("Get Best Sellers Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch best sellers",
      });
    }
  },
};

module.exports = frameController;