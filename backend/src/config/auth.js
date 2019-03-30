const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  } else {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers['authorization'] ||
      req.headers['x-access-token'];

    if (!token) {
      return res.status(401).send({ errors: ['Não foi informado o token'] });
    }
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded) {
      if (err) {
        return res.status(401).send({ errors: ['Falha ao validar token.'] });
      } else {
        req.decoded = decoded;
        if (
          req.method === 'PUT' ||
          req.method === 'POST' ||
          req.method === 'DELETE'
        )
          req.body._user = decoded.user.user_name;
        next();
      }
    });
  }
};
