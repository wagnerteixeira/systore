const restful = require('node-restful')
const mongoose = restful.mongoose

const billsReceiveSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  code: { type: Number },
  quota: { type: Number },
  original_value: { type: mongoose.Decimal128 },
  interest: { type: mongoose.Decimal128 },
  final_value:  { type: mongoose.Decimal128 },
  purchase_date: { type: Date },
  due_date: { type: Date },
  pay_date: { type: Date },
  days_delay: { type: Number },
  situation: {
    type: String,
    enum: ['O', 'C'], //open, closed
  },
  vendor: { type: String}
})

module.exports = restful.model('BillsReceive', billsReceiveSchema)