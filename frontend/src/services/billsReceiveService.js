import baseService from './baseService';

import axios from './axios';

const billsReceiveService = baseService('BillReceive');

const getBillsReceiveServiceByClient = id =>
  axios.get(`/BillReceive/client/${id}`);
const getBillsReceiveServiceByClientPaid = id =>
  axios.get(`/BillReceive/client/${id}/paid`);
const getBillsReceiveServiceByClientNoPaid = id =>
  axios.get(`/BillReceive/client/${id}/no_paid`);
const createBillReceives = (data) =>
  axios.post(`/BillReceive/createBillReceives/`, data);

billsReceiveService.remove = code => axios.delete(`/BillReceive/${code}`);

export default {
  ...billsReceiveService,
  getBillsReceiveServiceByClient,
  getBillsReceiveServiceByClientPaid,
  getBillsReceiveServiceByClientNoPaid,
  createBillReceives,
};
