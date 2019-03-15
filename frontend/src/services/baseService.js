import axios from './axios';

export default (route) => {

  const create = (data) => axios.post(`/${route}`, data);
  const update = (data) => axios.put(`/${route}/${data._id}`, data);
  const getAll = (skip, limit, sort, filter) => {
    let uri = '';
    if (skip)
    {
      if (uri === '')
        uri = `?skip=${skip}`;
      else
        uri = `${uri}&skip=${skip}`;
    }
    if (limit)
    {
      if (uri === '')
        uri = `?limit=${limit}`;
      else
        uri = `${uri}&limit=${limit}`;
    }
    if (sort)
    {
      if (uri === '')
        uri = `?sort=${sort}`;
      else
        uri = `${uri}&sort=${sort}`;
      if (filter)  {
          uri = `${uri}&${sort}__regex=/${filter}/`;
      }
    }
    
    return axios.get(`/${route}${uri}`);    
  };

  const get = (id) => axios.get(`/${route}/${id}`);
  const remove = (id) => axios.delete(`/${route}/${id}`);
  const count = () => axios.get(`/${route}/count`);

  return {
    create,
    update,
    getAll,
    get,
    remove,
    count
  }

}