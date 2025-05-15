const { Review, Frame, Order, OrderItem } = require('../Models');
const { Op } = require('sequelize');

exports.getReviewsByFrameId = async (req, res) => {
  try {
    const { frameId } = req.params;

    const reviews = await Review.findAll({
      where: { frameId },
      order: [['createdAt', 'DESC']],
      attributes: ['ratingId', 'frameId', 'userId', 'title', 'rating', 'review', 'name', 'createdAt'],
    });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { frameId, userId, name, title, review, rating } = req.body;

    console.log('Received review data:', req.body); // Debug log

    // Validate input
    if (!frameId || !userId || !name || !title || !review || !rating) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Check if frame exists
    const frame = await Frame.findByPk(frameId);
    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' });
    }

    // Check if user has already reviewed this frame
    const existingReview = await Review.findOne({
      where: { frameId, userId },
    });
    console.log('Existing review:', existingReview ? existingReview.toJSON() : 'No existing review'); // Debug log
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Check if user has purchased the frame
    console.log('Checking purchase for userId:', userId, 'frameId:', frameId); // Debug log
    const order = await Order.findOne({
      where: {
        userId: parseInt(userId),
        status: 4, // Assuming status 4 is "completed"
      },
      include: [
        {
          model: OrderItem,
          where: {
            frameId: parseInt(frameId),
          },
          required: true,
        },
      ],
      logging: (sql) => console.log('SQL Query:', sql), // Debug SQL
    });

    console.log('Found order:', order ? order.toJSON() : 'No order found'); // Debug log

    if (!order) {
      return res.status(403).json({ success: false, message: 'You must purchase this product to review it' });
    }

    // Create review
    const newReview = await Review.create({
      frameId,
      userId,
      name,
      title,
      review,
      rating,
    });

    // Update Frame's averageRating and totalRatings
    const reviews = await Review.findAll({
      where: { frameId },
      attributes: ['rating'],
    });

    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    await frame.update({
      averageRating: averageRating.toFixed(1), // Round to 1 decimal
      totalRatings,
    });

    console.log('Updated frame:', { averageRating, totalRatings }); // Debug log

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'ratingId',
        'frameId',
        'userId',
        'name',
        'title',
        'review',
        'rating',
        'createdAt',
      ],
    });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Store frameId for updating Frame stats after deletion
    const { frameId } = review;

    // Delete the review
    await review.destroy();

    // Update Frame's averageRating and totalRatings
    const reviews = await Review.findAll({
      where: { frameId },
      attributes: ['rating'],
    });

    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    const frame = await Frame.findByPk(frameId);
    if (frame) {
      await frame.update({
        averageRating: averageRating.toFixed(1), // Round to 1 decimal
        totalRatings,
      });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
