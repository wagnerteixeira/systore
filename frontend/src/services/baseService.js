import axios from './axios';

export default route => {
  const create = data => axios.post(`/${route}`, data);
  const update = data => axios.put(`/${route}`, data);
  const getAll = (skip, limit, search, sort, order, filterType, filter) => {
    let filterPaginateDto = {};
    filterPaginateDto.Skip = skip;
    filterPaginateDto.Limit = limit;
    filterPaginateDto.SortPropertyName = sort;
    filterPaginateDto.Order = order;
    if (search && filter) {
      filterPaginateDto.filters = [
        {
          Operation: filterType,
          Value: filter,
          PropertyName: search,
        },
      ];
    } else {
      filterPaginateDto.filters = null;
    }
    return axios.post(`/${route}/getpaginate`, filterPaginateDto);
  };

  const get = id => axios.get(`/${route}/${id}`);
  const remove = id => axios.delete(`/${route}/${id}`);
  const count = (sort, filterType, filter) => {
    let filterDto = [
      {
        PropertyName: sort,
        Operation: filterType,
        Value: filter,
      },
    ];
    /*if (filterType === 'Eq') filterDto = {

    };
    else if (filterType === 'gt') uri = `?${sort}__gt=${filter}`;
    else if (filterType === 'gte') uri = `?${sort}__gte=${filter}`;
    else if (filterType === 'lt') uri = `?${sort}__lt=${filter}`;
    else if (filterType === 'lte') uri = `?${sort}__lte=${filter}`;*/
    return axios.post(`/${route}/count`, filterDto);
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
    count,
  };
};
