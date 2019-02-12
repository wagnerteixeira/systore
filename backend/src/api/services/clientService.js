const Client = require('../../models/client')
const errorHandler = require('../common/errorHandler')

Client.methods(['get', 'post', 'put', 'delete'])

Client.updateOptions({new: true, runValidators: true})

Client.after('post', errorHandler).after('put', errorHandler)

Client.route('count', ['get'], (req, res, next) => {    
    Client.countDocuments((error, value) => {
        if (error){
            res.status(500).json({erros: [error]})
        } else {
            res.json({value})
        }
    })
})

module.exports = Client