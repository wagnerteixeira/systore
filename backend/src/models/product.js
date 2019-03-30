const restful = require('../node_restful/restful');
const mongoose = restful.mongoose;
const Float = require('mongoose-float').loadType(mongoose);

const productSchema = new mongoose.Schema({
  type: { type: Number, required: [true, 'Informe o tipo do produto!'] },
  coast: { type: Float, required: [true, 'Informe o preço de custo!'] },
  daysOfValidity: { type: Number },
  Description: { type: String, required: true },
  Description2: { type: String },
  printPackingDate: { type: Boolean },
  extraInfo: { type: String },
  extraInfo2: { type: String },
  extraInfo3: { type: String }
});

module.exports = restful.model('Product', productSchema);
