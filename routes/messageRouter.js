const express=require('express');
const router =express.Router();
const {protectReq}=require('../middlewares/authmiddleware.js')
const {getMessage,sendMessage,errorHandler}=require("../controllers/messageControllers.js")
router.route("/").post(protectReq,sendMessage,errorHandler);
router.route("/:chatId").get(protectReq,getMessage,errorHandler)



module.exports=router;