// Controllers/sliderController.js
const Slider = require("../Models/SliderModel");

exports.uploadImage =async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      try {
        const imageUrl = `${req.file.filename}`;
        const newImage = await Slider.create({ imageUrl });
        res.status(201).json(newImage);
      } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Server error', error });
      }
    },

  exports.getImages = async (req, res) => {
    try {
      const images = await Slider.findAll();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.deleteImage = async (req, res) => {
    try {
      const { sliderId } = req.params;
      const image = await Slider.findByPk(sliderId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      await image.destroy();
      res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };