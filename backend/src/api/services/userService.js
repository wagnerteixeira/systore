const bcrypt = require('bcrypt');
const User = require('../../models/user')
const errorHandler = require('../common/errorHandler')

const cryptPassword = (req, res, next) => {
  const password = req.body.password || '';
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt);
  req.body.password = passwordHash;
  console.log('fim hash');
  next();
}

User.methods(['get', 'post', 'put', 'delete'])

User.updateOptions({new: true, runValidators: true})

User.before('post', cryptPassword).before('put', cryptPassword);

User.after('post', errorHandler).after('put', errorHandler)

User.route('count', ['get'], (req, res, next) => {
    User.count((error, value) => {
        if (error){
            res.status(500).json({erros: [error]})
        } else {
            res.json({value})
        }
    })
})

module.exports = User;