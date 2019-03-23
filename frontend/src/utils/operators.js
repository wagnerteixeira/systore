export const debounceTime = (milliseconds, fn) => {
  let timer = 0;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, milliseconds);
  }
}

export const getDateToString = (date) => new Date(date).toLocaleString('pt-BR').substring(0, 10);

export const getNumberDecimalToString = (number) => `R$ ${parseFloat(number).toLocaleString('pt-BR', { minimumFractionDigits: 2})}`;

