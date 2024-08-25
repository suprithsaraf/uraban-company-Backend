
const Review=require('../models/review-model')
const ServiceProvider=require('../models/serviceProvider-model')
const { customerId } = require('../validation/reviewValidation')
const reviewcltr={}

 reviewcltr.create=async(req,res)=>{
    try{
      const body=req.body
      const serviceProviderId=req.params.providerId
      const review=new Review(body)
      review.customerId=req.user.id
      review.serviceProviderId=serviceProviderId
      await review.save()
      const update = await ServiceProvider.findByIdAndUpdate( serviceProviderId , { $push: { review: review._id } }, { new: true });
      if (!update) {
          return res.status(404).json({ error: 'provider not found' });
      }
      res.json(review) 
      }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
 }

 reviewcltr.update=async(req,res)=>{
    try{
       const review=req.params.reviewId
       const serviceProviderId=req.params.providerId
       const body=req.body
       const update=await Review.findByIdAndUpdate({customerId:req.user.id,_id:review,serviceProviderId:serviceProviderId},body,{new:true})
       if(!update){
         return res.status(400).json({error:'Record not Found'})
       }
       res.status(200).json(update)
       
    }catch(err){
      res.status(500).json({error:'Somthing went wrong'})
    }
 }

 reviewcltr.single=async(req,res)=>{
   try{
     const providerId=req.params.providerId
     const reviewId=req.params.reviewId
     const review=await Review.findOne({_id:reviewId,serviceProviderId:providerId})
     if(!review){
      return res.status(400).json({error:"Record Not Found"})
     }
     res.status(200).json(review)
   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})

   }
 }

 
 reviewcltr.particularProvider=async(req,res)=>{
   try{
     const providerId=req.params.providerId
     const review=await Review.find({serviceProviderId:providerId})
     if(!review){
      return res.status(400).json({error:"Record Not Found"})
     }
     res.status(200).json(review)
   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})

   }
 }

 reviewcltr.all=async(req,res)=>{
   try{
     const review=await Review.find()
     if(!review){
      return res.status(400).json({error:"Record Not Found"})
     }
     res.status(200).json(review)
   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})

   }
 }

 reviewcltr.delete=async(req,res)=>{
   try{
      const reviewId=req.params.reviewId
      const serviceProviderId=req.params.providerId
      const review=await Review.findByIdAndDelete({customerId:req.user.id,_id:reviewId,serviceProviderId:serviceProviderId},{new:true})
      if(!review){
         return res.status(404).json({errors:'record not found'})
     }
     await ServiceProvider.findByIdAndUpdate(serviceProviderId, { $pull: { review: reviewId } });
     res.status(200).json({msg:'Deleted successfully'})

   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})
   }
 }
module.exports=reviewcltr
