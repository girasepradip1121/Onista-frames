// controllers/newsController.js
const { News, Section } = require('../Models');
const { Op } = require('sequelize');
const sequelize = require("../Config/db");

// Create News with Sections
exports.createNews = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("req", req.body);
    
    const { title, author,shortDesc, sections } = req.body;
    const image = req.file?.filename;

    // Parse sections if it's a string
    let parsedSections = [];
    if (typeof sections === 'string') {
      parsedSections = JSON.parse(sections);
    } else if (Array.isArray(sections)) {
      parsedSections = sections;
    }

    // Create News
    const news = await News.create({
      title,
      author,
      shortDesc,
      image
    }, { transaction });

    // Create Sections
    if(parsedSections && parsedSections.length > 0) {
      const sectionsData = parsedSections.map(section => ({
        ...section,
        newsId: news.newsId
      }));
      
      await Section.bulkCreate(sectionsData, { transaction });
    }

    await transaction.commit();
    
    // Fetch created news with sections
    const createdNews = await News.findByPk(news.newsId, {
      include: [{ model: Section, as: 'sections' }]
    });

    res.status(201).json({
      success: true,
      data: createdNews
    });

  } catch (error) {
    console.log(error);
    
    await transaction.rollback();
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get All News with Pagination
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      include: [{ model: Section, as: 'sections' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get Single News by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.newsId, {
      include: [{ model: Section, as: 'sections' }]
    });

    if(!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found'
      });
    }
    const processedNews = {
        ...news.toJSON(),
        sections: news.sections.map(section => ({
          ...section.toJSON(),
          bullets: section.bullets ? JSON.parse(section.bullets) : []
        }))
      };

      res.json({ success: true, data: processedNews });


  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update News and Sections
exports.updateNews = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { newsId } = req.params;
    const { title, author,shortDesc,sections } = req.body;

    const image = req.file?.filename || product.image;

    // Parse sections if it's a string
    let parsedSections = [];
    if (typeof sections === 'string') {
      parsedSections = JSON.parse(sections);
    } else if (Array.isArray(sections)) {
      parsedSections = sections;
    }

    // Update News
    const news = await News.findByPk(newsId, { transaction });
    if(!news) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'News not found'
      });
    }

    await news.update({
      title: title || news.title,
      author: author || news.author,
      shortDesc: shortDesc || news.shortDesc,
      image: image || news.image
    }, { transaction });

    // Update Sections
    if(parsedSections) {
      // Delete existing sections
      await Section.destroy({
        where: { newsId },
        transaction
      });

      // Create new sections
      const sectionsData = parsedSections.map(section => ({
        ...section,
        newsId
      }));
      
      await Section.bulkCreate(sectionsData, { transaction });
    }

    await transaction.commit();

    // Fetch updated news
    const updatedNews = await News.findByPk(newsId, {
      include: [{ model: Section, as: 'sections' }]
    });

    res.json({
      success: true,
      data: updatedNews
    });

  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete News with Sections
exports.deleteNews = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const news = await News.findByPk(req.params.newsId, { transaction });
    
    if(!news) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'News not found'
      });   
    }

    // Delete associated sections first
    await Section.destroy({
      where: { newsId: news.newsId },
      transaction
    });

    // Delete news
    await news.destroy({ transaction });
    
    await transaction.commit();

    res.json({
      success: true,
      message: 'News deleted successfully'
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
