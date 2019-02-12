const BillsReceive = require('../../models/billsReceive');
const Client = require('../../models/client');
const errorHandler = require('../common/errorHandler');

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
BillsReceive.after('post', refClient);

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
  Client.findById(req.params.id)    
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
  });  
});

BillsReceive.route('client.:id([0-9a-fA-F]{0,24}).paid', ['get'], (req, res, next) => {
  Client.findById(req.params.id)    
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
  });  
});

BillsReceive.route('client.:id([0-9a-fA-F]{0,24}).no_paid', ['get'], (req, res, next) => {
  Client.findById(req.params.id)    
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
  });  
});


module.exports = BillsReceive