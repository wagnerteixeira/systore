const restful = require('node-restful')
const mongoose = restful.mongoose

const clientSchema = new mongoose.Schema({
    name: { type : String }, //Nome
    old_id: { type: Number }, //Id no sistema antigo
    registry_date: {type: Date }, //Data de inclusão
    date_of_birth: {type: Date}, //Data de aniversário
    address: { type: String }, //Endereço
    neighborhood: { type: String }, // Bairro
    city: { type: String }, //Cidade
    state: { type: String }, //Estado
    postal_code: { type: String }, //Cep
    cpf: { type: String }, //Cpf
    seller: { type: String }, //Vendedor
    job_name: { type: String }, //Nome da empresa de trabalho
    occupation: { type: String }, //Profissão
    place_of_birth: { type: String }, //Naturalidade
    spouse: { type: String }, //Cônjuge    
    note: { type: String }, //Observações
    phone1: { type: String }, //Telefone 1
    prohe2: { type: String }, //Telefone 2

    bills_receives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BillsReceive' }]
})

module.exports = restful.model('Client', clientSchema)