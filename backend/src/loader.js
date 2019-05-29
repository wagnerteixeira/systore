const result = require('dotenv').config();
require('./config/accounting');

if (result.error) {
  throw result.error;
}
const server = require('./config/server');
require('./config/database');
//------------LOG-----------//
const logConnection = require('./config/logDatabase');
const headerLog = require('../src/models/headerLog')(logConnection);
const itemLog = require('../src/models/itemLog')(logConnection);
require('../src/api/log/logPlugin')(logConnection, headerLog, itemLog);
//-----------LOG-----------//

require('./config/routes')(server, headerLog, itemLog);
