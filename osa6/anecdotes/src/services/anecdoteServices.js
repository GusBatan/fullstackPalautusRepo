import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const saveAnecdote = async (content) => {
  const response = await axios.post(baseUrl, content);
  return response.data;
};

const putAnecdote = async (content) => {
  const response = await axios.put(`${baseUrl}/${content.id}`, content);
  return response.data;
};

export default { getAll, saveAnecdote, putAnecdote };
