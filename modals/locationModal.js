var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var location = new Schema({
  name: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  }
});