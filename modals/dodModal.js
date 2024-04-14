import mongoose from "mongoose";
var Schema = mongoose.Schema;
var DOBookingSchema = new Schema({
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
  // truck: {
  //   type: Schema.Types.ObjectId,
  //   required: true
  // },
  rate: {
    type: number,
    required: true
  },
  availableFrom: {
    type: Date,
    required: true
  },
  // endingDate: {
  //   type: Date,
  //   required: true
  // },
  // startingTime: {
  //   type: Date,
  //   required: true
  // },
  status: {
    type: String,
    enum: ['open', 'allocated', 'cancelled'],
    required: true
  }
},{
  timestamps: true,
});

const DOBooking = mongoose.model("DOBooking", DOBookingSchema);

export default DOBooking;