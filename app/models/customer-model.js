const User=require('../models/user-model')
const mongoose=require('mongoose')

const {Schema,model}=mongoose

const CustomerSchema=new Schema({
           userId:{
            type:Schema.Types.ObjectId,
            ref:"User"
           },  
           profilePic: String,
           aadhaarPhoto: String,
           firstName:String,
           lastname:String,
           email:String,
           phone:Number,
           address:String
},{timeStamps:true})


const Customer= model('Customer',CustomerSchema)

module.exports=Customer