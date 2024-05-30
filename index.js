const express=require("express");
const app=express();
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
const Chat = require("./models/chatModel.js");
//setting up the multer for uploading files
const multer=require('multer');
const upload=multer({dest:'./uploads'});
app.post('/uploadfile',upload.single('file'),()=>{
    console.log(req.file,req.body);
})


//-----------Mongoose setup---------------//
//--------go to mongoogse documentation 
//https://mongoosejs.com/docs/index.html 
//Go to quick start of this link and then you will see the code for it....
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/chatSystem')
  .then(() => console.log('Connected!'));


//------------listening to port-------------------

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})

app.get("/",(req,res,next)=>{
    console.log("root is working....");
    next();
});

app.get("/",(req,res)=>{
    res.render("login.ejs")
});
app.get('/signup',(req,res)=>{
    res.render("signup.ejs")
})


