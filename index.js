const express=require("express");
const app=express();
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
//app.set(express.static(path.join(__dirname,"public"))) we need this when we use sepreate file for the css or javascript

const Chat = require("./models/chat.js")

//-----------Mongoose setup---------------//
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/chatSystem')
  .then(() => console.log('Connected!'));


//------------listening to port-------------------

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})

app.get("/",(req,res)=>{
    res.send("root is working....");
})
app.get("/chats",async(req,res)=>{//this is a asyncrous function meaning we have to wait to get that Chat.find().
    let chats=await Chat.find();
    res.render("home.ejs",{chats});
})
