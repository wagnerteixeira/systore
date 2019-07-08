import axios from './axios';

import baseService from './baseService';

const clientService = baseService('client');

const existCpf = cpf => axios.get(`/client/existcpf/${cpf}`);

export default { ...clientService, existCpf };
