import baseService from './baseService';

import axios from './axios';

const billsReceiveService = baseService('bills_receive');

const getBillsReceiveServiceByClient = (id) => axios.get(`/bills_receive/client/${id}`);
const getBillsReceiveServiceByClientPaid = (id) => axios.get(`/bills_receive/client/${id}/paid`);
const getBillsReceiveServiceByClientNoPaid = (id) => axios.get(`/bills_receive/client/${id}/no_paid`);
const createQuotas = (id, data) => axios.post(`/bills_receive/create_quotas/${id}`, data);

export default {
  ...billsReceiveService,
  getBillsReceiveServiceByClient,
  getBillsReceiveServiceByClientPaid,
  getBillsReceiveServiceByClientNoPaid,
  createQuotas
};