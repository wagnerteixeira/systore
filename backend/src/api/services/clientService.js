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

Client.before('post', (req, res, next) => {
  if (!req.body.code) {
    Counter.findOneAndUpdate(
      { _id: 'client_code' },
      { $inc: { seq: 1 } },
      (error, counter) => {
        if (error) return next(error);
        req.body.code = counter.seq;
        next();
      }
    );
  } else next();
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

module.exports = Client;
