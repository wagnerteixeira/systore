const mongoose = require('mongoose');

const url = process.env.MONGO_URI
  ? `${process.env.MONGO_URI}_log`
  : 'mongodb://localhost/systore_log';

module.exports = mongoose.createConnection(url, {
  useNewUrlParser: true
});
