const mongoose=require('mongoose')

const{Schema,model}=mongoose


const serviceSchema=new Schema({
    servicename:{
        type:String,
        required:true
    },
    description:[" "],
    price:Number,
    serviceProvider:{
        type:Schema.Types.ObjectId,
        ref:"ServiceProvider"
    },
    isverified:{
        type:Boolean,
         default:false
    }
},{timestamps:true})

const Service=model("Service",serviceSchema)


module.exports=Service