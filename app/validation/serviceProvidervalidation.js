const ServiceProvider = require("../models/serviceProvider-model")

const serviceProviderValidationSchema={
        userId:{
         custom:{
            options: async function (value,{req}){
                const serviceProvder=await ServiceProvider.findOne({ userId:req.user.id})
                if(serviceProvder){
                    throw new Error('profile is already taken')
                }
                return true
            }
         },
         trim:true
        } ,
       serviceProvidername:{
            exists:{
                errorsMessage:"name should be required"
            },
            notEmpty:{
                errorsMessage:"name should not be empty"
            },
            trim:true

        },
        description:{
            exists:{
                errorsMessage:'description should be required '
            },
            notEmpty:{
                errorsMessage:"description should not be empty"
            },
            trim:true

        } ,
        category:{
            exists:{
                errorsMessage:"category should be required"
            },
            notEmpty:{
                errorsMessage:"category should not be empty"
            },
            trim:true,
            custom:{
                options:function async(value){
                      if(!Array.isArray(value)){
                        throw new Error ('category should be provided')
                      }
                      if(value.length==0){
                        throw new Error('category should contain any one of the service')
                      }
                      return true
                }
            }

        } ,
        price:{
            exists:{
                errorsMessage:"price field should be required"
            },
            notEmpty:{
                errorsMessage:"price should not be empty"
            },
            trim:true

        },
        phone:{
            exists:{
                errorsMessage:"phone field should be required"
            },
            notEmpty:{
                errorsMessage:"phone should not be empty"
            },
            isLength:{
               options:{min:10,max:10},
               errorsMessage:"phone number should be in 10 digits"
            },
            custom:{
                options: async function(value){
                    const user=await ServiceProvider.findOne({phone:value})
                    if(user){
                        throw  new Error('phone number is already exists')
                    }
                    return true
                },
                trim:true


            },
            trim:true
       },
       address:{
        exists:{
            errorsMessage:"address field should be required"
        },
        notEmpty:{
            errorsMessage:'address should not be empty'
        }
    }


}
const serviceProviderUpdateValidation={
    serviceProviderName :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
    description :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
    category :{
        exists: {
            errorMessage: 'category is required'
        },
        notEmpty: {
            errorMessage: 'category cannot be blank'
        },isIn: {
            options: [['painting of walls and furniture','plumber','AC Repair and service,Bathroom and Kitchen cleaning','Salon for kids and men','Salon for women']],
            errorMessage: 'category should either be a painting of walls and furniture , plumber, AC Repair and service , Bathroom and Kitchen cleaning , Salon for kids and men , Salon for women'
        },
        trim:true,
    },
    price :{
        exists: {
            errorMessage: 'price is required'
        },
        notEmpty: {
            errorMessage: 'price cannot be blank'
        },
        trim:true
    },phone:{
        exists: {
            errorMessage: 'phone is required'            
        },
        notEmpty: {
            errorMessage: 'phone cannot be empty'
        },
        isLength: {
            options: {min: 10, max: 10},
            errorMessage: 'phone should be 10 numbers'
        },
        custom: {
            options: async function(value){
                const user = await ServiceProvider.findOne({ phone: value })
                if(user) {
                    throw new Error('phone no already taken')
                } else {
                    return true 
                }
            }
        },
        trim: true 
    },
    address:{
        exists: {
            errorMessage: 'address is required'            
        },
        notEmpty: {
            errorMessage: 'address cannot be empty'
        },
        trim:true
    }
   
    
}



module.exports={serviceProviderValidationSchema,serviceProviderUpdateValidation}
// user:{
//     type:Schema.Types.ObjectId,
//     ref:"User"
// },
// isVerified:Boolean,
// name:String,
// description:String,
// price:Number