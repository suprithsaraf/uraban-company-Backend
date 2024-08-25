const User = require('../models/user-model')
const userRegisterValidationSchema = {
    username: {
        exists: {
            errorMessage: 'username is required'            
        },
        notEmpty: {
            errorMessage: 'username cannot be empty'
        },
        trim: true 
    },
    email: {
        exists: {
            errorMessage: 'email is required'            
        },
        notEmpty: {
            errorMessage: 'email cannot be empty'
        },
        isEmail: {
            errorMessage: 'email should be a valid format'
        }, 
        custom: {
            options: async function(value){
                const user = await User.findOne({ email: value })
                if(user) {
                    throw new Error('email already taken')
                } else {
                    return true 
                }
            }
        },
        trim: true,
        normalizeEmail: true 
    },
    password: {
        exists: {
            errorMessage: 'password is required'            
        },
        notEmpty: {
            errorMessage: 'password cannot be empty'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password should be between 8 - 128 characters'
        },
        trim: true 
    },
    role: {
        exists: {
            errorMessage: 'role is required'            
        },
        notEmpty: {
            errorMessage: 'role cannot be empty'
        },
        // isIn: {
        //     options: [['admin', 'customer','serviceprovider']],
        //     errorMessage: 'role should either be a admin,customer or service provider'
        // }, 
        custom:{
            options: async function(value){
              if(value ==='admin'){
                const user=await User.find()
                const result=user.some((ele)=>{
                 return ele.role == value
             })
             if(result){
                 throw new Error('you cannot register as adim')
             }else{
                 return true
             }
            }
            } 
         },
        trim: true 
    }
    
    
}

const userUpdateValidation={
    username: {
        exists: {
            errorMessage: 'username is required'            
        },
        notEmpty: {
            errorMessage: 'username cannot be empty'
        },
        trim: true 
    },
    email: {
        exists: {
            errorMessage: 'email is required'            
        },
        notEmpty: {
            errorMessage: 'email cannot be empty'
        },
        isEmail: {
            errorMessage: 'email should be a valid format'
        },  
       
        trim: true,
        normalizeEmail: true 
    },
    password: {
        exists: {
            errorMessage: 'password is required'            
        },
        notEmpty: {
            errorMessage: 'password cannot be empty'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password should be between 8 - 128 characters'
        },
        trim: true 
    },
    role: {
        exists: {
            errorMessage: 'role is required'            
        },
        notEmpty: {
            errorMessage: 'role cannot be empty'
        },
        // isIn: {
        //     options: [['admin', 'customer','serviceprovider']],
        //     errorMessage: 'role should either be a admin,customer or service provider'
        // }, 
        trim: true 
    } 
    
    
}

module.exports = {userRegisterValidationSchema,userUpdateValidation}