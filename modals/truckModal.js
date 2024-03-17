import mongoose from "mongoose";

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
    phone: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    state: {
      type: String,
      required: true,
    },
    feet: {
      type: Number,
      enum: [20, 40],
    },
    status: {
      type: String,
      enum: ["inqueue", "allocated", "ongoing", "offline"],
    },
  },
  {
    timestamps: true,
  }
);



const Truck = mongoose.model("Truck", truckSchema);

export default Truck;
