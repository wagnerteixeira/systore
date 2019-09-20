import axios from './axios';

import baseService from './baseService';

const saleService = baseService('sale');

const getAllNoParameters = () => {
  return axios.get(`/sale`);
};

const getSaleFullById = id => {
  return axios.get(`/sale/getSaleFullById/${id}`);
};

export default { ...saleService, getAllNoParameters, getSaleFullById };
