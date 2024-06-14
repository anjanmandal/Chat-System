const ExpressError = require('../customError/customError.js');
const User = require("../models/UserModel");
const Chat = require("../models/chatModel.js");
const Message = require('../models/MessageModel.js');

const sendMessage = async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        throw new ExpressError(401, "missing content");
    }
    let newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pic').execPopulate();
        message = await message.populate('chat').execPopulate();
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });

        console.log(message);

        // Now you have to make this new message as latest message
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        console.log(message);
        res.render("message.ejs", { messages: [message], currentUser: req.user });

    } catch (err) {
        throw new ExpressError(err.status, err.message);
    }
};

const getMessage = async (req, res, next) => {
    try {
        let messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        messages = await User.populate(messages, {
            path: 'chat.users',
            select: 'name pic email',
        });
        res.render("messages.ejs", { messages, currentUser: req.user });
    } catch (err) {
        throw new ExpressError(err.status, err.message);
    }
};

const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Some errors occurred' } = err;
    res.status(status).send(message);
};

module.exports = { errorHandler, getMessage, sendMessage };
