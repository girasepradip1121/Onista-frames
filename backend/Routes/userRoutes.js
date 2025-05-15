const express=require('express')
const router=express.Router()
const usercontroller=require('../Controllers/userController')
const authMiddleware = require("../Middlewares/authMiddleware");
// const upload=require('../Middlewares/uploadMiddleware')

router.post('/signup',usercontroller.signup);
router.post('/login',usercontroller.login);
router.put('/updateprofile',authMiddleware,usercontroller.updateProfile);
router.get('/getall',authMiddleware,usercontroller.getUsers);
router.get('/getuserbyid/:userId',usercontroller.getUserById);

module.exports=router;

