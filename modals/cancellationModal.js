import mongoose from "mongoose";
var Schema = mongoose.Schema;
var cancellationSchema = new Schema({
  // cancelledBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  reason: {
    type: String,
    required: true
  },
  cancelledOn: {
    type: Date,
    required: true
  },
  //  refId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  cancellationFrom: {
    type: String,
    required: true,
    enum:['allocation','truckBooking']
  },
},{
  timestamps: true,
});

const Cancellation = mongoose.model("Cancellation", cancellationSchema);

export default Cancellation;