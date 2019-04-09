const express = require('express');
const auth = require('./auth');
var expressListRoutes = require('express-list-routes');

const UserService = require('../api/services/userService');
const ProductService = require('../api/services/productService');
const ClientService = require('../api/services/clientService');
const BillsReceiveService = require('../api/services/billsReceiveService');

const AuthService = require('../api/services/authService');
const { active } = require('../api/services/activeService');

module.exports = function(server, headerLog, itemLog) {
  /*
   * Protected routes
   */

  const logService = require('../api/services/logService')(headerLog, itemLog);

  server.get('/', active);
  const protectedApi = express.Router();
  server.use('/api', protectedApi);

  //protectedApi.use(auth);

  ProductService.register(protectedApi, '/product');
  UserService.register(protectedApi, '/user');
  ClientService.register(protectedApi, '/client');
  BillsReceiveService.register(protectedApi, '/bills_receive');

  /*
   Log routes   
  */
  protectedApi.post('/headerLog', logService.getHeaders);

  /*
   * Open routes
   */
  const openApi = express.Router();
  server.use('/oapi', openApi);

  openApi.post('/login', AuthService.login);
  openApi.post('/signUp', AuthService.signUp);
  openApi.post('/validateToken', AuthService.validateToken);

  console.log('Routes:\n');
  expressListRoutes({ prefix: '/api' }, 'Protected API:', protectedApi);
  expressListRoutes({ prefix: '/oapi' }, 'Open API:', openApi);

  /*ClientService.findById('5c5fb40c544b641767780a90')    
    .populate({
      path: 'bills_receives',
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: 'bills_receives' }
    })
    .exec(function (err, client) {
      if (err) return handleError(err);
      console.log(client.bills_receives[0].code);      
    });*/
};
