const express = require('express');
const router = express.Router();
const WallController = require('../Controllers/wallController');
const upload=require('../Middlewares/uploadMiddleware')
const authMiddleware = require("../Middlewares/authMiddleware");

// Routes
router.get('/getwall', WallController.getWall);
router.post('/createwall', authMiddleware,upload.single('image'), WallController.createOrUpdateWall);
router.delete('/deletewall',authMiddleware, WallController.deleteWall);

module.exports = router;