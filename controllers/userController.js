const ExpressError = require('../customError/customError.js');
const User = require("../models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage }).single('profilePicture');
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ExpressError(401, "Client already exists");
        }

        const newUser = new User({
            name,
            email,
            password,
            confirmPassword,
            pic: `/uploads/${req.file.filename}`
        });
        console.log(newUser.pic);
        await newUser.save();
        res.render('login.ejs');
    } catch (err) {
        next(err);  // Pass errors to the errorHandler middleware
    }
};

// Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new ExpressError(400, "User does not exist");
        }

        const isMatch = await user.comparepassword(password,user.password);
        if (!isMatch) {
            throw new ExpressError(401, "Incorrect password");
        }

        const token = generateToken(user._id, user.email);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        console.log(token);
        res.render("homeUser.ejs",{currentUser:user});
    } catch (err) {
        next(err);
    }
};

// Generate JWT Token
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

// Middleware and Routes
const signupPage = (req, res) => {
    res.render('signup.ejs');
};

const loginPage = (req, res) => {
    res.render('login.ejs');
};

const searchResult=async(req,res,next)=>{
 
        const searchTerm = req.body.searchTerm.toLowerCase();
        try {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            });
            res.render('searchResults', { title: 'Search Results', users, currentUser:req.user});
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    };



const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Some errors occurred' } = err;
    res.status(status).send(message);
};

module.exports = {searchResult, loginPage, loginUser, registerUser, errorHandler, upload, signupPage };
