const _ = require('lodash');

module.exports = (req, res, next) => {
  const bundle = res.locals.bundle;
  if (bundle.errors) {
    const errors = parseErrors(bundle.errors);
    res.status(500).json({ errors });
  } else if (bundle.errmsg) {
    if (bundle.code === 11000)
      res.status(500).json({
        errors: ['Indice duplicado, entre em contato com o suporte!']
      });
    else res.status(500).json({ errors: [bundle.errmsg] });
  } else {
    next();
  }
};

const parseErrors = nodeRestfulErrors => {
  const errors = [];
  console.log(nodeRestfulErrors);
  _.forIn(nodeRestfulErrors, error => errors.push(error.message));
  return errors;
};
