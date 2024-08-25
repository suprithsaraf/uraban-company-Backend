    const Booking = require('../models/booking-model');
    const Payment = require('../models/payment-model');
    const { validationResult } = require('express-validator');
    const Customer=require ('../models/customer-model')
    const sendEmail=require('../utils/sendemail')
    const bookingCltr = {};

    bookingCltr.create = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        try {
            const serviceId = req.params.serviceId;
            const bookingData = req.body;
            const booking = new Booking(bookingData);
            booking.customerId = req.user.id;
            booking.serviceProviderId = serviceId;

            await booking.save();
            console.log(booking);
            res.status(201).json(booking);
        } catch (err) {
            console.log('Error creating booking:', err);
            res.status(500).json({ errors: 'Something went wrong' });
        }
    };

    bookingCltr.allBookings = async (req, res) => {
    const { page = 1, limit = 3 } = req.query;

    try {
        const bookings = await Booking.find()
        .populate('customerId', ['username', 'email'])
        .populate('serviceProviderId', 'servicename') // Ensure this field is populated
        .populate({
            path: 'payment',
            select: 'status type'
        })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    
        const total = await Booking.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const bookingsWithPaymentStatus = bookings.map(booking => ({
            ...booking.toObject(),
            paymentStatus: booking.payment ? booking.payment.status : 'unknown',
            paymentType: booking.payment ? booking.payment.type : 'N/A'
        }));

        res.status(200).json({ bookings: bookingsWithPaymentStatus, totalPages, currentPage: Number(page) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
    };


    bookingCltr.single = async (req, res) => {
        try {
            const id = req.params.bookingId;
            const response = await Booking.findById(id)
                .populate('customerId', ['name', 'phone', 'address'])
                .populate('serviceProviderId', ['price', 'description']);
            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ errors: 'Something went wrong' });
        }
    };

    bookingCltr.update = async (req, res) => {
        try {
            const { serviceId, bookingId } = req.params;
            const { isAccepted, status } = req.body;
    
            // Find and update the booking
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { isAccepted, status },
                { new: true }
            ).populate('customerId', 'email').populate('serviceProviderId', 'servicename')
    
            if (updatedBooking) {
                const customerEmail = updatedBooking.customerId?.email;
                const servicename = updatedBooking.serviceProviderId?.servicename || 'Service'; // Fetch servicename, fallback to 'Service'

    
                if (!customerEmail) {
                    console.error('Customer email is missing');
                    return res.status(400).json({ message: 'Customer email is missing' });
                }
    
                const subject = isAccepted ? 'Urban Company' : 'Booking Rejected';
                const text = isAccepted
                ? `Good news! Your booking for ${servicename} with Urban Company has been accepted. Our service provider will contact you soon.
 Best regards,
 Urban Company `
                    : `Your booking with ID ${bookingId} has been rejected.`;
    
                try {
                    await sendEmail(customerEmail, subject, text);
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    return res.status(500).json({ message: 'Failed to send email' });
                }
    
                res.status(200).json(updatedBooking);
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating booking' });
        }
    };
    

    bookingCltr.updateByAdmin = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body;
            const id = req.params.bookingId;
            const response = await Booking.findByIdAndUpdate(id, body, { new: true });
            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ errors: 'Something went wrong' });
        }
    };

    bookingCltr.accepted = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { serviceId, bookingId } = req.params;
        console.log('Service ID:', serviceId);
        console.log('Booking ID:', bookingId);

        if (!serviceId || !bookingId) {
            return res.status(400).json({ errors: 'Service ID or Booking ID is missing' });
        }

        const body = req.body;

        try {
            const allowedUpdates = {
                isAccepted: body.isAccepted,
                status: body.status,
            };

            const response = await Booking.findByIdAndUpdate(
                { serviceProviderId: serviceId, _id: bookingId },
                allowedUpdates,
                { new: true }
            );

            if (!response) {
                return res.status(404).json({ errors: 'Record not found' });
            }

            return res.status(200).json(response);
        } catch (err) {
            console.error('Error updating booking:', err);
            return res.status(500).json({ errors: 'Something went wrong' });
        }
    };

    bookingCltr.delete = async (req, res) => {
        const bookingId = req.params.bookingId;
        try {
            // Find the booking first to get customer details
            const booking = await Booking.findById({ _id: bookingId, customerId: req.user.id }).populate('customerId', 'email').populate('serviceProviderId', 'servicename')
    
            
            if (!booking) {
                return res.status(400).json({ errors: 'Record not found' });
            }
    
            const customerEmail = booking.customerId?.email;
            const serviceName = booking.serviceProviderId?.servicename || 'Service'; // You can adjust this field based on your data model
    
            // Delete the booking
            const response = await Booking.findByIdAndDelete(bookingId);
    
            if (response) {
                // Send the rejection email
                const subject = 'Urban Company';
                const text = `We regret to inform you that your booking for ${serviceName} with ID ${bookingId} has been rejected.We apologize for the inconvenience and appreciate your understanding,
                The amount ${price} will be Refunded Back to your Account.Thank You Booking
        Best regards,
        Urban Company `;
    
                try {
                    await sendEmail(customerEmail, subject, text);
                    console.log('Rejection email sent successfully');
                } catch (emailError) {
                    console.error('Error sending rejection email:', emailError);
                    return res.status(500).json({ errors: 'Failed to send rejection email, but booking was deleted' });
                }
    
                return res.status(200).json(response);
            }
    
            res.status(400).json({ errors: 'Record not found' });
        } catch (err) {
            console.error('Error during booking deletion:', err);
            res.status(500).json({ errors: 'Something went wrong' });
        }
    };

    bookingCltr.CustomerHistory = async (req, res) => {
        const {customerId }= req.params;
        console.log('Customer ID:', customerId);  // Debug log
    
        try {
            const bookings = await Booking.find({ customerId: customerId })  // Note: Ensure field name matches
                .populate('serviceProviderId', 'servicename')
                .populate('payment');
    
            if (!bookings) {
                return res.status(404).json({ message: 'No bookings found for this customer.' });
            }
    
            res.json({ bookings });
        } catch (error) {
            console.error('Error fetching customer history:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
    
    

    module.exports = bookingCltr;
