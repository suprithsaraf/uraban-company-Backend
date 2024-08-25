const User=require('../models/user-model')
const mongoose=require('mongoose')



const {Schema,model}=mongoose
const serviceProviderSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    profilePic: String,
    aadhaarPhoto: String,
    serviceProvidername: String,
    firstName: String, // Ensure these fields are included
    lastname:String,
    phone: Number,
    address: String,
    // Add any other fields you need
  }, { timestamps: true });
  
  
  

    
    const ServiceProvider=model("ServiceProvider",serviceProviderSchema)

module.exports=ServiceProvider