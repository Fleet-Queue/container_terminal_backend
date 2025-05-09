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
    },
    isActive: {
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
    // status: {
    //   type: String,
    //   default:"inqueue",
    //   enum: ["inqueue", "allocated", "ongoing", "offline"],
    // },
  },
  {
    timestamps: true,
  }
);

const Truck = mongoose.model("Truck", truckSchema);

export default Truck;

