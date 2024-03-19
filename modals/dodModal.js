var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DOD = new Schema({
  party: {
    type: Schema.Types.ObjectId,
    required: true
  },
  truck: {
    type: Schema.Types.ObjectId,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  feet: {
    type: String,
    required: true
  },
  startingDate: {
    type: Date,
    required: true
  },
  endingDate: {
    type: Date,
    required: true
  },
  startingTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});