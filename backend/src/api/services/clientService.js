const Client = require('../../models/client')
const errorHandler = require('../common/errorHandler')

Client.methods(['get', 'post', 'put', 'delete'])

Client.updateOptions({new: true, runValidators: true})

Client.after('post', errorHandler).after('put', errorHandler)
Client.before('post',  (req, res, next) => {
  console.log(req.body);
  next()
})

Client.route('count', ['get'], (req, res, next) => {    
  const query = req.query || '';  
  let filterQuery = {};
  Object.keys(req.query).forEach((value, index, arr) => {
    if (value.includes('__regex')) {
      let valueRegex = req.query[value];
      if (valueRegex.charAt(0) === '/')
        valueRegex= valueRegex.substr(1);
      if (valueRegex.charAt(valueRegex.length -1) === '/')
        valueRegex = valueRegex.substr(0, valueRegex.length - 1);
      filterQuery = { [value.replace('__regex', '')]: new RegExp(valueRegex, 'i') }
    }
  });

  Client.countDocuments(filterQuery, (error, value) => {
      if (error){
          res.status(500).json({erros: [error]})
      } else {
          res.json({value})
      }
  })
});

module.exports = Client