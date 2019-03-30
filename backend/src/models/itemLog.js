const mongoose = require('mongoose');

module.exports = function(connection) {
  const itemLogSchema = new mongoose.Schema({
    headerLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HeaderLog'
    }, //HeaderLog
    field: { type: String },
    oldValue: { type: String },
    newValue: { type: String }
  });

  return connection.model('ItemLog', itemLogSchema);
};
