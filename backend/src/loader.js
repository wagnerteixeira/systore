
const result = require('dotenv').config()

if (result.error) {
  throw result.error
}
const server = require('./config/server') 
require('./config/database')
require('./config/routes')(server)
