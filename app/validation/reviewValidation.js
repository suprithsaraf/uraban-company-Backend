const Review=require('../models/review-model')
const reviewValidation={
    customerId:{
     custom:{
        options:async function(value,{req}){
            const provider=await Review.findOne({customerId:req.user.id})
            if(provider){
                throw new Error('You Have Already Shared your Review')
            }else{
                return true
            }
        }
     }
    },
    comment:{
        in:['body'],
        exists:{
            errorMessage:'comment is required'
        },
        notEmpty:{
            errorMessage:'comment cannot be empty'
        },
        trim:true
    },
    rating:{
        exists:{
            errorMessage:'comment is required'
        },
        notEmpty:{
            errorMessage:'comment cannot be empty'
        },
        trim:true,
        custom:{
            options:async function(value){
                if(value < 0 && value > 6){
                    throw new Error('rating should be greaterthen 0 and less then 5')
                }else {
                     return true 
                }
            }
        }
    }
}
module.exports=reviewValidation