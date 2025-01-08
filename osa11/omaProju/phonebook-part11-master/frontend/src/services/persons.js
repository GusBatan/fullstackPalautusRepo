import axios from 'axios';
const baseUrl = 'api/persons';

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(`${baseUrl}/post`, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/delete/${id}`);
};

export default {
  getAll,
  create,
  update,
  deletePerson,
};
