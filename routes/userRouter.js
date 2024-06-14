const express = require("express");
const router=express.Router();
const {searchResult,loginPage,registerUser,upload,signupPage, errorHandler,loginUser}=require('../controllers/userController');
const {protectReq}=require('../middlewares/authmiddleware.js')


router.route("/signup").get(signupPage).post(upload,registerUser,errorHandler);
router.route("/login").get(loginPage).post(loginUser);
router.route("/searchUser").post(protectReq,searchResult);

module.exports=router;