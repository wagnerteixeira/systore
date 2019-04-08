const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const cors = require('cors');
const queryParser = require('express-query-int');
const methodOverride = require('method-override');
const morgan = require('morgan');

server.use(
  morgan(
    ':method :url :status :response-time ms - content-length - :res[content-length] remote-addr - :remote-addr date(-3h) - [:date]'
  )
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.json({ type: 'application/vnd.api+json' }));
server.use(cors());
server.use(queryParser());
server.use(methodOverride());

server.listen(port, () => {
  console.log(`BAKEND is running on port ${port}\n`);
  console.log('List of requests below\n');
});

module.exports = server;
