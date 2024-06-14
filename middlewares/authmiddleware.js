const jwt=require('jsonwebtoken');
const User=require("../models/UserModel");
const cookieParser=require('cookie-parser');
const ExpressError=require("../customError/customError.js");
const protectReq = async (req, res, next) => {
    console.log(req.cookies.token);
    try {
        if (!req.cookies.token) {
            throw new ExpressError(401, "Not authorized, token does not exist.");
        }

        const decode = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        console.log(decode);
        req.user = await User.findById(decode.id).select("-password"); // Exclude the password from the result
        next();
    } catch (err) {
        console.error(err);
        next(new ExpressError(401, "Token expired, please log in again."));
    }
};

module.exports = {protectReq};