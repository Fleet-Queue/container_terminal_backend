var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Party = new Schema({
  partyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  trailerAccepted: {
    type: Array,
    required: true
  },
  fourtyFeetRate: {
    type: Number,
    required: true
  },
  twentyFeetRate: {
    type: Number,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true
  }
});