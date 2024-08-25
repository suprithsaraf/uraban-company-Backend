const jwt=require('jsonwebtoken')
const authenticateUser=(req,res,next)=>{
        const token=req.headers['authorization']
        if(!token){
           return  res.status(404).json({errors:'token is required'})
        }
        try{
               const tokendata=jwt.verify(token,process.env.JWT_SECRET)
               req.user={
                id:tokendata.id,
                role:tokendata.role
               }
               next()
        }
        catch(err){
            res.status(400).json({errors:err})
        }
}
module.exports=authenticateUser