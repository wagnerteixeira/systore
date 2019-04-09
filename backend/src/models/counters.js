const restful = require('../node_restful/restful');
const mongoose = restful.mongoose;

var counterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
