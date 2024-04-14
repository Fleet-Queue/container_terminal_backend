import mongoose from "mongoose";
const { Schema } = mongoose; // Import the Schema object from mongoose

const truckSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    active: {
      type: Boolean,
      default:1
    },
    category: {
      type: String,
      enum: ["Trailer", "DA", "MULTIAXIL"],
    },
    truckType: {
      type: Number,
      enum: [20, 40],
    },
    status: {
      type: String,
      default:"inqueue",
      enum: ["inqueue", "allocated", "ongoing", "offline"],
    },
  },
  {
    timestamps: true,
  }
);

const Truck = mongoose.model("Truck", truckSchema);

export default Truck;

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var trucks = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   owner: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   registrationNumber: {
//     type: String,
//     required: true
//   },
//   feet: {
//     type: String,
//     required: true
//   },
//   permits: {
//     type: Array,
//     required: true
//   },
//   status: {
//     type: String,
//     required: true,
//     queue,
//     allocation,
//     onGoing,
//     offline
//   }
// });
