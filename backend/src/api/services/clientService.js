const Client = require('../../models/client');
const BillsReceive = require('../../models/billsReceive');
const errorHandler = require('../common/errorHandler');
const Counter = require('../../models/counters');

Client.methods(['get', 'post', 'put', 'delete']);

Client.updateOptions({ new: true, runValidators: true });

Client.after('post', errorHandler).after('put', errorHandler);

Client.before('delete', (req, res, next) => {
  console.log(req.params.id);
  if (!req.params.id)
    return res.status(404).send({ errors: ['Cliente não encontrado'] });
  BillsReceive.find({ client: req.params.id }).exec((error, bills_receives) => {
    console.log(bills_receives);
    console.log(bills_receives.length);
    if (error) {
      res.status(500).json({ erros: [error] });
    } else {
      console.log('antes');
      if (bills_receives.length > 0) {
        console.log('depois');
        return res.status(400).send({
          errors: ['Não é possível excluir o cliente pois ele possui títulos.']
        });
      } else next();
      return;
    }
  });
});

Client.before('post', async (req, res, next) => {
  let _client = await Client.findOne({ cpf: req.body.cpf });
  if (_client) {
    return res.status(412).json({
      erros: [`Já existe um cliente com o CPF ${_client.cpf}, ${_client.name} `]
    });
  }
  
  if (new Date(req.body.date_of_birth) > new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate())
  ) {
    return res.status(412).json({
      erros: [          
        `Data de nascimento não pode ser maior que a data atual`
      ]
    });
  }
  Counter.findOneAndUpdate(
    { _id: 'client_code' },
    { $inc: { seq: 1 } },
    (error, counter) => {
      if (error) return next(error);
      req.body.code = counter.seq;
      next();
    }
  );

});

Client.before('put', async (req, res, next) => {
  let clients = await Client.find({ cpf: req.body.cpf });
  if (clients.length === 0) next();
  else {
    _clients = clients.filter(
      c => c._id.toString() !== req.body._id.toString()
    );
    if (_clients.length > 0 && _clients[0]._id !== req.body._id) {
      return res.status(412).json({
        erros: [
          `Já existe um cliente com o CPF ${_clients[0].cpf}, ${
            _clients[0].name
          } `
        ]
      });
    }   
    
    if (new Date(req.body.date_of_birth) > new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate())
    ) {
      return res.status(412).json({
        erros: [          
          `Data de nascimento não pode ser maior que a data atual`
        ]
      });
    }
    next();
  }
});

Client.route('count', ['get'], (req, res, next) => {
  let filterQuery = {};
  if (Object.keys(req.query).some(value => value.includes('__regex'))) {
    Object.keys(req.query).forEach((value, index, arr) => {
      if (value.includes('__regex')) {
        let valueRegex = req.query[value];
        if (valueRegex.charAt(0) === '/') valueRegex = valueRegex.substr(1);
        if (valueRegex.charAt(valueRegex.length - 1) === '/')
          valueRegex = valueRegex.substr(0, valueRegex.length - 1);
        filterQuery = {
          [value.replace('__regex', '')]: new RegExp(valueRegex, 'i')
        };
      }
    });
  } else {
    filterQuery = req.query;
  }

  Client.countDocuments(filterQuery, (error, value) => {
    if (error) {
      res.status(500).json({ erros: [error] });
    } else {
      res.json({ value });
    }
  });
});

Client.route(
  'existcpf.:edit(0|1).:id([0-9a-fA-F]{0,24}|).:cpf([0-9]{0,11})',
  ['get'],
  (req, res, next) => {
    Client.find({ cpf: req.params.cpf }, (error, value) => {
      if (error) {
        res.status(500).json({ erros: [error] });
      } else {
        if (req.params.edit) {
          console.log(value)
          if (!!value.length && value[0]._id.toString() !== req.params.id) {
            return res.status(412).json({
              erros: [
                `Já existe um cliente com o CPF ${value[0].cpf}, ${
                  value[0].name
                } `
              ]
            });
          } else res.json('OK');
        } else {
          if (!!value.length) {
            return res.status(412).json({
              erros: [
                `Já existe um cliente com o CPF ${value[0].cpf}, ${
                  value[0].name
                } `
              ]
            });
          } else res.json('OK');
        }
      }
    });
  }
);

module.exports = Client;
