const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {    
    if(req.method === 'OPTIONS'){
        next()
    } else {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        console.log('toko');
        console.log(req.headers);

        if(!token){
            return res.status(401 ).send({errors: ['Não foi informado o token']})
        }
        
        jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded){            
            if(err){
                return res.status(401).send({errors: ['Falha ao validar token.']})
            } else {
                req.decoded = decoded
                next()
            }
        })
    }
}