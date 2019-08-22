import axios from './axios';

import baseService from './baseService';

const saleService = baseService('sale');

const getAllNoParameters = () => {
  return axios.get(`/sale`);
};


export default { ...saleService, getAllNoParameters };
