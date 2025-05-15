const express = require('express');
const router = express.Router();
const frameController = require('../Controllers/frameController');
const upload=require('../Middlewares/uploadMiddleware')
const authMiddleware = require("../Middlewares/authMiddleware");


// Create a new frame
router.post('/createframe',authMiddleware,upload.array('images',5),frameController.createFrame);

// Get all frames with filtering and pagination
router.get('/getallframes', frameController.getAllFrames);
router.get('/newarrival', frameController.getNewArrivals);
router.get('/bestselling', frameController.getBestSellers);
// Get single frame by ID
router.get('/getbyid/:frameId', frameController.getFrameById);

// Update frame
router.put('/updateframe/:frameId',authMiddleware, upload.array('images',5),frameController.updateFrame);

// Delete frame
router.delete('/deleteframe/:frameId',authMiddleware, frameController.deleteFrame);

// Update frame rating
// router.patch('/:frameId/rating', frameController.updateFrameRating);

module.exports = router;