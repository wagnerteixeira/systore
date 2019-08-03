import axios from './axios';

import baseService from './baseService';

const productService = baseService('product');

const getAllNoParameters = () => {
  return axios.get(`/product`);
};


export default { ...productService, getAllNoParameters };
