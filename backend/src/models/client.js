const restful = require('../node_restful/restful');
const mongoose = restful.mongoose;

const clientSchema = new mongoose.Schema({
  name: { type: String }, //Nome
  code: { type: Number, unique: true }, //Id no sistema antigo
  registry_date: { type: Date }, //Data de inclusão
  date_of_birth: { type: Date }, //Data de aniversário
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
  phone2: { type: String }, //Telefone 2
  address_number: { type: String }, //Número do endereço
  rg: { type: String }, // rg
  complement: { type: String }, // complemento
  admission_date: { type: Date }, //Data de admissao
  civil_status: { 
    type: Number,
    enum: [0, 1, 2, 3, 4, 5] //0-vazio 1-SOLTEIRO(A) 2-CASADO(A) 3-DIVORCIADO(A) 4-SEPARADO(A) 5-VIÚVO(A)
  }, //estado civil,
  father_name: { type: String }, // Nome do pai
  mother_name: { type: String }, // Nome da mae

  /*bills_receives: [{ 
      type: mongoose.Schema.Types.Object, 
      ref: 'BillsReceive',
    }]*/
});

module.exports = restful.model('Client', clientSchema);
