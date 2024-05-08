import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  return axios.get(baseUrl).catch((error) => {
    console.log('fail');
  });
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).catch((error) => {
    console.log('fail');
  });
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).catch((error) => {
    console.log('fail');
  });
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).catch((error) => {
    console.log('fail');
  });
};

export default {
  getAll,
  create,
  update,
  deletePerson,
};
