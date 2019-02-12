const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const cors = require('cors');
const queryParser = require('express-query-int');

server.use(bodyParser.urlencoded({ extended : true}));
server.use(bodyParser.json());
server.use(cors());
server.use(queryParser());

server.listen(port, () => {
    console.log(`BAKEND is running on port ${port}`)   
    /*var promise = Product.create({ 
        type: 1,
        coast: 10.25,
        daysOfValidity: 5,
        Description: 'Teste',
        Description2: 'Teste 2',
        printPackingDate: true,
        extraInfo: 'String',
        extraInfo2: 'String',
        extraInfo3: 'String',
    })     
    promise.then(() => {
       console.log('Criou')
    })*/
    //console.log(app._router.stack)
});

module.exports = server;