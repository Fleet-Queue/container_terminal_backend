import mongoose from "mongoose";
var Schema = mongoose.Schema;
var allocationSchema = new Schema({
  DOBookingId: {
    type: Schema.Types.ObjectId,
    ref: "DOBooking",
  },
  truckBookingId: {
    type: Schema.Types.ObjectId,
    ref: "TruckBooking",
  },
  allocatedOn: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'allocated', 'cancelled'],
    required: true
  }
},{
  timestamps: true,
});

const Allocation = mongoose.model("Allocation", allocationSchema);

export default Allocation;