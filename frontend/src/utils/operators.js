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
  if (number && number['$numberDecimal'])
    return `${parseFloat(number['$numberDecimal']).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return '0,00';
};

export const getNumberDecimalToString = number => {
  if (number && number['$numberDecimal'])
    return `${parseFloat(number['$numberDecimal']).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return '0,00';
};

export const getNumberToString = number => {
  if (number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return '0,00';
};

export const getNumberToString2 = number => {
  if (number)
    return `${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return '0,00';
};

export const getDelayedDays = (due_date, pay_date) => {
  let days = moment(pay_date).startOf('day').diff(moment(due_date).startOf('day'), 'days');
  return days;
};

export const getValueWithInterest = (value, due_date, pay_date) => {
  let days = getDelayedDays(due_date, pay_date);
  let p = 0;
  if (days >= 5) {
    p = (0.07 / 30) * days;

    let interest = accounting.unformat(value * p);
    return parseFloat(value) + parseFloat(interest);
  } else {
    return value;
  }
};

export const getValueInterest = (value, due_date, pay_date) => {
  let days = getDelayedDays(due_date, pay_date);
  console.log(days);
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
