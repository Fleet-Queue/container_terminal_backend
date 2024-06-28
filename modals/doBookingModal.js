import mongoose from "mongoose";
var Schema = mongoose.Schema;
var DOBookingSchema = new Schema({
  partyId: {
    type: Schema.Types.ObjectId,
    ref: "Party",
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  deliveryOrderId:{
    type: Schema.Types.ObjectId,
    ref: "DeliveryOrder",
    required: true
  },
  truckType: {
    type: Number,
    enum: [20, 40],
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  availableFrom: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'allocated', 'cancelled','expired'],
    required: true
  }
},{
  timestamps: true,
});

const DOBooking = mongoose.model("DOBooking", DOBookingSchema);

export default DOBooking;