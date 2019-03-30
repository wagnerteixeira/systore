const restful = require('../../node_restful/restful');
const { getDiff } = require('./diff');
const _ = require('lodash');

module.exports = function(connection, HeaderLog, ItemLog) {
  const saveLog = function(collectionName, user, operation, diff) {
    let headerLog = new HeaderLog({
      collectionName: collectionName,
      date: new Date(),
      user: user,
      operation: operation
    });

    headerLog.save(function(err) {
      //console.log('salvou header');
      if (err) {
        console.log(err);
        return;
      }

      _.forEach(diff, function(value) {
        let itemLog = new ItemLog({
          headerLog: headerLog._id,
          field: value.key,
          newValue: operation === 'R' ? value.oldValue || '' : value.newValue,
          oldValue: operation === 'R' ? value.newValue : value.oldValue || ''
        });

        itemLog.save();
        headerLog.items.push(itemLog);
      });

      headerLog.save(function(err) {
        if (err) console.log(err);
      });
    });
  };
  const plugin = function(schema) {
    schema.post('init', doc => {
      //console.log('post init');
      doc._original = doc.toObject({ transform: false });
    });

    schema.pre('save', function(next) {
      //console.log('pre save');
      if (this.isNew) this._original = {};
      this._diff = getDiff(this._doc, this._original);
      this._isNew = this.isNew;
      next();
    });

    schema.post('remove', function() {
      //console.log('post remove');
      saveLog(
        this.collection.name,
        this['$__']._user,
        'R',
        getDiff(this._original, {})
      );
    });

    schema.post('save', function() {
      saveLog(
        this.collection.name,
        this['$__']._user,
        this._isNew ? 'C' : 'U',
        this._diff
      );
      // console.log('post save');
    });
  };

  restful.mongoose.plugin(plugin);
  //console.log(restful.mongoose);
};

/*
const _ = require('lodash');
const LogSchema = require('../models/log');
const { getDiff } = require('./diff');

const plugin = function(schema) {
  schema.post('init', doc => {
    //console.log(doc.toObject({transform: false}));
    doc._original = doc.toObject({ transform: false });
  });

  schema.pre('save', function(next) {
    if (this.isNew) this._original = {};
    this._diff = getDiff(this._doc, this._original);
    //console.log(this._diff);
    next();
  });

  schema.methods.log = function(data) {
    data = this._diff;
    return LogSchema.create(data);
  };
};

module.exports = plugin;
*/
