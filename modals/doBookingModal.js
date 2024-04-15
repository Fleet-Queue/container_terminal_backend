import mongoose from "mongoose";
var Schema = mongoose.Schema;
var DOBookingSchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  partyId: {
    type: Schema.Types.ObjectId,
    ref: "Party",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  truckType: {
    type: Number,
    enum: [20, 40],
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
    enum: ['open', 'allocated', 'cancelled'],
    required: true
  }
},{
  timestamps: true,
});

const DOBooking = mongoose.model("DOBooking", DOBookingSchema);

export default DOBooking;