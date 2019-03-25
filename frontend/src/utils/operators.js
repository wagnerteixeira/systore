export const debounceTime = (milliseconds, fn) => {
  let timer = 0;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, milliseconds);
  }
}

export const getDateToString = (date) => {
  if (date)
    return new Date(date).toLocaleString('pt-BR').substring(0, 10)
  else
    return '';
};

export const getNumberDecimalToString = (number) => {
  if ((number) && (number["$numberDecimal"]))
    return `R$ ${parseFloat(number["$numberDecimal"]).toLocaleString('pt-BR', { minimumFractionDigits: 2})}`;
  else
    return 'R$ 0,00';
}

