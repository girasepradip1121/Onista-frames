const Wall = require('../Models/wallIntro');
const path = require('path');
const fs = require('fs');

// Get the single Wall entry
exports.getWall = async (req, res) => {
  try {
    const wall = await Wall.findOne();
    if (!wall) {
      return res.status(404).json({ error: 'Wall entry not found' });
    }
    res.json(wall);
  } catch (err) {
    console.error('Error fetching wall:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update the Wall entry
exports.createOrUpdateWall = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!file && !(await Wall.findOne())) {
      return res.status(400).json({ error: 'Image is required for new entry' });
    }

    // Check if a Wall entry exists
    let wall = await Wall.findOne();
    let imageUrl = wall ? wall.imageUrl : null;

    if (file) {
      imageUrl = `${file.filename}`;
      // Delete old image if updating
      if (wall && wall.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', wall.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    if (wall) {
      // Update existing entry
      wall.title = title;
      wall.description = description || '';
      if (imageUrl) wall.imageUrl = imageUrl;
      await wall.save();
    } else {
      // Create new entry
      wall = await Wall.create({
        title,
        description: description || '',
        imageUrl,
      });
    }

    res.status(200).json(wall);
  } catch (err) {
    console.error('Error creating/updating wall:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete the Wall entry
exports.deleteWall = async (req, res) => {
  try {
    const wall = await Wall.findOne();
    if (!wall) {
      return res.status(404).json({ error: 'Wall entry not found' });
    }

    // Delete image file
    if (wall.imageUrl) {
      const imagePath = path.join(__dirname, '..', wall.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await wall.destroy();
    res.json({ message: 'Wall entry deleted' });
  } catch (err) {
    console.error('Error deleting wall:', err);
    res.status(500).json({ error: 'Server error' });
  }
};