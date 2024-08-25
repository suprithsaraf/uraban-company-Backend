require('dotenv').config()


const configureDb=require('./config/db')

const userCltr=require('./app/controllers/userCltr')
const serviceProviderCltr=require('./app/controllers/serviceProviderCltr')
const customerCltr=require('./app/controllers/customerCltr')
const bookingCltr=require('./app/controllers/BookingCltr')
const serviceCltr=require('./app/controllers/serviceCltr')
const reviewcltr=require('./app/controllers/reviewCltr')
const paymentsCntrl = require('./app/controllers/PaymentCltr')


const authenticateUser=require('./app/middleware/authentication')
const authorization=require('./app/middleware/authorization')


const {userRegisterValidationSchema,userUpdateValidation}=require('./app/validation/userRegistervalidation')
const userLoginValidationSchema=require('./app/validation/user-loginvalidation')
const {otpValidationSchema,forgotEmailValidationSchema}=require('./app/validation/forgetPassword')
const {serviceProviderValidation,serviceProviderUpdateValidation}=require('./app/validation/serviceProvidervalidation')
const {customerValidation,customerUpdateValidation}=require('./app/validation/customerValidation')
const {BookingValidationSchema,BookingUpdateSchema,BookingupdatedbyAdmin,AcceptedbyAdmin}=require('./app/validation/bookingValidation')
const reviewValidation=require('./app/validation/reviewValidation')
const {serviceValidationSchema,adminUpdate}=require('./app/validation/serviceValidation')

const upload=require('./app/middleware/multer')
const express=require('express')
const cors=require('cors')
const {checkSchema}=require('express-validator')
const path=require('path')
const app=express()
const port=3017
app.use(express.json())
app.use(cors())
configureDb()


// In your routes file



app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'uploads' directory

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    // Ensure CORS headers allow the specified origin and credentials
    setHeaders: (res, path, stat) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.set('Access-Control-Allow-Credentials', 'true');
    },
  }));




app.post('/provider/profile', 
  authenticateUser, 
  authorization(['serviceprovider']), 
  (req, res, next) => {
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      next();
  },
  upload.fields([
      { name: 'aadhaarPhoto', maxCount: 1 },
      { name: 'profilePic', maxCount: 1 }
  ]),  
  serviceProviderCltr.createProfile
);
app.get('/profile/allserviceprovider', 
  authenticateUser, 
  authorization(['serviceprovider']), 
  serviceProviderCltr.getProfile
);


app.post('/customer/post', 
  authenticateUser, 
  authorization(['customer']), 
  (req, res, next) => {
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      next();
  },
  upload.fields([
      { name: 'aadhaarPhoto', maxCount: 1 },
      { name: 'profilePic', maxCount: 1 }
  ]),  
  customerCltr.createProfile
);

app.get('/get/customer',
  authenticateUser,
  authorization(['customer']),
  customerCltr.getProfile
);




//User
app.post('/users/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/users/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.put('/users/update',authenticateUser,checkSchema(userUpdateValidation),userCltr.update)
app.get('/users/account',authenticateUser,userCltr.account)
app.get('/users/all',userCltr.all)
app.get('/users/checkemail',userCltr.checkEmail)
app.get('/users/admin',userCltr.checkAdmin)
app.post('/users/forgot-password',checkSchema(forgotEmailValidationSchema),userCltr.forgotPassword)
app.post('/users/reset-password',checkSchema(otpValidationSchema),userCltr.resetPassword)


//Customer
app.delete('/customer/:customerId',authenticateUser,authorization(['customer']), customerCltr.delete)
app.get('/customer/all',customerCltr.allCustomers)
app.get('/customer',authenticateUser,authorization(['customer']),customerCltr.singleCustomer)
app.post('/customer/profile', authenticateUser, authorization(['customer']), upload.single('profilePic'),checkSchema(customerValidation),customerCltr.createProfile)
app.put('/customer/update', authenticateUser, authorization(['customer']),  upload.single('profilePic'),customerCltr.updateProfile)
// app.get('/customer/post', customerCltr.getProfile);
app.get('/get/customer',authenticateUser,authorization(["customer"]), customerCltr.getProfile)
app.put('/')


app.get('/unverified-providers', authenticateUser, authorization(['admin']), userCltr.unverified)
app.post('/verify-providers', authenticateUser, authorization(['admin']), userCltr.verified)
app.post('/reject-providers', authenticateUser, authorization(['admin']), userCltr.reject)
app.get('/verifiedproviders', authenticateUser, authorization(['admin']), userCltr.verifiedProviders)

//ServiceProvider
app.post('/provider/profile', authenticateUser, authorization(['serviceprovider']), upload.fields([{ name: 'aadhaarPhoto', maxCount: 1 },
{ name: 'profilePic', maxCount: 1 }]),  serviceProviderCltr.createProfile)
app.put('/provider/Updateprofile', authenticateUser, authorization(['serviceprovider']),  upload.fields([ { name: 'aadhaarPhoto', maxCount: 1 },{ name: 'profilePic', maxCount: 1 }]),serviceProviderCltr.updateProfile)
app.get('/provider/all',serviceProviderCltr.allProviders)
app.get('/provider/allserviceprovider',serviceProviderCltr.allserviceProviders)
app.get('/provider/get', authenticateUser, authorization(['serviceprovider', 'admin']), serviceProviderCltr.singleProvider);
app.delete('/provider/:id',authenticateUser,authorization(['serviceprovider']),serviceProviderCltr.delete)


// //Service
app.post("/service",authenticateUser,authorization(['serviceprovider']),checkSchema(serviceValidationSchema),serviceCltr.create)
app.put('/service/:serviceId',authenticateUser,authorization(['serviceprovider']),checkSchema(serviceValidationSchema),serviceCltr.update)
app.get('/service/:serviceId',authenticateUser,serviceCltr.single)
app.get('/service',authenticateUser,serviceCltr.all)
app.delete('/service/:id',authenticateUser,authorization(['serviceprovider']),serviceCltr.delete)





//Booking


app.post('/booking/:serviceId',authenticateUser,authorization(['customer','serviceprovider']),checkSchema(BookingValidationSchema),bookingCltr.create)
app.get('/booking',authenticateUser,authorization(['admin','customer','serviceprovider']),bookingCltr.allBookings)
app.get('/booking/:bookingId',authenticateUser,authorization(['admin','customer']),bookingCltr.single)
app.put('/booking/provider/:serviceId/booking/:bookingId', bookingCltr.update);

app.put('/booking/admin/:bookingId',authenticateUser,authorization(['admin']),checkSchema(BookingupdatedbyAdmin),bookingCltr.updateByAdmin)
app.get('/payment/status/:bookingId', authenticateUser, authorization(['serviceprovider', "admin"]), checkSchema(AcceptedbyAdmin), bookingCltr.accepted);

app.delete('/booking/:bookingId',authenticateUser,authorization(['customer','serviceprovider']),bookingCltr.delete)
// app.get('/customer-history/:customerId/history',authenticateUser,authorization(["customer"]),bookingCltr.CustomerHistory)
app.get('/customer-history/:customerId/history', bookingCltr.CustomerHistory);



// // //Review
// app.post('/review/provider/:providerId',authenticateUser,authorization(['customer']),checkSchema(reviewValidation),reviewcltr.create)
// app.put('/review/provider/:providerId/review/:reviewId',authenticateUser,authorization(['customer']),checkSchema(reviewValidation),reviewcltr.update)
// app.get('/review/provider/:providerId/review/:reviewId',authenticateUser,authorization(['customer','admin']),reviewcltr.single)
// app.get('/review/provider/:providerId',authenticateUser,authorization(['customer','admin']),reviewcltr.particularProvider)
// app.get('/review', reviewcltr.all)
// app.delete('/review/provider/:providerId/review/:reviewId',authenticateUser,authorization(['customer',]),reviewcltr.delete)


app.post('/api/create-checkout-session',authenticateUser,paymentsCntrl.pay)
app.put('/api/payment/status/update/:id' , paymentsCntrl.successUpdate)
app.put('/api/payment/failer/:id',paymentsCntrl.failerUpdate)
app.get('/api/payment/list',authenticateUser,authorization(["customer","admin"]),paymentsCntrl.list)


app.listen(port,()=>{
    console.log('server running on 3017')
})