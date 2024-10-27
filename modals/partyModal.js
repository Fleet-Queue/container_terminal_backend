import mongoose from "mongoose";
var Schema = mongoose.Schema;
var PartySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  isTrailerAllowed: {
    type: Boolean,
    required: true
  },
  status: {
    type:Boolean,
    default:true,
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  allocatedUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  contactPerson: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
          return /^\d{10}$/.test(v); 
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  }
},{
  timestamps: true,
});

const Party = mongoose.model("Party", PartySchema);

export default Party;