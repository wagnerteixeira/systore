import moment from 'moment';
import accounting from 'accounting';

export const debounceTime = (milliseconds, fn) => {
  let timer = 0;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, milliseconds);
  };
};

export const debounceTimeWithParams = (milliseconds, fn) => {
  let timer = 0;
  return (...params) => {
    clearTimeout(timer);
    timer = setTimeout(fn, milliseconds, ...params);
  };
};

export const getDateToString = date => {
  if (date) return new Date(date).toLocaleString('pt-BR').substring(0, 10);
  else return '';
};

export const getDateToStringUrl = date => {
  if (date) return new Date(date).toISOString().substring(0, 10);
  else return '';
};

export const getDateToStringYearTwoDigits = date => {
  if (date) {
    let _date = new Date(date);
    return `${_date
      .getDate()
      .toString()
      .padStart(2, '0')}/${(_date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${_date
      .getFullYear()
      .toString()
      .substr(-2)}`;
  } else return '';
};

export const getDateTimeToString = date => {
  if (date) return new Date(date).toLocaleString('pt-BR');
  else return '';
};

export const getNumberDecimalToStringCurrency = number => {
  if (number && number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  else return '0,00';
};

export const getNumberDecimalToString = number => {
  if (number && number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  else return '0,00';
};

export const getNumberToString = number => {
  if (number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  else return '0,00';
};

export const getNumberToString2 = number => {
  if (number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  else return '0,00';
};

export const getDelayedDays = (dueDate, payDate) => {
  let days = moment(payDate)
    .startOf('day')
    .diff(moment(dueDate).startOf('day'), 'days');
  return days;
};

export const getValueWithInterest = (value, dueDate, payDate) => {
  let days = getDelayedDays(dueDate, payDate);
  let p = 0;
  if (days >= 5) {
    p = (0.07 / 30) * days;

    let interest = accounting.unformat(value * p);
    return parseFloat(value) + parseFloat(interest);
  } else {
    return value;
  }
};

export const getValueInterest = (value, dueDate, payDate) => {
  let days = getDelayedDays(dueDate, payDate);
  let p = 0;
  if (days >= 5) {
    p = (0.07 / 30) * days;

    let interest = accounting.unformat(value * p);
    return parseFloat(interest);
  } else {
    return 0;
  }
};

export const getCurrentDate = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
};

export const strToDate = dateStr => {
  try {
    var parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  } catch {
    return null;
  }
};
