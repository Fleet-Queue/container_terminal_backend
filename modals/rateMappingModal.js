import mongoose from "mongoose";
var Schema = mongoose.Schema;
const rateMappingSchema = mongoose.Schema(
  {
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },
    truckCategory: {
      type: String,
      enum: ["Trailer", "DA", "MULTIAXIL"],
    },
    truckType: {
      type: Number,
      enum: [20, 40],
    },
    rate: {
      type:  Number,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const RateMapping = mongoose.model("RateMapping", rateMappingSchema);

export default RateMapping;