import mongoose from "mongoose";

var Schema = mongoose.Schema;
var locationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  kilometer: {
    type: Number,
    required: true
  },
  isHighRangeArea:{
    type: Boolean,
    required: true
  },
  tripType:{
    type: String,
    enum: ["medium", "local", "long","nationalPermit"],
  }
}, {
  timestamps: true,
});


const Location = mongoose.model("Location", locationSchema);

export default Location;