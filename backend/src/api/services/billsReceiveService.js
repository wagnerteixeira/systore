const BillsReceive = require('../../models/billsReceive');
const Client = require('../../models/client');
const errorHandler = require('../common/errorHandler');
const { getDateToString } = require('../../utils/helpers');
const accounting = require('accounting');
const sendErrorsFromDB = (res, dbErros) => {
  const errors = [];
  _.forIn(dbErros.errors, error => errors.push(error.message));
  return res.status(400).json({ errors });
};

const refClient = async (req, res, next) => {
  if (!res.locals.bundle.errors) {
    let bill_receive = res.locals.bundle;
    let _id = req.body.client;
    let client = await Client.findById(_id);
    client.bills_receives.push(bill_receive);
    client.save(err => {
      if (err) {
        res.status(500).json({ err });
      } else next();
    });
  } else next();
};

BillsReceive.methods(['get', 'post', 'put']);

BillsReceive.updateOptions({ new: true, runValidators: true });
BillsReceive.after('post', errorHandler).after('put', errorHandler);
//BillsReceive.after('post', refClient);

BillsReceive.route('count', ['get'], (req, res, next) => {
  BillsReceive.countDocuments((error, value) => {
    if (error) {
      res.status(500).json({ erros: [error] });
    } else {
      res.json({ value });
    }
  });
});

BillsReceive.route(
  'client.:id([0-9a-fA-F]{0,24})',
  ['get'],
  (req, res, next) => {
    /*Client.findById(req.params.id)    
  .populate({
    path: 'bills_receives',
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'bills_receives' }
  })
  .exec((error, client) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(client.bills_receives);
    }   
  });*/
    /*  BillsReceive.find({ client: req.params.id })
      .sort({ code: 1, quota: 1 })
      .exec((error, bills_receives) => {
        if (error) {
          res.status(500).json({ erros: [error] });
        } else {
          res.json(bills_receives);
        }
      });*/

    let billsReceivesNoPaid = BillsReceive.find({
      client: req.params.id,
      situation: 'O'
    }).sort({ purchase_date: 1, quota: 1 });
    let billsReceivesPaid = BillsReceive.find({
      client: req.params.id,
      situation: 'C'
    }).sort({ purchase_date: -1, quota: 1 });

    Promise.all([billsReceivesNoPaid, billsReceivesPaid]).then(values => {
      let billsReceives = [];
      billsReceives.push(...values[0]);
      billsReceives.push(...values[1]);
      res.json(billsReceives);
      //console.log(values[0]);
      //console.log(values[1]);
    });

    //return res.status(200).json('OK');*/

    /*BillsReceive.find({ client: req.params.id })
      .sort({ code: 1, quota: 1 })
      .exec((error, bills_receives) => {
        if (error) {
          res.status(500).json({ erros: [error] });
        } else {
          res.json(bills_receives);
        }
      });*/
  }
);

BillsReceive.route(
  'client.:id([0-9a-fA-F]{0,24}).paid',
  ['get'],
  (req, res, next) => {
    /*Client.findById(req.params.id)    
  .populate({
    path: 'bills_receives',
    match: { situation : 'C' },
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'bills_receives' }
  })
  .exec((error, client) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(client.bills_receives);
    }   
  }); */

    BillsReceive.find({ client: req.params.id, situation: 'C' })
      .sort({ code: 1, quota: 1 })
      .exec((error, bills_receives) => {
        if (error) {
          res.status(500).json({ erros: [error] });
        } else {
          res.json(bills_receives);
        }
      });
  }
);

BillsReceive.route(
  'client.:id([0-9a-fA-F]{0,24}).no_paid',
  ['get'],
  (req, res, next) => {
    /*Client.findById(req.params.id)    
  .populate({
    path: 'bills_receives',
    match: { situation : 'O' },
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'bills_receives' }
  })
  .exec((error, client) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(client.bills_receives);
    }   
  }); */
    BillsReceive.find({ client: req.params.id, situation: 'O' })
      .sort({ code: 1, quota: 1 })
      .exec((error, bills_receives) => {
        if (error) {
          res.status(500).json({ erros: [error] });
        } else {
          res.json(bills_receives);
        }
      });
  }
);

BillsReceive.route('next_code', ['get'], (req, res, next) => {
  BillsReceive.findOne()
    .sort({ code: -1 })
    .exec((error, doc) => {
      if (error) res.status(500).json({ erros: [error] });
      if (doc.code) res.status(200).json(parseInt(doc.code) + 1);
      else res.status(200).json(1);
    });
});

const validateQuotas = (original_value, bills_receives, purchase_date) => {
  console.log(
    `data ${getDateToString(new Date(purchase_date))} \n${JSON.stringify(
      new Date(purchase_date)
        .toISOString()
        .substring(0, 10)
        .split('-')
        .reverse()
        .reduce((el, acc) => el + acc + '/', '')
        .substr(0, 10)
    )} \n${new Date(purchase_date).toLocaleDateString()} \n${new Date(
      purchase_date
    ).toLocaleDateString('pt-BR')}  \n${new Date(
      purchase_date
    ).toUTCString()} \n${new Date(purchase_date).toString()}`
  );
  let error = '';
  let sum_original_value = 0.0;
  let sum_temp = 0.0;
  bills_receives.forEach(bill_receive => {
    sum_original_value =
      (sum_temp * 10 +
        accounting.unformat(bill_receive.original_value) * 10.0) /
      10.0;
    sum_temp = sum_original_value;
    if (new Date(bill_receive.due_date) < new Date(purchase_date))
      error += `A data de pagamento (${getDateToString(
        new Date(bill_receive.due_date)
      )}) da parcela ${
        bill_receive.quota
      } é menor que a data da compra (${getDateToString(
        new Date(purchase_date)
      )})\n`;
  });

  if (
    accounting.unformat(accounting.formatNumber(sum_original_value)) !==
    accounting.unformat(original_value)
  )
    error += `A soma das parcelas (R$ ${parseFloat(
      sum_original_value
    )}) difere do valor do título (R$ ${parseFloat(original_value)})!\n`;

  return error;
};

BillsReceive.route(
  'create_quotas.:id([0-9a-fA-F]{0,24})',
  ['post'],
  (req, res, next) => {
    let validate = validateQuotas(
      req.body.original_value,
      req.body.bills_receives,
      req.body.purchase_date
    );
    if (validate) return res.status(500).json({ erros: [validate] });
    let bills_receives = [];
    BillsReceive.findOne()
      .sort({ code: -1 })
      .exec((error, doc) => {
        //console.log(doc);
        if (error) return res.status(500).json({ erros: [error] });
        let nextCode = doc ? doc.code + 1 : 1;
        bills_receives = req.body.bills_receives;
        let results = Object.values(bills_receives).map(bill_receive => {
          const _bill_receive = new BillsReceive({
            client: req.params.id,
            code: nextCode,
            quota: bill_receive.quota,
            original_value: bill_receive.original_value,
            interest: 0.0,
            final_value: 0.0,
            purchase_date: req.body.purchase_date,
            due_date: bill_receive.due_date,
            pay_date: null,
            days_delay: 0,
            situation: 'O',
            vendor: req.body.vendor
          });
          _bill_receive['$__']._user = req.body._user;
          return _bill_receive.save();
        });
        Promise.all(results)
          .then(values => {
            res.status(200).json(values);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      });
  }
);

BillsReceive.before('delete', async (req, res, next) => {
  if (!req.params.code)
    return res.status(404).send({ errors: ['Título não encontrado'] });
  console.log('oi');
  let billsReceives = await BillsReceive.find({ code: req.params.code });
  if (billsReceives.some(billsReceive => billsReceive.situation === 'C')) {
    return res
      .status(500)
      .send({
        errors: ['Carnê não pode ser excluído pois existe parcela paga!']
      });
  } else next();
});

BillsReceive.route(':code([0-9]+)', ['delete'], (req, res, next) => {  
  BillsReceive.find({ code: req.params.code })
    .then(billsReceives => {      
      if (billsReceives.some(billsReceive => billsReceive.situation === 'C')) {
        return res
          .status(500)
          .send({
            errors: ['Carnê não pode ser excluído pois existe parcela paga!']
          });
      }
      else {
        let billsReceivesRemovePromise = billsReceives.map(b => b.remove());
        Promise.all(billsReceivesRemovePromise)
          .then(values => {
            console.log(values);
            res.status(200).json('OK');
          })
          .catch(error => {
            res.status(500).json(error);
          });
      }  
    });
});

module.exports = BillsReceive;
