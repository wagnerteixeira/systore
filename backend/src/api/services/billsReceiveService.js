const BillsReceive = require('../../models/billsReceive');
const Client = require('../../models/client');
const errorHandler = require('../common/errorHandler');

const sendErrorsFromDB = (res, dbErros) => {
  const errors = []
  _.forIn(dbErros.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

const refClient = async (req, res, next) => {
  if (!res.locals.bundle.errors){
    let bill_receive = res.locals.bundle;
    let _id = req.body.client;
    let client = await Client.findById(_id);
    client.bills_receives.push(bill_receive);
    client.save((err) => {
      if (err) {        
        res.status(500).json({err});
      }
      else
        next();
    });
  }
  else
    next()
}

BillsReceive.methods(['get', 'post', 'put', 'delete'])

BillsReceive.updateOptions({new: true, runValidators: true})
BillsReceive.after('post', errorHandler).after('put', errorHandler)
//BillsReceive.after('post', refClient);

Client.before('delete', (req, res, next) => {
  if(req.params.id)
    next();
  else
    return res.status(404).send({errors: ['Título não encontrado']})
});

BillsReceive.route('count', ['get'], (req, res, next) => {
    BillsReceive.countDocuments((error, value) => {
        if (error){
            res.status(500).json({erros: [error]})
        } else {
            res.json({value})
        }
    })
})

BillsReceive.route('client.:id([0-9a-fA-F]{0,24})', ['get'], (req, res, next) => {
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
  BillsReceive.find({client: req.params.id})
  .exec((error, bills_receives) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(bills_receives);
    }   
  })
});

BillsReceive.route('client.:id([0-9a-fA-F]{0,24}).paid', ['get'], (req, res, next) => {
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
  BillsReceive.find({client: req.params.id, situation : 'C'})
  .exec((error, bills_receives) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(bills_receives);
    }   
  })
});

BillsReceive.route('client.:id([0-9a-fA-F]{0,24}).no_paid', ['get'], (req, res, next) => {
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
  BillsReceive.find({client: req.params.id, situation : 'O'})
  .exec((error, bills_receives) => {
    if (error){
      res.status(500).json({erros: [error]})
    } else {
      res.json(bills_receives);
    }   
  })
});

BillsReceive.route('next_code', ['get'], (req, res, next) => {
  BillsReceive
    .findOne()
    .sort({"code": -1})
    .exec((error, doc) => {
      if (error)
        res.status(500).json({erros: [error]})      
      if (doc.code)
        res.status(200).json(parseInt(doc.code) + 1);
      else
        res.status(200).json(1);
    })
})

BillsReceive.route('create_quotas.:id([0-9a-fA-F]{0,24})', ['post'], (req, res, next) => {
  let bills_receives = [];
  let _bills_receives = [];   
  BillsReceive
    .findOne()
    .sort({"code": -1})
    .exec((error, doc) => {
      console.log(doc);
      if (error)
        res.status(500).json({erros: [error]});
      let nextCode = doc.code;
      bills_receives = req.body.bills_receives;
      Object.values(bills_receives).forEach(bill_receive => {
        nextCode++;
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
        _bill_receive.save(err => {
          if (err) 
            sendErrorsFromDB(res, err)
        });   
        _bills_receives.push(_bill_receive);
      })
      res.status(200).json(_bills_receives);
    })
})


module.exports = BillsReceive