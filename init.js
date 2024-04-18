const Chat = require("./models/chat.js")
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/chatSystem')
  .then(() => console.log('Connected!'));

Chat.insertMany([
    {
        from: "Maya",
        to: "Sam",
        message: "Hi Sam, what's new with you?",
        created_at:new Date()
    },
    {
        from: "Lara",
        to: "Tony",
        message: "Good morning Tony, did you finish the project?",
        created_at:new Date()
    },
    {
        from: "Jack",
        to: "Olivia",
        message: "Olivia, are you free this weekend?",
        created_at:new Date()
    },{
        
            from: "Nina",
            to: "Kyle",
            message: "Hey Kyle, have you seen my email about tomorrow's meeting?",
            created_at:new Date()
        },
        {
    
                from: "Erik",
                to: "Jenna",
                message: "Jenna, can you help me with the math homework?",
                created_at:new Date()
             
        }
]);