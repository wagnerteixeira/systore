import axios from './axios';

import baseService from './baseService';

const saleService = baseService('sale');

const createDto = data => axios.post(`/sale/post-dto`, data);
const updateDto = data => axios.put(`/sale/put-dto`, data);

const getAllNoParameters = () => {
  return axios.get(`/sale`);
};

const getSaleFullById = id => {
  return axios.get(`/sale/getSaleFullById/${id}`);
};

export default {
  ...saleService,
  createDto,
  updateDto,
  getAllNoParameters,
  getSaleFullById,
};
