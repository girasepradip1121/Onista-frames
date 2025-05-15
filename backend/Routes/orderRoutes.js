const express = require("express");
const router = express.Router();
const upload=require('../Middlewares/uploadMiddleware')
const orderController=require('../Controllers/orderController')
const authMiddleware = require("../Middlewares/authMiddleware");

router.post('/createorder',authMiddleware,upload.single('image'),orderController.placeOrder)
router.get('/getallorders',authMiddleware,orderController.getAllOrders)
router.get('/getuserorder/:userId',authMiddleware,orderController.getUserOrders)
router.get('/getbyid/:orderId',authMiddleware,orderController.getOrderById)
router.put('/updatestatus/:orderId',authMiddleware,orderController.updateOrderStatus)
router.post('/deleteorder',authMiddleware,orderController.deleteOrder)
router.get('/salemanage',authMiddleware,orderController.getSalesAnalytics)
router.post('/hasPurchased/:frameId',authMiddleware,orderController.hasPurchased)

module.exports=router;