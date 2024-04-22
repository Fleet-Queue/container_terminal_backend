import mongoose from "mongoose";
var Schema = mongoose.Schema;
var truckBookingSchema = new Schema({

  truck: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Truck",
  },
  // truckNumber: {
  //   type: number,
  //   required: true
  // },
  availableFrom: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    // required: true
  },
  cancellationReason: {
    type: String,
    validate: {
      validator: function(value) {
        // If status is 'cancelled', cancellationReason is required
        if (this.status === 'cancelled') {
          return !!value; // Return true if cancellationReason is provided
        }
        return true; // Return true for other statuses
      },
      message: 'Cancellation reason is required when status is "cancelled".'
    }
  },
  status: {
    type: String,
    default:'allocated',
    enum: ['open', 'allocated', 'cancelled','live'],
    required: true
  }
},{
  timestamps: true,
});

const TruckBooking = mongoose.model("TruckBooking", truckBookingSchema);

export default TruckBooking;