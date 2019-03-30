const restful = require('../node_restful/restful');
const mongoose = restful.mongoose;

const billsReceiveSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }, //Cliente
  code: { type: Number }, //Código
  quota: { type: Number }, //Parcela
  original_value: { type: mongoose.Decimal128 }, //Valor original
  interest: { type: mongoose.Decimal128 }, // juros
  final_value: { type: mongoose.Decimal128 }, //Valor pago
  purchase_date: { type: Date }, //Data da venda
  due_date: { type: Date }, //Data de vencimento
  pay_date: { type: Date }, //Data de pagamento
  days_delay: { type: Number }, // Dias atraso
  situation: {
    type: String,
    enum: ['O', 'C'] //open, closed
  }, //Situação O - Aberto C - Fechada
  vendor: { type: String } // Vendedor
});

module.exports = restful.model('BillsReceive', billsReceiveSchema);
