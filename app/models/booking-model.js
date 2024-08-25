// models/Booking.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: "Service"  // Correct model name   
  },
  date: Date,
  status: {
    type: String,
    default: "pending"//
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  description: String,
  isAccepted: {
    type: Boolean,
    default: false  // Correct default value type
  },
  price: String
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
