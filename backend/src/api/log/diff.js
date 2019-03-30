const _ = require('lodash');

exports.getDiff = (curr, prev) => {
  function changes(object, base) {
    return _.transform(
      object,
      (result, value, key) => {
        if (!_.isEqual(value, base[key]) || key == '_id') {
          result.push({ key: key, newValue: value, oldValue: base[key] });
        }
      },
      []
    );
  }
  return changes(curr, prev);
};
