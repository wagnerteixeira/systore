exports.getDateToString = date => {
  if (date)
    return new Date(date)
      .toISOString()
      .substring(0, 10)
      .split('-')
      .reverse()
      .reduce((el, acc) => el + acc + '/', '')
      .substr(0, 10);
  else return '';
};
