const restful = require('node-restful')
const mongoose = restful.mongoose

const clientSchema = new mongoose.Schema({
    name: { type : String },
    old_id: { type: Number },
    registry_date: {type: Date },
    date_of_birth: {type: Date},
    address: { type: String },
    neighborhood: { type: String },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    cpf: { type: String },
    seller: { type: String },
    job_name: { type: String },
    city_job: { type: String },
    occupation: { type: String },
    bills_receives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BillsReceive' }]
})

module.exports = restful.model('Client', clientSchema)