const mongoose=require('mongoose')
const {Schema,model}=mongoose
const reviewSchema=new Schema({
  rating:Number,
  comment:String,
  customerId:{
     type:Schema.Types.ObjectId,
     ref:'User'
  },
  serviceProviderId:{
     type:Schema.Types.ObjectId,
     ref:'ServiceProvider'
  }
},{timestamps:true})

const Review=model('Review',reviewSchema)

module.exports=Review
