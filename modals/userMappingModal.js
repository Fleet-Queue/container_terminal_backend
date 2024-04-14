var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userMappingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // RefId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "TruckBooking",
  // },
  refType: {
    type: String,
    required: true
  }
},{
  timestamps: true,
});

const UserMapping = mongoose.model("UserMapping", userMappingSchema);

export default UserMapping;