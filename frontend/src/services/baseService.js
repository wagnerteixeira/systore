import axios from './axios';

export default route => {
  const create = data => axios.post(`/${route}`, data);
  const update = data => axios.put(`/${route}/${data._id}`, data);
  const getAll = (skip, limit, search, sort, order, filterType, filter) => {
    let uri = '';
    if (skip) {
      if (uri === '') uri = `?skip=${skip}`;
      else uri = `${uri}&skip=${skip}`;
    }
    if (limit) {
      if (uri === '') uri = `?limit=${limit}`;
      else uri = `${uri}&limit=${limit}`;
    }
    if (sort) {
      if (uri === '') uri = `?sort=${sort}`;
      else uri = `${uri}&sort=${order === 'desc' ? '-' : ''}${sort}`;
    }
    if (search){
      if (filter) {
        if (filterType === 'rg') {
          filter = createRegexFromFilter(filter);
          uri = `${uri}&${search}__regex=/${filter}/i`;
        } else if (filterType === 'eq') uri = `?${search}=${filter}`;
        else if (filterType === 'gt') uri = `?${search}__gt=${filter}`;
        else if (filterType === 'gte') uri = `?${search}__gte=${filter}`;
        else if (filterType === 'lt') uri = `?${search}__lt=${filter}`;
        else if (filterType === 'lte') uri = `?${search}__lte=${filter}`;
      }
    }

    return axios.get(`/${route}${uri}`);
  };

  const get = id => axios.get(`/${route}/${id}`);
  const remove = id => axios.delete(`/${route}/${id}`);
  const count = (sort, filterType, filter) => {
    let uri = '';
    if (sort && filter) {
      if (filterType === 'rg') {
        filter = createRegexFromFilter(filter);
        uri = `?${sort}__regex=/${filter}`;
      } else if (filterType === 'eq') uri = `?${sort}=${filter}`;
      else if (filterType === 'gt') uri = `?${sort}__gt=${filter}`;
      else if (filterType === 'gte') uri = `?${sort}__gte=${filter}`;
      else if (filterType === 'lt') uri = `?${sort}__lt=${filter}`;
      else if (filterType === 'lte') uri = `?${sort}__lte=${filter}`;
    }

    return axios.get(`/${route}/count${uri}`);
  };

  const createRegexFromFilter = filterValue => {
    let regexString = '^' + filterValue;
    /*if (filterValue.charAt(0) !== '%') regexString = '^' + filterValue;
    else regexString = filterValue.substr(1);

    if (regexString.charAt(regexString.length - 1) !== '%')
      regexString = regexString + '$';
    else regexString = regexString.substr(0, regexString.length - 1);*/

    regexString = regexString.replace(new RegExp('%', 'g'), '.*');
    return regexString;
  };

  /*
  create regex from filter with %
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
  
  }*/

  return {
    create,
    update,
    getAll,
    get,
    remove,
    count
  };
};
