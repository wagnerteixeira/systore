const express = require('express');
const auth = require('./auth');

module.exports = function(server, connection, HeaderLog, ItemLog) {
  const logApi = express.Router();
  server.use('/log', logApi);
  //logApi.use(auth);

  logApi.post('/header', LogService.getHeaders);
};
