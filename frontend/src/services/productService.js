import axios from './axios';

import baseService from './baseService';

const productService = baseService('product');

const getProductsForExportToBalance = ({ typeOfSearchProductsToBalance }) =>
  axios.post(`product/get-products-for-export-to-balance`, {
    typeOfSearchProductsToBalance,
  });

export default {
  ...productService,
  getProductsForExportToBalance,
};
