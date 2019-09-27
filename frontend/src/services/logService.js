import axios from './axios';

const getLogs = (initialDate, finalDate) =>
  axios.get(
    `/Audit?initialDate=${initialDate.toISOString()}&finalDate=${finalDate.toISOString()}`
  );

export { getLogs };
