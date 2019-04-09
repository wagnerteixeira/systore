// eslint-disable-next-line
// eslint-disable-next-line
if (!Array.prototype.flatMap) {
  // eslint-disable-next-line
  // eslint-disable-next-line
  Array.prototype.flatMap = function(cb) {
    return this.map(cb).reduce(
      (destArray, array) => destArray.concat(array),
      []
    );
  };
}
