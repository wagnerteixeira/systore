const restful = require('../node_restful/restful');
const mongoose = restful.mongoose;

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  email: { type: String },
  password: { type: String, min: 6, max: 12, required: true }
});

module.exports = restful.model('User', userSchema);
