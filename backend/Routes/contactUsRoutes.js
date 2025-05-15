const express=require('express')
const router=express.Router()
const contactUsController=require('../Controllers/contactUsController')
const authMiddleware=require('../Middlewares/authMiddleware')


router.post('/create',contactUsController.createrequest)
router.get('/getall',authMiddleware,contactUsController.getrequest)
router.delete('/remove/:contactId',authMiddleware,contactUsController.deleteRequest)
                                          
module.exports=router;


