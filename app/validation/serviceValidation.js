const service=require('../models/service-model')


const serviceValidationSchema={
    servicename:{
        exists:{
            errorMessage:"servicename field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    },
    description:{
        exists:{
            errorMessage:"description field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    },
    price:{
        exists:{
            errorMessage:"price field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true,
        custom:{
            options: async function(value,{req}){
             if(value <=0){
                throw new Error('price should be more than 0')
             }
             return true
            }
        }
    }
}

const adminUpdate={
    isverified:{
        exists:{
            errorMessage:"verified field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    }
}

module.exports={serviceValidationSchema,adminUpdate}