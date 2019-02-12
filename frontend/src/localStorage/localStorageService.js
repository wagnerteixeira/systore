import CryptoJS from 'crypto-js';

const getItem = (key) => {
  const item = localStorage.getItem(key);  
  if (item !== null) {
    const bytes = CryptoJS.AES.decrypt(item, 'sw');
    const value = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));   
    if (new Date(value.date).getTime() === new Date(new Date().toDateString()).getTime()) 
      return value.value;
    else
      return null;
  }
  else
    return null;
}

const setItem = (key, value) => {
  const _value = { value: value, date: new Date().toDateString()}
  localStorage.setItem(key, CryptoJS.AES.encrypt(JSON.stringify(_value), 'sw'));
}

const removeItem = (key) => {
  localStorage.removeItem(key);
}

export default {
  getItem,
  setItem,
  removeItem,
}