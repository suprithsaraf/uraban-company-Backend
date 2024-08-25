const Customer=require('../models/customer-model')
const {validationResult}=require('express-validator')
const customerCltr={}

customerCltr.createProfile = async (req, res) => {
  console.log('Request received at:', new Date());
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  if (req.files) {
      console.log('Uploaded files:', JSON.stringify(req.files, null, 2));
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;

  try {
      const customer = new Customer(body);
      customer.userId = req.user.id;

      // Handle profilePic and aadhaarPhoto
      if (req.files['profilePic']) {
          customer.profilePic = req.files['profilePic'][0].path;
          console.log('Profile Pic URL:', customer.profilePic);
      }

      if (req.files['aadhaarPhoto']) {
          customer.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
          console.log('Aadhaar Photo URL:', customer.aadhaarPhoto);
      }

      console.log('Creating customer with:', JSON.stringify(customer, null, 2));
      await customer.save();
      res.json(customer);
  } catch (err) {
      console.error('Error saving customer:', err.message);
      res.status(500).json({ errors: 'Something went wrong' });
  }
};

customerCltr.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  const userId = req.user.id;

  try {
    let customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ msg: 'No customer found' });
    }

    customer.firstName = body.firstName || customer.firstName;
    customer.phone = body.phone || customer.phone;
    customer.address = body.address || customer.address;

    if (req.file) {
      customer.profilePic = req.file.path;
    }

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error('Error updating customer:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



customerCltr.allCustomers=async(req,res)=>{
   try{ 
     const customers=await Customer.find().populate('userId',['email'])
    if(!customers){
        return res.json({errors:'No records found'})
    }
    res.status(200).json(customers)
  }catch(err){
    res.status(500).json({errors:'somthing went wrong'})

  }
}

customerCltr.singleCustomer=async(req,res)=>{
    try{ 
        
        const customers=await Customer.findOne({userId:req.user.id}).populate('userId',['email'])
     if(!customers){
         return res.json({error:'No records found'})
     }
     res.status(200).json(customers)
   }catch(err){
     res.status(500).json({error:'somthing went wrong'})
   }
 }

 customerCltr.delete=async(req,res)=>{
    try{
        const id=req.params.customerId
        const customer=await Customer.findOneAndDelete({userId:req.user.id,_id:id})
        if(!customer){
           return res.json({error:'Record not found'})
        }
        res.status(200).json(customer)

    }catch(err){
        res.status(500).json({error:'somthing went wrong'})

    }
 }

 customerCltr.getProfile = async (req, res) => {
  try {
    console.log('Request user:', req.user); // Log the entire user object

    const customerId = req.user.id; // Check if this is populated
    console.log('Customer ID:', customerId);

    if (!customerId) {
      return res.status(400).json({ message: 'Invalid request: Customer ID missing' });
    }

    const customer = await Customer.findOne({ userId: customerId });
    console.log('Customer:', customer); // This should log the customer object if found
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ profile: customer });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = customerCltr