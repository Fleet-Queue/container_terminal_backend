import mongoose from "mongoose";

const rateMappingSchema = mongoose.Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    truckCategory: {
      type: String,
      enum: ["DA", "Trailer", "MultiAxil"],
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