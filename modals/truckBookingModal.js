var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var truckBookingSchema = new Schema({

  // truck: {
  //   type: Schema.Types.ObjectId,
  //   required: true
  // },
  truckNumber: {
    type: number,
    required: true
  },
  availableFrom: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'allocated', 'cancelled','live'],
    required: true
  }
},{
  timestamps: true,
});

const TruckBooking = mongoose.model("TruckBooking", truckBookingSchema);

export default TruckBooking;