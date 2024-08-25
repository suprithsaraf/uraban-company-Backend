const mongoose=require('mongoose')

const configureDb= async()=>{
     const db=await mongoose.connect('mongodb://127.0.0.1:27017/urban-company')
     try{
          console.log('successfully connected to db')
     }catch(err){
        console.log(err)
     }
}
module.exports=configureDb