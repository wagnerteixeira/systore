import axios from './axios';

export default (route) => {

  const create = (data) => axios.post(`/${route}`, data);
  const update = (data) => axios.put(`/${route}/${data._id}`, data);
  const getAll = (skip, limit, sort, order, filter) => {
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
        uri = `${uri}&sort=${order === 'desc'? '-': ''}${sort}`;
      if (filter)  {
        filter = createRegexFromFilter(filter);
        uri = `${uri}&${sort}__regex=/${filter}/i`;
      }
    }
    
    return axios.get(`/${route}${uri}`);    
  };

  const get = (id) => axios.get(`/${route}/${id}`);
  const remove = (id) => axios.delete(`/${route}/${id}`);
  const count = (sort, filter) => {
    let uri = '';
    if ((sort) && (filter)) {
      filter = createRegexFromFilter(filter);
      if (uri === '')
        uri = `?${sort}__regex=/${filter}`;
      else
        uri = `${uri}&${sort}__regex=/${filter}`;
    }
   return axios.get(`/${route}/count${uri}`);
  }

  const createRegexFromFilter = (filterValue) => {
    let regexString = '';
    if (filterValue.charAt(0) !== '%')
      regexString = '^' + filterValue
    else 
      regexString = filterValue.substr(1);

    if (regexString.charAt(regexString.length - 1) !== '%')
      regexString = regexString + '$'
    else 
      regexString = regexString.substr(0, regexString.length - 1);
    
    
    regexString = regexString.replace(new RegExp('%', 'g'), '.*');
    return regexString;
  
  }

  return {
    create,
    update,
    getAll,
    get,
    remove,
    count
  }
}