if (!Array.prototype.flatMap) {
  // eslint-disable-next-line
  Array.prototype.flatMap = function(cb) {
    return this.map(cb).reduce(
      (destArray, array) => destArray.concat(array),
      []
    );
  };
}

// eslint-disable-next-line
Number.prototype.formatFloat = function(
  decimalPlaces,
  decSeparator = '.',
  thouSeparator = ' '
) {
  let n = this;
  let sign = n < 0 ? '-' : '';
  let i = parseInt((n = Math.abs(+n || 0))) + '';
  let j = 0;
  j = (j = i.length) > 3 ? j % 3 : 0;
  let decimals = Number(
    Math.round(n + 'e' + decimalPlaces) + 'e-' + decimalPlaces
  ).toFixed(decimalPlaces);
  let result =
    sign +
    (j ? i.substr(0, j) + thouSeparator : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) +
    (decimalPlaces
      ? decSeparator +
        Math.abs(decimals - i)
          .toFixed(decimalPlaces)
          .slice(2)
      : '');
  return result;
};
