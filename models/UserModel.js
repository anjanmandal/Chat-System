const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,
        required:[true,'Please enter an email'],
        lowercase:true,
        validate:[validator.isEmail,'please enter valid email address'],
    },
    password:{type:String,required:true},
    confirmPassword:{
        type:String,
        required:[true,'please enter password'],
        validate:{
            validator:function(val){
                return val===this.password;
            },
            message:'password and confirm password doesnot match'
        }
    },
    pic:{
        type:String,
        required:true,
        default:"https://pixabay.com/vectors/person-individually-alone-icon-1824144/"
    },
},{
    timestamps:true
})
const User=mongoose.model('User,UserSchema');
module.exports=User;