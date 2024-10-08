const Payment=require('../models/payment-model')
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const {pick}=require('lodash')
const Booking=require('../models/booking-model')
const paymentsCntrl={}

paymentsCntrl.pay = async(req,res)=>{
    // console.log(req.user.id,'id')
    // const errors = validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }
    const body = pick(req.body,['bookingId','amount'])
    try{

        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '403507',
                city: 'mapusa',
                state: 'Goa',
                country: 'US',
            },
        })
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:'booking'
                    },
                    unit_amount:body.amount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer : customer.id
        })
        
        //create a payment
        const payment = new Payment(body)
        payment.bookingId=body.bookingId
        payment.transactionId = session.id//on clik yo pay strip will create one id
        payment.amount = Number(body.amount)
        payment.paymentType = "card"
        payment.customer=req.user.id
        await payment.save()
        res.json({id:session.id,url: session.url,payment})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}  

paymentsCntrl.successUpdate = async (req, res) => {
    const id = req.params.id;
    try {
        // Update payment status
        const payment = await Payment.findOneAndUpdate(
            { transactionId: id },
            { $set: { paymentStatus: 'Successful' } },
            { new: true }
        );

        if (!payment) {
            console.error('Payment not found for transactionId:', id);
            return res.status(404).json({ errors: 'Payment not found' });
        }

        // Update the associated booking with payment details
        const bookingUpdateResult = await Booking.findOneAndUpdate(
            { _id: payment.bookingId },
            { $set: { payment: payment._id } },
            { new: true }
        );

        if (!bookingUpdateResult) {
            console.error('Booking not found for bookingId:', payment.bookingId);
            return res.status(404).json({ errors: 'Booking not found' });
        }

        res.json(payment);
    } catch (err) {
        console.error('Error updating payment to successful:', err);
        res.status(500).json({ errors: 'Internal Server Error' });
    }
};

paymentsCntrl.failerUpdate=async(req,res)=>{
    const id=req.params.id
    try{
        const payment=await Payment.findOneAndUpdate({transactionId:id},{$set:{paymentStatus:"failed"}},{new:true})
        res.status(200).json(payment)
    }catch(err){
        res.status(500).json({error:"internal server errror"})
    }
}
paymentsCntrl.list = async (req, res) => {
    try {
        // Fetch payments with customer details
        const response = await Payment.find()
            .sort({ createdAt: -1 })
            .populate('customer', 'username  email'); // Assuming 'customer' is a reference to the User model
        console.log(response)
        res.json(response);
    } catch (err) {
        console.log(err);
        res.status(501).json({ error: "Internal Server Error" });
    }
};

module.exports=paymentsCntrl