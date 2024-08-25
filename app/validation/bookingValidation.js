const Booking=require('../models/booking-model')


const BookingValidationSchema={
    date:{
        exists:{
            errorMessage:"date should be required"
        },
        notEmpty:{
            errorMessage:"date should not be empty"
        },
        isDate:{
            errorMessage:'date should be valid' 
        },
        trim:true,
        custom:{
            options: async function(value){
                if(new Date(value) <= new Date()){
                    throw new Error('date should be greater than todays ')
                }
                return true
            }
        }
    },
    description:{
        exists:{
            errorMessage:"field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    }
}

const BookingUpdateSchema={
     
    date:{
        exists:{
            errorMessage:"date should be required"
        },
        notEmpty:{
            errorMessage:"date should not be empty"
        },
        isDate:{
            errorMessage:'date should be valid'
        },
        trim:true,
        custom:{
            options: async function(value){
                const input = new Date(value).setHours(0, 0, 0, 0);
                const today = new Date().setHours(0, 0, 0, 0);
                if(input <= today){
                    throw new Error('date should be greater than todays ')
                }
                return true
            }
        }
    },
    description:{
        exists:{
            errorMessage:"field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    }
}
const AcceptedbyAdmin={
    isAccepted:{
           exists:{
            errorMessage:"field should be required"
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true
    }
}


const BookingupdatedbyAdmin={
    status:{
        exists:{
            errorsMessage:"field should be required"
        },
        notEmpty:{
            errorsMessage:"field should not be empty"
        },
        trim:true,
        isIn:{
    options:[['pending','completed','comfirmed','canceled']],
     errorsMessage:"payment status should be either pending,compeleted,comfirmed or canceled"
        }
    },
    payment:{
        exists:{
            errorMessage:"field should be required" 
        },
        notEmpty:{
            errorMessage:"field should not be empty"
        },
        trim:true,
        isIn:{
    options:[['pending','completed']],
     errorsMessage:"payment  should be either pending,compeleted"
        }
    }
}

module.exports={BookingValidationSchema,BookingUpdateSchema,AcceptedbyAdmin,BookingupdatedbyAdmin}