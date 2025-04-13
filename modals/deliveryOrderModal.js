import mongoose from "mongoose";
var Schema = mongoose.Schema;
var DeliveryOrderSchema = new Schema({
 
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  doLink: {
   required: true,
    type: String
  },
  name:{
    required:true,
    type:String
  },
  location:{
    required:true,
    type:String
  },
  fileName:{
    required:true,
    type:String
  },
  uniqueName:{
    required:true,
    type:String
  },
  cancelReason: { type: String},
  doNumber: {
    type: String, // Add the DO number field
    required: true,
    unique: true  // Ensure it's unique
  },
  availableFrom: {
    default: Date.now, 
    type: Date,
  },
  type:{
    type:Number
  },
  status: {
    type: Number,
    default: 0,
    enum: [0, 1, 2, 3, 4, 5, 6], //0 open, 1 inqueue, 2 allocated, 3 ongoing, 4 - completed, 5 - rejected, 6 - cancelled
    required: true
  }
},{
  timestamps: true,
});

const 

DeliveryOrder = mongoose.model("DeliveryOrder", DeliveryOrderSchema);

export default DeliveryOrder;