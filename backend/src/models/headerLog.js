const mongoose = require('mongoose');

module.exports = function(connection) {
  const headerLogSchema = new mongoose.Schema({
    collectionName: { type: String },
    date: { type: Date },
    user: { type: String },
    operation: { type: String },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemLog' }]
  });

  return connection.model('HeaderLog', headerLogSchema);
};
