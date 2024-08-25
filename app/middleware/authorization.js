const authorization=(permissions)=>{
   return (req,res,next)=>{
    if(permissions.includes(req.user.role)){
        next()
    }else{
        res.status(400).json({errors:"you dont have the permission to access"})
    }
   } 
  
}
module.exports=authorization