const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,
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
        default:"https://pixabay.com/vectors/person-individually-alone-icon-1824144/"
    },
},{
    timestamps:true
})

 UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
 });
 UserSchema.methods.comparepassword=async function(pass,passindb){
    return await bcrypt.compare(pass,passindb);
 };

const User=mongoose.model('User',UserSchema);
module.exports=User;