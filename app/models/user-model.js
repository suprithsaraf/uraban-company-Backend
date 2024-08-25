const mongoose=require('mongoose')
const {Schema,model}=mongoose
const userSchema=new Schema({
    username:String,
    email:{
        type:String,
        required:true
    },
    password:String,
    role:String,
    resetPasswordToken:String,
    resetPasswordExpires:String,
    isVerified:{
        type:Boolean,
        default:false
    },
    isRejected:{
        type:Boolean,
        default:false
    }
    

},{timestamps:true})

const User=model('User',userSchema)

module.exports=User