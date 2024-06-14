const express=require('express');
const router=express.Router();
const {protectReq}=require("../middlewares/authmiddleware.js");
const {renameGroup,createGroupChat,addToGroup,removeFromGroup,errorHandler,fetchChats,accessAllChat}=require("../controllers/chatControllers.js")

router.route("/").get(protectReq,fetchChats,errorHandler);
router.route("/group")
.post(protectReq,createGroupChat);
router.route("/rename").post(protectReq,renameGroup);
router.route("/groupremove").post(protectReq,removeFromGroup);
router.route("/groupadd").post(protectReq,addToGroup);

module.exports=router;