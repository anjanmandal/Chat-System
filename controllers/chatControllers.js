const ExpressError = require('../customError/customError.js');
const User = require("../models/UserModel");
const Chat=require("../models/chatModel.js");

const fetchChats = async (req, res, next) => {
    try {
        const id = req.query.id;
        console.log(id);

        // Find the chat
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: id } } },
            ],
        })
            .populate('users', '-password')
            .populate('latestMessage');

        // Populate the latestMessage.sender
        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name pic email',
        });

        if (isChat.length > 0) {
            console.log(isChat);
            res.render('chat.ejs', { chat: isChat[0], currentUser: req.user });
            console.log("wahh-------")
        } else {
            // Create a new chat if none exists
            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user._id, id],
            };

            const createdChat = await Chat.create(chatData);
            let fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate('users', '-password')
                .populate('latestMessage');

            fullChat = await User.populate(fullChat, {
                path: 'latestMessage.sender',
                select: 'name pic email',
            });

            console.log(fullChat);
            res.render('chat.ejs', { chat: fullChat, currentUser: req.user });
        }
    } catch (err) {
        next(err);
    }
};


const createGroupChat=async(req,res,next)=>{
    const{users,groupName}=req.body;
    if(!users || !groupName){
        throw new ExpressError(401,"Missing group name or required members.");
    }
    if(users.length<2){
        throw new ExpressError(401,"Not Enough members to create Group..")
    }
    users.push(req.user);
    try{
        const groupChat=await chat.create({
            chatName,
            users,
            isGroupChat:true,
            groupAdmin:req.user
        })
    }catch(err){
        throw new ExpressError(err.status,err.message)
    }

}

const renameGroup=async(req,res,next)=>{
    const {chatId,chatName}=req.body;
    try{
    const updateChat=await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {new:true}
    )
    .populate('users',"-password")
    .populate('groupAdmin','-password')
}catch(err){
    if(!updateChat){
        throw new ExpressError(err.status,err.message);
    }
    else{
        res.send(updateChat);
    }
}
}
const addToGroup=async(req,res,next)=>{
    const{chatId,userId}=req.body;
    try{
    const added=Chat.findByIdAndUpdate(chatId,
        {
            $push:{users:userId},
        },
        {new:true},
    ).poputate("users","-password")
    .populate("groupAdmin","-password");
    
    if(!added){
        throw new ExpressError(401,"GroupChat Not found.")
    }
    else{
        res.send(added);
    }
}catch(err){
    throw new ExpressError(err.status,err.message);
}
}

const removeFromGroup=async(req,res,next)=>{
    const{chatId,userId}=req.body;
    try{
    const remove=Chat.findByIdAndUpdate(chatId,
        {
            $pull:{users:userId},
        },
        {new:true},
    ).poputate("users","-password")
    .populate("groupAdmin","-password");
    
    if(!removed){
        throw new ExpressError(401,"GroupChat Not found.")
    }
    else{
        res.send(removed);
    }
}catch(err){
    throw new ExpressError(err.status,err.message);
}
}

const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Some errors occurred' } = err;
    res.status(status).send(message);
};

module.exports = {addToGroup,removeFromGroup,renameGroup,createGroupChat, fetchChats,errorHandler };
