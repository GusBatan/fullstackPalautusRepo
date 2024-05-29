import axios from 'axios';
const baseUrl = '/api/blogs';

const getToken = (newToken) => {
  return `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const logIn = async ({ username, password }) => {
  try {
    const response = await axios.post('/api/login', { username, password });
    return response;
  } catch (er) {
    return er;
  }
};

const postBlog = async ({ title, author, url }) => {
  const token = JSON.parse(window.localStorage.getItem('userData')).token;
  const config = {
    headers: { Authorization: getToken(token) },
  };
  try {
    const response = await axios.post(
      '/api/blogs',
      {
        title,
        author,
        url,
      },
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const putBlog = async ({ blogId, user, likes, author, title, url }) => {
  const token = JSON.parse(window.localStorage.getItem('userData')).token;
  const config = {
    headers: { Authorization: getToken(token) },
  };

  try {
    const response = await axios.put(
      `/api/blogs/${blogId}`,
      {
        user,
        title,
        author,
        url,
        likes,
      },
      config
    );
    return response;
  } catch (e) {
    return e;
  }
};

const deleteBlog = async ({ blogId }) => {
  const token = JSON.parse(window.localStorage.getItem('userData')).token;
  const config = {
    headers: { Authorization: getToken(token) },
  };
  try {
    const response = await axios.delete(`/api/blogs/${blogId}`, config);
    return response;
  } catch (e) {
    return e;
  }
};

export default { getAll, logIn, postBlog, putBlog, deleteBlog };
