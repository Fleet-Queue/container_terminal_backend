var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PartySchema = new Schema({
  partyName: {
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
    required: true
  }
},{
  timestamps: true,
});

const Party = mongoose.model("Party", PartySchema);

export default Party;