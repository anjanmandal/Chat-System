const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const Chat = require("./models/chatModel.js");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const User = require("./models/UserModel.js");
const userRouter = require("./routes/userRouter.js");
const chatRouter = require("./routes/chatRouter.js");
const messageRouter=require("./routes/messageRouter.js");

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/chatSystem')
  .then(() => console.log('Connected!'));

// Socket.IO setup
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Listen on the server instead of the app
server.listen(8080, () => {
    console.log("server is listening on port 8080");
});

app.use("/", (req, res, next) => {
    console.log("root is working....");
    next();
});

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages",messageRouter);
