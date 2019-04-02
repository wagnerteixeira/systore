import axios from './axios';

const getLogs = (initialDate, finalDate) =>
  axios.post('/headerLog', { initialDate, finalDate });

export { getLogs };
