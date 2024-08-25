const ServiceProvider=require('../models/serviceProvider-model')
const {validationResult}=require('express-validator')

const serviceProviderCltr={}



serviceProviderCltr.createProfile = async (req, res) => {
    console.log('Request received at:', new Date());
    console.log('Request body:', JSON.stringify(req.body, null, 2)); // Log the body as a formatted JSON string

    if (req.files) {
        console.log('Uploaded files:', JSON.stringify(req.files, null, 2)); // Log the files as a formatted JSON string
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;

    try {
        const provider = new ServiceProvider(body);
        provider.userId = req.user.id;

        if (req.files) {
            if (req.files['aadhaarPhoto']) {
                provider.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
                console.log('Aadhaar Photo URL:', provider.aadhaarPhoto);
            }
            if (req.files['profilePic']) {
                provider.profilePic = req.files['profilePic'][0].path;
                console.log('Profile Pic URL:', provider.profilePic);
            }
        }

        console.log('Creating customer with:', JSON.stringify(provider, null, 2));

        await provider.save();
        res.json(provider);
    } catch (err) {
        console.error('Error saving customer:', err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
// serviceProviderCltr.createProfile = async (req, res) => {
//     console.log('Request received at:', new Date());
//     console.log('Request body:', JSON.stringify(req.body, null, 2));

//     if (req.files) {
//         console.log('Uploaded files:', JSON.stringify(req.files, null, 2));
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const body = req.body;

//     try {
//         const provider = new ServiceProvider(body);
//         provider.userId = req.user.id;

//         if (req.files) {
//             if (req.files['aadhaarPhoto']) {
//                 provider.aadhaarPhoto = req.files['aadhaarPhoto'][0].path; 
//                 console.log('Aadhaar Photo URL:', provider.aadhaarPhoto);
//             }
//             if (req.files['profilePic']) {
//                 provider.profilePic = req.files['profilePic'][0].path;
//                 console.log('Profile Pic URL:', provider.profilePic);
//             }
//         }

//         console.log('Creating provider with:', JSON.stringify(provider, null, 2));

//         await provider.save();
//         res.json(provider);
//     } catch (err) {
//         console.error('Error saving provider:', err.message);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };


// //get patientProfile
serviceProviderCltr.getProfile = async (req, res) => {
      try {
        const provider = await ServiceProvider.findOne({ userId: req.user.id });
        if (!provider) {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.json({ profile: provider });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  
  
  
// Update customer profile
serviceProviderCltr.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const userId = req.user.id;

    try {
        // Find the customer by userId
        let provider = await ServiceProvider.findOneAndUpdate({ userId });

        if (!provider) {
            return res.status(400).json({ msg: 'No Provider found' });
        }

        // Update customer fields
        provider.firstName = body.firstName;
        provider.address = body.address;
        provider.phone = body.phone;

        // Handle file updates
        if (req.files) {
            if (req.files.aadhaarPhoto) {
                console.log('Updating Aadhaar Photo:', req.files.aadhaarPhoto[0].path);
                provider.aadhaarPhoto = req.files.aadhaarPhoto[0].path;
            }


            if (req.files.profilePic) {
                console.log('Updating Profile Pic:', req.files.profilePic[0].path);
                provider.profilePic = req.files.profilePic[0].path;
            }
        }

        // Save the updated customer document
        await provider.save();
        res.json(provider); // Return the updated customer document
    } catch (err) {
        console.error('Error updating Provider:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};






serviceProviderCltr.allProviders=async (req,res)=>{
   try{
     const response =await ServiceProvider.find().populate('userId',['email'])
     res.status(201).json(response)
   }catch(err){
    
    res.status(500).json({ errors: 'something went wrong'})

   }
}

serviceProviderCltr.allserviceProviders=async(req,res)=>{
    try{
        const response=await ServiceProvider.find()
        res.status(201).json(response)

    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }

}
serviceProviderCltr.singleProvider = async (req, res) => {
    try {
        console.log('User ID:', req.user.id); // Debugging line

        const response = await ServiceProvider.findOne()
        
        if (!response) {
            console.log('No provider found for user ID:', req.user.id); // Debugging line
            return res.status(404).json({ errors: 'Provider not found' });
        }
        
        console.log('Provider found:', response); // Debugging line
        res.status(200).json(response);
    } catch (err) {
        console.log('Error occurred:', err); // Debugging line
        res.status(500).json({ errors: 'Something went wrong' });
    }
};



serviceProviderCltr.delete=async (req,res)=>{
    try{
        const providerId=req.params.id
        const response=await ServiceProvider.findOneAndDelete({userId:req.user.id,_id:providerId})
        if(!response){
           return  res.status(401).json({error:'record not found'})
        }
            res.status(200).json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

module.exports=serviceProviderCltr