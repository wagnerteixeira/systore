import moment from 'moment';

export const debounceTime = (milliseconds, fn) => {
  let timer = 0;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, milliseconds);
  };
};

export const getDateToString = date => {
  if (date) return new Date(date).toLocaleString('pt-BR').substring(0, 10);
  else return '';
};

export const getDateTimeToString = date => {
  if (date) return new Date(date).toLocaleString('pt-BR');
  else return '';
};

export const getNumberDecimalToStringCurrency = number => {
  if (number && number['$numberDecimal'])
    return `R$ ${parseFloat(number['$numberDecimal']).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return 'R$ 0,00';
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
    return `R$ ${parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  else return 'R$ 0,00';
};

export const getDelayedDays = (due_date, pay_date) => {
  let days = moment(pay_date).diff(due_date, 'days');
  return days;
};

export const getValueWithInterest = (value, due_date, pay_date) => {
  let days = getDelayedDays(due_date, pay_date);
  let p = 0;
  if (days > 0) {
    p = (0.07 / 30) * days;
  
    let interest = value * p;
    return parseFloat(value) + parseFloat(interest);
  } else {
    return value;
  }
};

export const getValueInterest = (value, due_date, pay_date) => {
  let days = getDelayedDays(due_date, pay_date);
  let p = 0;
  if (days > 0) {
    p = (0.07 / 30) * days;
  
    let interest = value * p;
    return interest;
  }
  else {
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
