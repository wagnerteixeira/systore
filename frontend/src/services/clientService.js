import axios from './axios';

import baseService from './baseService';

const clientService = baseService('client');

const existCpf = (edit, id, cpf) =>
  axios.get(`/client/existcpf/${edit}/${id}/${cpf}`);

export default { ...clientService, existCpf };
