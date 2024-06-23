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
  status: {
    type: Number,
    default: 0,
    enum: [0, 1, 2], //0 pending, 1 open, 2 allocated, 3 cancelled
    required: true
  }
},{
  timestamps: true,
});

const DeliveryOrder = mongoose.model("DeliveryOrder", DeliveryOrderSchema);

export default DeliveryOrder;